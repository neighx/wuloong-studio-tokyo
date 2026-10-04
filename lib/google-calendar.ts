import { google } from "googleapis"
import { isLiveProductionTarget, isTestIntegrationAllowed } from "./env"

export interface TimeSlot {
  start: string
  end: string
  available: boolean
}

export interface BookingEvent {
  planId: string
  planName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerInstagram?: string
  message?: string
  isFirstTime: boolean
  startTime: string
  endTime: string
}

type CalendarMode = "mock" | "test" | "live"

/**
 * 実行対象に応じて、どのカレンダーに書き込むかを決める。
 *
 * - production（Vercelが自動付与するVERCEL_ENV）以外では、原則 mock。
 * - 明示的に ALLOW_TEST_INTEGRATION=true を設定し、かつ
 *   GOOGLE_TEST_CALENDAR_ID（本番とは別のテスト専用カレンダー）が
 *   設定されている場合のみ、Preview/ローカルから実際のGoogle連携を試せる。
 * - 本番で認証情報が不足している場合は mock にフォールバックせず、
 *   呼び出し元で明示的に失敗させる（getRequiredCalendarConfig参照）。
 */
function getCalendarMode(): CalendarMode {
  if (isLiveProductionTarget()) return "live"
  if (isTestIntegrationAllowed() && process.env.GOOGLE_TEST_CALENDAR_ID) return "test"
  return "mock"
}

function getCalendarClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) return null

  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
  return google.calendar({ version: "v3", auth })
}

/**
 * live/test モードで実際にAPIを呼ぶために必要な設定が揃っているかを確認する。
 * 揃っていなければ例外を投げる（＝mockの「成功」を返さず明示的に失敗させる）。
 */
function getRequiredCalendarConfig(mode: "live" | "test") {
  const calendar = getCalendarClient()
  const calendarId = mode === "live" ? process.env.GOOGLE_CALENDAR_ID : process.env.GOOGLE_TEST_CALENDAR_ID

  if (!calendar || !calendarId) {
    const missing = [
      !process.env.GOOGLE_CLIENT_ID && "GOOGLE_CLIENT_ID",
      !process.env.GOOGLE_CLIENT_SECRET && "GOOGLE_CLIENT_SECRET",
      !process.env.GOOGLE_REFRESH_TOKEN && "GOOGLE_REFRESH_TOKEN",
      !calendarId && (mode === "live" ? "GOOGLE_CALENDAR_ID" : "GOOGLE_TEST_CALENDAR_ID"),
    ].filter(Boolean)
    throw new Error(
      `[calendar] ${mode} mode requires calendar credentials, but these are missing: ${missing.join(", ")}`
    )
  }

  return { calendar, calendarId }
}

/**
 * 現在の実行環境（mock/test/live）で、カレンダー連携に必要な設定が
 * 揃っているかを先に確認する。mockでは何もしない。
 * live/testで不足している場合は、その場で例外を投げて呼び出し元に
 * 明示的な失敗を返させる（モックの「成功」にフォールバックしない）。
 */
export function assertCalendarConfigured(): void {
  const mode = getCalendarMode()
  if (mode === "mock") return
  getRequiredCalendarConfig(mode)
}

/**
 * mockモード専用の、プロセス内メモリだけの簡易ストア。
 * 実際のカレンダーには一切書き込まない。
 *   - mockBookedSlots: 「一度mockで申込を受け付けた枠は次の空き状況取得で
 *     busy になる」という最低限の整合性を再現する。
 *   - mockReceiptIndex: 受付番号→イベント情報。findBookingByReceiptの
 *     mock版の検索対象（実際のカレンダー検索の代わり）。
 * いずれもプロセス再起動・複数インスタンスでは共有されない
 * （mockはローカル検証専用であり、この制約は仕様）。
 */
const mockBookedSlots = new Set<string>()
const mockReceiptIndex = new Map<string, { eventId: string; notificationFailed: boolean }>()

// ── 空き時間取得 ──────────────────────────────────
export async function getAvailableSlots(date: string, durationHours: number): Promise<TimeSlot[]> {
  const mode = getCalendarMode()

  if (mode === "mock") return generateMockSlots(date, durationHours)

  const { calendar, calendarId } = getRequiredCalendarConfig(mode)

  const dayStart = new Date(`${date}T00:00:00+09:00`).toISOString()
  const dayEnd   = new Date(`${date}T23:59:59+09:00`).toISOString()

  const res = await (calendar as any).events.list({
    calendarId,
    timeMin: dayStart,
    timeMax: dayEnd,
    singleEvents: true,
    orderBy: "startTime",
  })

  // 確定済みイベントだけでなく「[予約申込・未確定]」の仮イベントも busy として扱う。
  // 申込時点で枠の確保を保証するわけではないが、同じ枠へ次々と競合する申込が
  // 積み重なるのを避けるための運用判断（詳細はdocs/booking-confirmation-runbook.md）。
  const busyTimes: { start: string; end: string }[] =
    (res.data.items ?? []).map((e: any) => ({
      start: e.start?.dateTime ?? e.start?.date,
      end:   e.end?.dateTime   ?? e.end?.date,
    }))

  return computeAvailableSlots(date, busyTimes, durationHours)
}

// ── 申込（未確定）イベント作成 ──────────────────────────────
// スタッフが内容を確認して確定するまでは、カレンダー上も「未確定」のまま。
// 自動のカレンダー招待・確定通知は送らない（attendeesを付けず、sendUpdates: "none"）。
export async function createBookingEvent(booking: BookingEvent, receiptNumber: string): Promise<string> {
  const mode = getCalendarMode()
  const summaryPrefix = mode === "test" ? "[TEST予約申込・未確定]" : "[予約申込・未確定]"
  const description = buildDescription(booking, receiptNumber)

  if (mode === "mock") {
    const eventId = "mock-event-id-" + Date.now()
    mockBookedSlots.add(booking.startTime)
    mockReceiptIndex.set(receiptNumber, { eventId, notificationFailed: false })
    console.log("[mock] Would create PENDING(未確定) calendar event:", booking.customerName, receiptNumber)
    return eventId
  }

  const { calendar, calendarId } = getRequiredCalendarConfig(mode)

  const event = await (calendar as any).events.insert({
    calendarId,
    sendUpdates: "none", // 自動のカレンダー招待・通知メールは送らない
    requestBody: {
      summary: `${summaryPrefix} ${booking.planName} — ${booking.customerName}`,
      description,
      start: { dateTime: booking.startTime, timeZone: "Asia/Tokyo" },
      end:   { dateTime: booking.endTime,   timeZone: "Asia/Tokyo" },
      colorId: "8", // 未確定は確定済み(旧"9")と区別できる色にする
      // attendeesは付けない＝Googleカレンダーからの自動招待メールを送らない
    },
  })
  return event.data.id ?? ""
}

/** 指定した開始時刻（ISO、+09:00）が現在もその duration で空いているかを再確認する。 */
export async function isSlotStillAvailable(
  date: string,
  startTime: string,
  durationHours: number
): Promise<boolean> {
  const slots = await getAvailableSlots(date, durationHours)
  const slot = slots.find((s) => s.start === startTime)
  return !!slot?.available
}

/**
 * 受付番号で、その日の既存イベントを検索する（カレンダー自体を正として使う）。
 * メモリ内キャッシュがヒットしなかった場合のフォールバック、または
 * 別プロセス・再起動後でも「この申込は既に受け付け済みか」を判定するために使う。
 * 見つかった場合、そのイベントの通知送信状況（notificationFailed）も返す。
 */
export async function findBookingByReceipt(
  date: string,
  receiptNumber: string
): Promise<{ eventId: string; notificationFailed: boolean } | null> {
  const mode = getCalendarMode()

  if (mode === "mock") {
    const hit = mockReceiptIndex.get(receiptNumber)
    return hit ?? null
  }

  const { calendar, calendarId } = getRequiredCalendarConfig(mode)
  const dayStart = new Date(`${date}T00:00:00+09:00`).toISOString()
  const dayEnd   = new Date(`${date}T23:59:59+09:00`).toISOString()

  const res = await (calendar as any).events.list({
    calendarId,
    timeMin: dayStart,
    timeMax: dayEnd,
    singleEvents: true,
    q: receiptNumber, // Google Calendar側の全文検索（summary/descriptionを対象）で絞り込む
  })

  const match = (res.data.items ?? []).find((e: any) => (e.description ?? "").includes(receiptNumber))
  if (!match?.id) return null

  const notificationFailed = (match.description ?? "").includes(NOTIFICATION_FAILED_MARKER)
  return { eventId: match.id, notificationFailed }
}

const NOTIFICATION_FAILED_MARKER = "⚠️ 通知メール送信失敗"

/**
 * カレンダー登録には成功したが、確認メールの送信に失敗した場合に呼ぶ。
 * イベントの説明欄に目印を追記し、スタッフがカレンダーを見るだけで
 * 「このお客様には連絡が届いていない可能性がある」と分かるようにする
 * （新しい管理画面やDBを使わず、既存のカレンダーだけで記録する）。
 */
export async function markNotificationFailed(eventId: string, receiptNumber: string): Promise<void> {
  const mode = getCalendarMode()

  // この関数はどのモードでも例外を外へ投げない。カレンダーへの追記（記録）自体が
  // 失敗しても、既に受け付け済みの申込を失敗扱いにしないための設計。
  // 追記できなかった事実は必ずサーバーログへ残す。
  try {
    if (mode === "mock") {
      // テスト専用フック：BOOKING_TEST_FORCE_CALENDAR_PATCH_FAILURE=true の場合、
      // 「通知失敗の記録（カレンダーへの追記）自体も失敗する」状況を再現する
      // （外部通信は発生しない。liveモードでは無視される）。
      if (process.env.BOOKING_TEST_FORCE_CALENDAR_PATCH_FAILURE === "true") {
        throw new Error(
          "[mock] forced failure for testing (BOOKING_TEST_FORCE_CALENDAR_PATCH_FAILURE)"
        )
      }
      const entry = mockReceiptIndex.get(receiptNumber)
      if (entry) entry.notificationFailed = true
      console.warn("[mock] notification failed for receipt", receiptNumber, eventId)
      return
    }

    const { calendar, calendarId } = getRequiredCalendarConfig(mode)
    const current = await (calendar as any).events.get({ calendarId, eventId })
    const description: string = current.data.description ?? ""
    if (description.includes(NOTIFICATION_FAILED_MARKER)) return // 既に記録済み
    await (calendar as any).events.patch({
      calendarId,
      eventId,
      requestBody: { description: `${NOTIFICATION_FAILED_MARKER}（スタッフが手動で顧客へご連絡ください）\n${description}` },
    })
  } catch (error) {
    // カレンダーへの追記自体が失敗しても、予約受付そのものの成功を取り消さない。
    // サーバーログに残すことが最低限のフォールバック記録になる。
    console.error("[bookings] Failed to mark notification failure on calendar event:", receiptNumber, error)
  }
}

// ── ヘルパー ──────────────────────────────────────
function buildDescription(booking: BookingEvent, receiptNumber: string): string {
  return [
    `受付番号: ${receiptNumber}`,
    `ステータス: 未確定（スタッフ確認待ち）`,
    `プラン: ${booking.planName}`,
    `お名前: ${booking.customerName}`,
    `メール: ${booking.customerEmail}`,
    `電話: ${booking.customerPhone}`,
    booking.customerInstagram ? `Instagram: @${booking.customerInstagram}` : null,
    `初回利用: ${booking.isFirstTime ? "はい" : "いいえ"}`,
    booking.message ? `\nご相談内容:\n${booking.message}` : null,
  ]
    .filter(Boolean)
    .join("\n")
}

const STUDIO_OPEN_HOUR = 10
const STUDIO_CLOSE_HOUR = 22

function studioStartHours(durationHours: number): number[] {
  const starts: number[] = []
  for (let h = STUDIO_OPEN_HOUR; h + durationHours <= STUDIO_CLOSE_HOUR; h++) starts.push(h)
  return starts
}

export function computeAvailableSlots(
  date: string,
  busyTimes: { start: string; end: string }[],
  durationHours: number
): TimeSlot[] {
  return studioStartHours(durationHours).map((hour) => {
    const start = `${date}T${String(hour).padStart(2, "0")}:00:00+09:00`
    const end   = `${date}T${String(hour + durationHours).padStart(2, "0")}:00:00+09:00`
    const busy  = busyTimes.some((b) => b.start < end && b.end > start)
    return { start, end, available: !busy }
  })
}

function generateMockSlots(date: string, durationHours: number): TimeSlot[] {
  // mockBookedSlotsにある申込済み開始時刻を、今回問い合わせ中のdurationHoursで
  // 占有しているものとして扱う（プラン毎に所要時間が異なる将来の拡張時は
  // 申込時のdurationHoursも保存する形に見直すこと）
  const busyTimes = Array.from(mockBookedSlots)
    .filter((start) => start.startsWith(date))
    .map((start) => {
      const hour = parseInt(start.slice(11, 13), 10)
      return {
        start,
        end: `${date}T${String(hour + durationHours).padStart(2, "0")}:00:00+09:00`,
      }
    })
  return computeAvailableSlots(date, busyTimes, durationHours)
}
