/**
 * Google Calendar integration
 *
 * Setup:
 *   1. npm install googleapis
 *   2. Google Cloud Console → Calendar API を有効化 → OAuth認証情報を作成
 *   3. node scripts/get-refresh-token.mjs → GOOGLE_REFRESH_TOKEN を取得
 *   4. .env.local に 4つの環境変数を設定
 */

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

// ── 環境変数チェック ──────────────────────────────
function getCalendarClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    return null // not configured yet → fall back to mock
  }

  // Dynamic import so the build doesn't break without googleapis installed
  // After `npm install googleapis`, this will work.
  // const { google } = require("googleapis")
  // const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
  // auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
  // return google.calendar({ version: "v3", auth })
  return null // TODO: uncomment after npm install googleapis
}

// ── 空き時間取得 ──────────────────────────────────
export async function getAvailableSlots(date: string): Promise<TimeSlot[]> {
  const calendar = getCalendarClient()

  if (!calendar) {
    return generateMockSlots(date) // dev / before API setup
  }

  // TODO: uncomment after npm install googleapis
  // const calendarId = process.env.GOOGLE_CALENDAR_ID!
  // const dayStart = new Date(`${date}T00:00:00+09:00`).toISOString()
  // const dayEnd   = new Date(`${date}T23:59:59+09:00`).toISOString()
  //
  // const res = await (calendar as any).events.list({
  //   calendarId,
  //   timeMin: dayStart,
  //   timeMax: dayEnd,
  //   singleEvents: true,
  //   orderBy: "startTime",
  // })
  //
  // const busyTimes: { start: string; end: string }[] =
  //   (res.data.items ?? []).map((e: any) => ({
  //     start: e.start?.dateTime ?? e.start?.date,
  //     end:   e.end?.dateTime   ?? e.end?.date,
  //   }))
  //
  // return computeAvailableSlots(date, busyTimes)

  return generateMockSlots(date)
}

// ── 予約イベント作成 ──────────────────────────────
export async function createBookingEvent(booking: BookingEvent): Promise<string> {
  const calendar = getCalendarClient()

  if (!calendar) {
    console.log("[mock] Would create calendar event:", booking.customerName)
    return "mock-event-id-" + Date.now()
  }

  // TODO: uncomment after npm install googleapis
  // const calendarId = process.env.GOOGLE_CALENDAR_ID!
  // const event = await (calendar as any).events.insert({
  //   calendarId,
  //   sendUpdates: "all",   // お客様にも招待メールを送る
  //   requestBody: {
  //     summary: `[予約] ${booking.planName} — ${booking.customerName}`,
  //     description: buildDescription(booking),
  //     start: { dateTime: booking.startTime, timeZone: "Asia/Tokyo" },
  //     end:   { dateTime: booking.endTime,   timeZone: "Asia/Tokyo" },
  //     attendees: [{ email: booking.customerEmail }],
  //     colorId: "9", // blueberry
  //   },
  // })
  // return event.data.id ?? ""

  return "mock-event-id-" + Date.now()
}

// ── ヘルパー ──────────────────────────────────────
function buildDescription(booking: BookingEvent): string {
  return [
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

function computeAvailableSlots(
  date: string,
  busyTimes: { start: string; end: string }[]
): TimeSlot[] {
  const studioHours = [11, 13, 15, 17, 19, 21] // 開始時刻(JST)
  return studioHours.map((hour) => {
    const start = `${date}T${String(hour).padStart(2, "0")}:00:00+09:00`
    const end   = `${date}T${String(hour + 3).padStart(2, "0")}:00:00+09:00`
    const busy  = busyTimes.some((b) => b.start < end && b.end > start)
    return { start, end, available: !busy }
  })
}

function generateMockSlots(date: string): TimeSlot[] {
  return [
    { start: `${date}T11:00:00+09:00`, end: `${date}T14:00:00+09:00`, available: true },
    { start: `${date}T14:00:00+09:00`, end: `${date}T17:00:00+09:00`, available: false },
    { start: `${date}T17:00:00+09:00`, end: `${date}T20:00:00+09:00`, available: true },
    { start: `${date}T19:00:00+09:00`, end: `${date}T22:00:00+09:00`, available: true },
    { start: `${date}T21:00:00+09:00`, end: `${date}T24:00:00+09:00`, available: false },
  ]
}
