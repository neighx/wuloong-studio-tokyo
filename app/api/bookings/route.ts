import { NextRequest, NextResponse } from "next/server"
import {
  createBookingEvent,
  isSlotStillAvailable,
  findBookingByReceipt,
  markNotificationFailed,
  assertCalendarConfigured,
  isAllowedStartTime,
  type BookingEvent,
} from "@/lib/google-calendar"
import { sendCustomerConfirmation, sendAdminNotification, assertEmailConfigured } from "@/lib/email"
import { getPlanById, type PlanId } from "@/lib/pricing"
import { runExclusive } from "@/lib/slot-lock"
import { getCachedBookingResult, cacheBookingResult } from "@/lib/idempotency-store"
import { computeReceiptNumber } from "@/lib/receipt"
import { getJSTDateString, getEndOfNextMonth, isValidDateString } from "@/lib/datetime"
import { validateBookingInput } from "@/lib/validation"
import { checkRateLimit, bookingRateLimitRules, getClientIp, reserveConfirmationEmailQuota } from "@/lib/rate-limit"

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
  let rawBody: unknown

  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // 型・必須・文字数・メール形式・制御文字（改行等）をまとめて検証する（lib/validation.ts）。
  // ここで弾いた入力は、カレンダー照会・登録やメール送信には一切進まない。
  const validation = validateBookingInput(rawBody)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }
  const body: BookingRequest = validation.value

  // "2026-11-31" のような実在しない日付は、Dateが翌日へ繰り上げて別の日の
  // 予定を照会してしまうため、受付期間の判定より前に拒否する。
  if (!isValidDateString(body.date)) {
    return NextResponse.json({ error: "Invalid date. Use an existing date in YYYY-MM-DD" }, { status: 400 })
  }

  // Web予約は常に「翌月末日」までを受付期間とする。月初（JST 0:00）を
  // 跨ぐと「翌月」の基準日自体が進むため、毎リクエストその場で計算するだけで
  // 自動的に受付期間が延長される（別途バッチ処理は不要）。
  // それより先・過去の日付はカレンダー側でも選べないが、APIを直接叩かれた
  // 場合に備えてサーバー側でも明示的に拒否する。
  const todayJST = getJSTDateString()
  const maxBookableDate = getEndOfNextMonth(todayJST)
  if (body.date < todayJST) {
    return NextResponse.json({ error: "Requested date is in the past" }, { status: 400 })
  }
  if (body.date > maxBookableDate) {
    return NextResponse.json(
      {
        error: `この日程はWeb予約の受付期間（${maxBookableDate}まで）を超えています。Instagram DMまたはメールでご相談ください。`,
      },
      { status: 400 }
    )
  }

  // プラン・所要時間はクライアントの入力を信用せず、サーバー側の定義から取得する。
  const plan = getPlanById(body.planId as PlanId)
  if (!plan) {
    return NextResponse.json({ error: `Unknown planId: ${body.planId}` }, { status: 400 })
  }

  // 営業時間外・正時以外など、予約枠として存在しない開始時刻は空き状況の競合（409）と
  // 区別して400で拒否する。枠の定義は空き状況APIと同じもの（lib/google-calendar.ts）を使う。
  if (!isAllowedStartTime(body.time, plan.durationHours)) {
    return NextResponse.json({ error: "Requested time is not an available booking slot" }, { status: 400 })
  }

  // 開始時刻を過ぎた枠（当日の開始済みの時刻）は受け付けない。空き状況APIでも一覧から除いている。
  const startDateTime = `${body.date}T${body.time}:00+09:00`
  if (Date.parse(startDateTime) <= Date.now()) {
    return NextResponse.json({ error: "Requested time has already started" }, { status: 400 })
  }

  // カレンダー照会/登録・メール送信より前に、送信元IPの受付回数を制限する（lib/rate-limit.ts）。
  // 宛先アドレス単位の制限はここでは行わない（他人のアドレスを指定して、その人の予約を
  // 拒否させられないようにするため）。宛先単位の制限は確認メールの送信直前に行う。
  const rateLimit = await checkRateLimit(bookingRateLimitRules(getClientIp(req.headers)))
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    )
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
      // 排他処理の中でも受付番号を再確認する。同じ申込が同時に再送された場合、
      // 先に登録された自分の申込を「他の申込との競合（409）」と誤判定しないようにする。
      // （同一プロセス内では確実。別インスタンスでは、先の登録がカレンダーに反映済みの場合のみ検出できる）
      if (idempotencyKey) {
        const cached = getCachedBookingResult(receiptNumber)
        if (cached) return { conflict: false as const, duplicate: true as const, id: cached.eventId }
        try {
          const existing = await findBookingByReceipt(body.date, receiptNumber)
          if (existing) return { conflict: false as const, duplicate: true as const, id: existing.eventId }
        } catch (error) {
          console.error("[bookings] Receipt re-check inside lock failed, continuing:", receiptNumber, error)
        }
      }
      const stillAvailable = await isSlotStillAvailable(body.date, startDateTime, durationHours)
      if (!stillAvailable) return { conflict: true as const }
      const id = await createBookingEvent(bookingEvent, receiptNumber)
      // 排他処理を抜ける前に記録し、直後に同じ申込が排他処理へ入っても既存結果を返せるようにする
      if (idempotencyKey) cacheBookingResult(receiptNumber, id)
      return { conflict: false as const, duplicate: false as const, id }
    })

    if (!result.conflict && result.duplicate) {
      // 同じ申込の再送：登録・メール送信は行わず、最初の受付結果をそのまま返す
      return applicationReceivedResponse(receiptNumber, result.id)
    }
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
  // 確認メールを送る直前に、宛先ごとの送信枠を1通分確保する。入力エラー・予約競合・
  // 再送（既存結果の返却）はここまで到達しないため、宛先の送信枠を消費しない。
  // 枠が無い場合は確認メールだけを省略し、申込自体は受付済みとして扱う。
  let confirmationAllowed: boolean
  try {
    confirmationAllowed = (await reserveConfirmationEmailQuota(body.customerEmail)).allowed
  } catch (error) {
    // 想定外の失敗時は、送信の悪用を防ぐ側（確認メールを省略）に倒す
    console.error("[bookings] Failed to reserve confirmation email quota; skipping confirmation:", receiptNumber, error)
    confirmationAllowed = false
  }
  if (!confirmationAllowed) {
    console.warn("[bookings] Confirmation email skipped (per-recipient limit reached):", receiptNumber)
  }

  const emailResults = await Promise.allSettled([
    confirmationAllowed
      ? sendCustomerConfirmation({
          receiptNumber,
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          planName: plan.name,
          date: body.date,
          time: body.time,
          isFirstTime: body.isFirstTime,
        })
      : Promise.resolve(),
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
      customerConfirmationSkipped: !confirmationAllowed,
    }),
  ])

  // スタッフが把握すべき通知の問題をまとめる。管理者通知が成功していても、
  // お客様への確認メールが省略・失敗していれば記録する（成功扱いにしない）。
  const notificationIssues: string[] = []
  if (!confirmationAllowed) notificationIssues.push("お客様への確認メールは同じ宛先への送信上限のため未送信")
  if (emailResults[0].status === "rejected") {
    console.error("[bookings] Customer confirmation email failed:", receiptNumber, emailResults[0].reason)
    notificationIssues.push("お客様への確認メールの送信に失敗")
  }
  if (emailResults[1].status === "rejected") {
    console.error("[bookings] Admin notification email failed:", receiptNumber, emailResults[1].reason)
    notificationIssues.push("スタジオへの通知メールの送信に失敗")
  }
  if (notificationIssues.length > 0) {
    // 実際には送れていないメールを「送信済み」と見せない。
    // カレンダー側に目印と理由を残し、スタッフが手動で連絡状況を確認できるようにする。
    // markNotificationFailed自体は例外を投げない設計だが、万一想定外の例外が
    // 外へ漏れてもここで吸収し、受付済みの申込を失敗扱いにしない。
    // （追記できなかった事実は必ずログへ残す）
    try {
      await markNotificationFailed(eventId, receiptNumber, notificationIssues.join(" / "))
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
