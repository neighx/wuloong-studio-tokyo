import { NextRequest, NextResponse } from "next/server"
import {
  createBookingEvent,
  isSlotStillAvailable,
  findBookingByReceipt,
  markNotificationFailed,
  assertCalendarConfigured,
  type BookingEvent,
} from "@/lib/google-calendar"
import { sendCustomerConfirmation, sendAdminNotification, assertEmailConfigured } from "@/lib/email"
import { getPlanById, type PlanId } from "@/lib/pricing"
import { runExclusive } from "@/lib/slot-lock"
import { getCachedBookingResult, cacheBookingResult } from "@/lib/idempotency-store"
import { computeReceiptNumber } from "@/lib/receipt"

export interface BookingRequest {
  planId: string
  planName: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerInstagram?: string
  message?: string
  isFirstTime: boolean
  /** 同じ送信操作の再送を識別するためのクライアント生成キー（任意） */
  idempotencyKey?: string
}

// この予約システムは「申込受付」までを行い、確定はスタッフが手動で行う。
// 以下のメッセージ・ステータスは、HTTPの成功だけで「予約確定」と誤解されないよう、
// 常に受付番号とともに返す。
const APPLICATION_RECEIVED_MESSAGE =
  "予約のお申し込みを受け付けました。現在は未確定です。内容と空き状況を確認後、スタジオから確定のご連絡をします。ご希望の日時を確保できない場合は、別日程をご相談します。"

function applicationReceivedResponse(receiptNumber: string, eventId: string) {
  return NextResponse.json({
    success: true,
    status: "pending_confirmation", // 予約確定ではない。画面・計測はこのstatusで判定すること
    receiptNumber,
    eventId,
    message: APPLICATION_RECEIVED_MESSAGE,
  })
}

/**
 * POST /api/bookings
 *
 * 予約の「申込受付」を行う。カレンダーには未確定イベントとして登録し、
 * スタッフが内容を確認して手動で確定する（docs/booking-confirmation-runbook.md参照）。
 * ここでは確定通知・カレンダー招待は送らない。
 */
export async function POST(req: NextRequest) {
  let body: BookingRequest

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const required = ["planId", "planName", "date", "time", "customerName", "customerEmail", "customerPhone"]
  const missing = required.filter((key) => !body[key as keyof BookingRequest])

  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 })
  }

  if (!/^\d{2}:\d{2}$/.test(body.time)) {
    return NextResponse.json({ error: "Invalid time format. Use HH:mm" }, { status: 400 })
  }

  // プラン・所要時間はクライアントの入力を信用せず、サーバー側の定義から取得する。
  const plan = getPlanById(body.planId as PlanId)
  if (!plan) {
    return NextResponse.json({ error: `Unknown planId: ${body.planId}` }, { status: 400 })
  }

  // この環境（mock/test/live）で予約連携に必要な設定が揃っているかを先に確認する。
  // 揃っていない場合はここで明示的に失敗させる（モックの成功で隠さない）。
  try {
    assertCalendarConfigured()
    assertEmailConfigured()
  } catch (error) {
    console.error("[bookings] Integration not configured for this environment:", error)
    return NextResponse.json(
      { error: "Booking system is not fully configured for this environment" },
      { status: 500 }
    )
  }

  const startDateTime = `${body.date}T${body.time}:00+09:00`
  const durationHours = plan.durationHours
  const endHour = parseInt(body.time.split(":")[0]) + durationHours
  const endDateTime = `${body.date}T${String(endHour).padStart(2, "0")}:${body.time.split(":")[1]}:00+09:00`

  // idempotencyKey + 申込内容（プラン・日時・連絡先等）から、受付番号を決定論的に計算する。
  // 内容が変われば（別プロセス・再起動後でも）別の受付番号になるため、
  // 「同じキーだが内容が違う申込」が古い成功結果を受け取ることはない。
  const idempotencyKey = body.idempotencyKey ?? ""
  const receiptNumber = computeReceiptNumber(idempotencyKey, {
    planId: plan.id,
    date: body.date,
    time: body.time,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    customerInstagram: body.customerInstagram,
    message: body.message,
    isFirstTime: body.isFirstTime,
  })

  // ── 再送判定 ──────────────────────────────────────────────
  // 同じ受付番号で既に受付済みなら、新規の空き確認・登録・メール送信は行わず、
  // 直前の結果をそのまま返す（＝「同じ申込操作の再送」と「別利用者の競合予約」を区別する）。
  if (idempotencyKey) {
    const fastPathHit = getCachedBookingResult(receiptNumber)
    if (fastPathHit) {
      return applicationReceivedResponse(receiptNumber, fastPathHit.eventId)
    }

    try {
      // メモリキャッシュがミスしても（別プロセス・再起動後等）、
      // カレンダー自体を正として同じ受付番号の既存申込を探す。
      const existing = await findBookingByReceipt(body.date, receiptNumber)
      if (existing) {
        cacheBookingResult(receiptNumber, existing.eventId) // 次回以降の高速パス用
        return applicationReceivedResponse(receiptNumber, existing.eventId)
      }
    } catch (error) {
      // 検索自体が失敗した場合は、安全側として新規申込として処理を続行する。
      // 最悪、同じ申込がもう一件「未確定」として作られるだけで、
      // 自動確定されるわけではないため実害は限定的（残存する制約。後述のREADME参照）。
      console.error("[bookings] Receipt lookup failed, proceeding as new application:", receiptNumber, error)
    }
  }

  const bookingEvent: BookingEvent = {
    planId: plan.id,
    planName: plan.name,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    customerInstagram: body.customerInstagram,
    message: body.message,
    isFirstTime: body.isFirstTime,
    startTime: startDateTime,
    endTime: endDateTime,
  }

  let eventId: string
  try {
    // 「空き状況の確認」と「カレンダーへの登録（未確定イベント）」を、同じ日
    // （スタジオ全体）単位で直列化する。開始時刻単位ではなく日付単位でロック
    // することで、「13:00〜16:00」と「14:00〜17:00」のように開始時刻が異なるが
    // 時間帯が重なるリクエスト同士の競合も直列化の対象になる
    // （プロセス内のみの直列化。範囲はlib/slot-lock.ts参照）。
    const result = await runExclusive(`studio:${body.date}`, async () => {
      const stillAvailable = await isSlotStillAvailable(body.date, startDateTime, durationHours)
      if (!stillAvailable) return { conflict: true as const }
      const id = await createBookingEvent(bookingEvent, receiptNumber)
      return { conflict: false as const, id }
    })

    if (result.conflict) {
      return NextResponse.json(
        { error: "この時間帯は他のお申し込みが入っています。別の時間をお選びください。" },
        { status: 409 }
      )
    }
    eventId = result.id
  } catch (error) {
    // カレンダーへの保存自体が失敗した場合は、受付成功を返さない。
    console.error("[bookings] Error saving application to calendar:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }

  // ここまでで「申込の受付（カレンダー保存）」自体は成功している。
  // 以降のメール送信が失敗しても、申込自体を失敗扱いにはしない
  // （再送を促さない。受付番号は返し、通知失敗はカレンダー側に記録する）。
  if (idempotencyKey) cacheBookingResult(receiptNumber, eventId)

  const emailResults = await Promise.allSettled([
    sendCustomerConfirmation({
      receiptNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      planName: plan.name,
      date: body.date,
      time: body.time,
      isFirstTime: body.isFirstTime,
    }),
    sendAdminNotification({
      receiptNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      planName: plan.name,
      date: body.date,
      time: body.time,
      isFirstTime: body.isFirstTime,
      instagram: body.customerInstagram,
      message: body.message,
    }),
  ])

  const anyEmailFailed = emailResults.some((r) => r.status === "rejected")
  emailResults.forEach((r) => {
    if (r.status === "rejected") console.error("[bookings] Email send failed:", receiptNumber, r.reason)
  })
  if (anyEmailFailed) {
    // 実際には送れていないメールを「送信済み」と見せない。
    // カレンダー側に目印を残し、スタッフが手動で連絡状況を確認できるようにする。
    // markNotificationFailed自体は例外を投げない設計だが、万一想定外の例外が
    // 外へ漏れてもここで吸収し、受付済みの申込を失敗扱いにしない。
    // （追記できなかった事実は必ずログへ残す）
    try {
      await markNotificationFailed(eventId, receiptNumber)
    } catch (error) {
      console.error(
        "[bookings] Unexpected error while recording notification failure (booking remains accepted):",
        receiptNumber,
        error
      )
    }
  }

  return applicationReceivedResponse(receiptNumber, eventId)
}
