// 予約・空き状況・問い合わせAPIの回帰テスト（外部通信なし）。
// - Googleカレンダー: tests/support/mocks/googleapis.mjs の偽カレンダー（test モードの実コード経路を通す）
// - メール: nodemailer の streamTransport（ローカルでメールを組み立てるだけで送信しない）
// - fetch: すべて遮断
// - 現在時刻: 2026-10-24 12:00 JST に固定（受付期間は 2026-11-30 まで）
//
// 実行: npm run test:booking
import { describe, it, beforeEach } from "node:test"
import assert from "node:assert/strict"

if (process.env.VERCEL_ENV === "production") throw new Error("Refusing to run API tests with VERCEL_ENV=production")
Object.assign(process.env, {
  ALLOW_TEST_INTEGRATION: "true",
  GOOGLE_TEST_CALENDAR_ID: "fake-test-calendar",
  GOOGLE_CLIENT_ID: "dummy",
  GOOGLE_CLIENT_SECRET: "dummy",
  GOOGLE_REFRESH_TOKEN: "dummy",
  TEST_ADMIN_EMAIL: "studio-test@example.invalid",
  GMAIL_USER: "sender@example.invalid",
  GMAIL_APP_PASSWORD: "dummy",
  VERCEL: "1",
})
delete process.env.VERCEL_ENV

globalThis.fetch = async (url) => { throw new Error(`Unexpected external fetch in test: ${url}`) }

const RealDate = Date
const NOW = RealDate.parse("2026-10-24T03:00:00Z") // 2026-10-24 12:00 JST
globalThis.Date = class extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(NOW) }
  static now() { return NOW }
}

// メール: 送信せずに内容だけ記録する（失敗の注入もできる）
const { default: nodemailer } = await import("nodemailer")
const realCreateTransport = nodemailer.createTransport
const mails = []
const mailFailure = { customer: false, admin: false }
nodemailer.createTransport = () => {
  const local = realCreateTransport({ streamTransport: true, buffer: true, newline: "unix" })
  return {
    async sendMail(opts) {
      const kind = opts.subject.includes("予約申込の受付") ? "customer" : opts.subject.includes("お問い合わせ") ? "contact" : "admin"
      if (mailFailure[kind]) throw new Error(`simulated ${kind} mail failure`)
      const info = await local.sendMail(opts)
      mails.push({ kind, opts, headers: info.message.toString().split("\n\n")[0] })
      return info
    },
  }
}
const logs = []
console.log = () => {}
console.warn = (...a) => logs.push(a.join(" "))
console.error = (...a) => logs.push(a.join(" "))

const { NextRequest } = await import("next/server")
const bookings = await import("../app/api/bookings/route.ts")
const availability = await import("../app/api/availability/route.ts")
const contact = await import("../app/api/contact/route.ts")
const rateLimit = await import("../lib/rate-limit.ts")
const calendar = globalThis.__fakeCalendar

let seq = 0
const nextIp = () => { seq++; return `198.51.${Math.floor(seq / 250)}.${(seq % 250) + 1}` }
const nextEmail = () => `user${++seq}@example.com`
const bookingBody = (over = {}) => ({
  planId: "standard-3h", planName: "通常レコーディング 3時間", date: "2026-11-20", time: "10:00",
  customerName: "テスト 太郎", customerEmail: nextEmail(), customerPhone: "090-0000-0000",
  customerInstagram: "", message: "", isFirstTime: false, ...over,
})
async function post(route, body, { ip = nextIp(), raw = false } = {}) {
  const res = await route.POST(new NextRequest("http://localhost/api/test", {
    method: "POST", headers: { "content-type": "application/json", "x-vercel-forwarded-for": ip },
    body: raw ? body : JSON.stringify(body),
  }))
  return { status: res.status, json: await res.json().catch(() => ({})), retryAfter: res.headers.get("retry-after") }
}
async function slotsOf(date, planId = "standard-3h") {
  const res = await availability.GET(new NextRequest(`http://localhost/api/availability?date=${date}&planId=${planId}`))
  return (await res.json()).slots ?? []
}
const slot = (slots, hh) => slots.find((s) => s.start.includes(`T${hh}:00:00`))
const eventsAt = (date, hh) => calendar.events.filter((e) => e.start.dateTime === `${date}T${hh}:00:00+09:00`)

beforeEach(() => {
  calendar.events.length = 0
  mails.length = 0
  logs.length = 0
  mailFailure.customer = mailFailure.admin = false
})

describe("入力検証（400・外部への副作用なし）", () => {
  const cases = [
    ["本文が null", "null", true],
    ["本文が配列", "[]", true],
    ["JSONとして不正", "{bad", true],
    ["time が配列", bookingBody({ time: ["10:00"] })],
    ["time が数値", bookingBody({ time: 1000 })],
    ["customerName が数値", bookingBody({ customerName: 123 })],
    ["isFirstTime が文字列", bookingBody({ isFirstTime: "yes" })],
    ["氏名が101文字", bookingBody({ customerName: "あ".repeat(101) })],
    ["電話番号が31文字", bookingBody({ customerPhone: "0".repeat(31) })],
    ["メッセージが2001文字", bookingBody({ message: "あ".repeat(2001) })],
    ["メール形式でない", bookingBody({ customerEmail: "not-an-email" })],
    ["メールに複数宛先（カンマ）", bookingBody({ customerEmail: "a@example.com,b@example.com" })],
    ["メールに複数宛先（セミコロン）", bookingBody({ customerEmail: "a@example.com;b@example.com" })],
    ["メールに表示名付き", bookingBody({ customerEmail: "Name <a@example.com>" })],
    ["メールに改行（ヘッダー注入）", bookingBody({ customerEmail: "a@example.com\r\nBcc: x@example.com" })],
    ["氏名に改行", bookingBody({ customerName: "テスト\nBcc: x@example.com" })],
    ["存在しないプラン", bookingBody({ planId: "free-session" })],
    ["実在しない日付（11/31）", bookingBody({ date: "2026-11-31" })],
    ["受付期間外（12/01）", bookingBody({ date: "2026-12-01" })],
    ["過去の日付", bookingBody({ date: "2026-10-23" })],
    ["営業時間外（09:00）", bookingBody({ time: "09:00" })],
    ["正時でない（13:30）", bookingBody({ time: "13:30" })],
    ["3時間枠が閉店を超える（20:00）", bookingBody({ time: "20:00" })],
    ["当日の開始済み時刻（現在12:00に10:00）", bookingBody({ date: "2026-10-24", time: "10:00" })],
    ["当日のちょうど現在時刻（12:00）", bookingBody({ date: "2026-10-24", time: "12:00" })],
  ]
  for (const [label, body, raw] of cases) {
    it(`予約: ${label}`, async () => {
      const r = await post(bookings, body, { raw })
      assert.equal(r.status, 400, JSON.stringify(r.json))
      assert.equal(calendar.events.length, 0)
      assert.equal(mails.length, 0)
    })
  }

  for (const [label, body] of [
    ["氏名なし", { name: "", email: "a@example.com", message: "m" }],
    ["メール形式でない", { name: "a", email: "nope", message: "m" }],
    ["メールに複数宛先", { name: "a", email: "a@example.com,b@example.com", message: "m" }],
    ["件名が選択肢外", { name: "a", email: "a@example.com", subject: "free text", message: "m" }],
    ["本文5001文字", { name: "a", email: "a@example.com", message: "a".repeat(5001) }],
    ["本文が null", null],
  ]) {
    it(`問い合わせ: ${label}`, async () => {
      const r = await post(contact, body)
      assert.equal(r.status, 400)
      assert.equal(mails.length, 0)
    })
  }

  it("上限ちょうどの入力と改行入りメッセージは受け付ける", async () => {
    const r = await post(bookings, bookingBody({ customerName: "あ".repeat(100), customerPhone: "0".repeat(30), message: "1行目\n2行目" }))
    assert.equal(r.status, 200)
    assert.equal(r.json.status, "pending_confirmation")
  })
})

describe("空き判定（時刻の数値比較・終日予定・隣接・開始済み）", () => {
  const addEvent = (start, end) => calendar.events.push({ id: `seed-${calendar.events.length}`, summary: "既存の予定", start, end })

  for (const [label, start, end] of [
    ["UTC表記（Z）", "2026-11-10T04:00:00Z", "2026-11-10T07:00:00Z"],
    ["+09:00表記", "2026-11-10T13:00:00+09:00", "2026-11-10T16:00:00+09:00"],
    ["+01:00表記", "2026-11-10T05:00:00+01:00", "2026-11-10T08:00:00+01:00"],
  ]) {
    it(`既存の予定（13:00〜16:00 JST、${label}）と重なる枠は空きなし、隣接枠は空き`, async () => {
      addEvent({ dateTime: start }, { dateTime: end })
      const s = await slotsOf("2026-11-10")
      assert.equal(slot(s, "13").available, false)
      assert.equal(slot(s, "11").available, false, "11:00〜14:00 は重なる")
      assert.equal(slot(s, "15").available, false, "15:00〜18:00 は重なる")
      assert.equal(slot(s, "10").available, true, "10:00〜13:00 は直前に隣接")
      assert.equal(slot(s, "16").available, true, "16:00〜19:00 は直後に隣接")
      assert.equal((await post(bookings, bookingBody({ date: "2026-11-10", time: "13:00" }))).status, 409)
      assert.equal((await post(bookings, bookingBody({ date: "2026-11-10", time: "10:00" }))).status, 200)
      assert.equal((await post(bookings, bookingBody({ date: "2026-11-10", time: "16:00" }))).status, 200)
    })
  }

  it("終日予定の日は全枠が空きなし、翌日（終了日はその日を含まない）は空き", async () => {
    addEvent({ date: "2026-11-13" }, { date: "2026-11-14" })
    assert.equal((await slotsOf("2026-11-13")).every((s) => !s.available), true)
    assert.equal((await slotsOf("2026-11-14")).every((s) => s.available), true)
    assert.equal((await post(bookings, bookingBody({ date: "2026-11-13", time: "10:00" }))).status, 409)
  })

  it("日時を解析できない予定がある日は、二重予約を避けるため全枠を空きなしにする", async () => {
    addEvent({ dateTime: "not-a-date" }, { dateTime: "2026-11-15T12:00:00+09:00" })
    assert.equal((await slotsOf("2026-11-15")).length > 0, true)
    assert.equal((await slotsOf("2026-11-15")).every((s) => !s.available), true)
  })

  it("当日は開始済みの枠（現在12:00 → 10:00〜12:00開始）を一覧から除く", async () => {
    const s = await slotsOf("2026-10-24")
    assert.deepEqual(s.map((x) => x.start.slice(11, 16)), ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"])
  })

  it("JSTの受付期間: 11/30は受付、12/01は400（日付境界）", async () => {
    assert.equal((await post(bookings, bookingBody({ date: "2026-11-30", time: "19:00" }))).status, 200)
    assert.equal((await post(bookings, bookingBody({ date: "2026-12-01", time: "10:00" }))).status, 400)
  })
})

describe("同時申込と同じ申込の再送（同一プロセス）", () => {
  it("同じ申込を同時に2回送ると、両方200・同じ受付番号・登録1件・メールは1回ずつ", async () => {
    const body = bookingBody({ date: "2026-11-16", time: "10:00", idempotencyKey: "same-request-1" })
    const [a, b] = await Promise.all([post(bookings, body), post(bookings, body)])
    assert.deepEqual([a.status, b.status], [200, 200])
    assert.equal(a.json.receiptNumber, b.json.receiptNumber)
    assert.equal(eventsAt("2026-11-16", "10").length, 1)
    assert.equal(mails.filter((m) => m.kind === "customer").length, 1)
    assert.equal(mails.filter((m) => m.kind === "admin").length, 1)
  })

  it("受付後の再送は同じ受付番号を返し、登録・メールを重ねない", async () => {
    const body = bookingBody({ date: "2026-11-17", time: "10:00", idempotencyKey: "same-request-2" })
    const first = await post(bookings, body)
    const again = await post(bookings, body)
    assert.equal(again.status, 200)
    assert.equal(again.json.receiptNumber, first.json.receiptNumber)
    assert.equal(eventsAt("2026-11-17", "10").length, 1)
    assert.equal(mails.length, 2)
  })

  it("別の申込が同じ枠に同時に届くと、1件だけ登録し、もう1件は409", async () => {
    const [a, b] = await Promise.all([
      post(bookings, bookingBody({ date: "2026-11-18", time: "13:00" })),
      post(bookings, bookingBody({ date: "2026-11-18", time: "14:00" })),
    ])
    assert.deepEqual([a.status, b.status].sort(), [200, 409])
    assert.equal(calendar.events.filter((e) => e.start.dateTime.startsWith("2026-11-18")).length, 1)
  })
})

describe("メール（HTMLエスケープ・送信失敗・宛先ごとの送信枠）", () => {
  it("氏名・メッセージのHTMLはエスケープされ、改行は<br>になる", async () => {
    const r = await post(bookings, bookingBody({
      date: "2026-11-19", time: "10:00",
      customerName: `<a href="https://evil.example/">確認</a>`, message: `<script>alert(1)</script>\n次の行 & "引用"`,
    }))
    assert.equal(r.status, 200)
    const html = mails.map((m) => m.opts.html).join("\n")
    assert.equal(/<a href="https:\/\/evil|<script>/.test(html), false)
    assert.match(html, /&lt;a href=&quot;https:\/\/evil\.example\/&quot;&gt;確認&lt;\/a&gt;/)
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;<br>次の行 &amp; &quot;引用&quot;/)
    assert.equal(mails.some((m) => /^bcc:/im.test(m.headers)), false)
  })

  it("問い合わせメールもエスケープする", async () => {
    const r = await post(contact, { name: "<b>名前</b>", email: nextEmail(), subject: "pricing", message: "<img src=x onerror=alert(1)>" })
    assert.equal(r.status, 200)
    assert.equal(mails[0].opts.html.includes("<img src=x"), false)
    assert.equal(mails[0].opts.html.includes("&lt;b&gt;名前&lt;/b&gt;"), true)
  })

  it("確認メールの送信に失敗しても、申込は受付成功（200）のまま、カレンダーに理由を記録する", async () => {
    mailFailure.customer = true
    const r = await post(bookings, bookingBody({ date: "2026-11-21", time: "10:00" }))
    assert.equal(r.status, 200)
    assert.equal(r.json.status, "pending_confirmation")
    assert.match(eventsAt("2026-11-21", "10")[0].description, /通知メール送信失敗（お客様への確認メールの送信に失敗/)
  })

  it("同じ宛先への確認メールは1時間3通まで。4件目も申込は受け付け、確認メールだけ省略してスタッフに知らせる", async () => {
    const email = nextEmail()
    const statuses = []
    for (const [i, date] of ["2026-11-23", "2026-11-24", "2026-11-25", "2026-11-26"].entries()) {
      statuses.push((await post(bookings, bookingBody({ date, time: "10:00", customerEmail: i % 2 ? email.toUpperCase() : email }))).status)
    }
    assert.deepEqual(statuses, [200, 200, 200, 200])
    assert.equal(mails.filter((m) => m.kind === "customer").length, 3)
    const lastAdmin = mails.filter((m) => m.kind === "admin").at(-1)
    assert.match(lastAdmin.opts.subject, /【確認メール未送信】/)
    assert.match(eventsAt("2026-11-26", "10")[0].description, /同じ宛先への送信上限のため未送信/)
  })
})

describe("回数制限（プロセス内メモリ）", () => {
  it("予約: 同じIPから10分に6件目は429（Retry-After付き・登録/メールなし）", async () => {
    const ip = "203.0.113.10"
    const statuses = []
    for (let i = 0; i < 5; i++) statuses.push((await post(bookings, bookingBody({ date: "2026-11-27", time: ["10:00", "13:00", "16:00", "19:00", "10:00"][i] }), { ip })).status)
    const before = { events: calendar.events.length, mails: mails.length }
    const sixth = await post(bookings, bookingBody({ date: "2026-11-28", time: "10:00" }), { ip })
    assert.equal(statuses.includes(429), false)
    assert.equal(sixth.status, 429)
    assert.ok(Number(sixth.retryAfter) > 0)
    assert.deepEqual({ events: calendar.events.length, mails: mails.length }, before)
  })

  it("問い合わせ: 同じIPから10分に6件目は429（メールなし）", async () => {
    const ip = "203.0.113.20"
    for (let i = 0; i < 5; i++) assert.equal((await post(contact, { name: "a", email: nextEmail(), message: "m" }, { ip })).status, 200)
    const before = mails.length
    assert.equal((await post(contact, { name: "a", email: nextEmail(), message: "m" }, { ip })).status, 429)
    assert.equal(mails.length, before)
  })

  it("入力エラー（400）は回数に数えない", async () => {
    const ip = "203.0.113.30"
    for (let i = 0; i < 8; i++) assert.equal((await post(contact, { name: "a", email: "bad", message: "m" }, { ip })).status, 400)
    assert.equal((await post(contact, { name: "a", email: nextEmail(), message: "m" }, { ip })).status, 200)
  })

  it("IPv6は同じ/64をまとめて数え、IPv4射影IPv6はIPv4と同じ扱い", () => {
    assert.equal(rateLimit.normalizeIpForRateLimit("2001:db8:1:2::1"), rateLimit.normalizeIpForRateLimit("2001:DB8:1:2:ffff::9"))
    assert.notEqual(rateLimit.normalizeIpForRateLimit("2001:db8:1:2::1"), rateLimit.normalizeIpForRateLimit("2001:db8:1:3::1"))
    assert.equal(rateLimit.normalizeIpForRateLimit("::ffff:192.0.2.1"), "v4:192.0.2.1")
    assert.equal(rateLimit.normalizeIpForRateLimit("999.1.1.1"), "invalid")
  })

  it("Gmailの別名（ドット・+・googlemail）だけを同じ宛先として数える", () => {
    const n = rateLimit.normalizeEmailForRateLimit
    assert.equal(n("Foo.Bar+x@googlemail.com"), "foobar@gmail.com")
    assert.notEqual(n("foo+x@example.com"), n("foo@example.com"))
    assert.notEqual(n("first.last@company.co.jp"), n("firstlast@company.co.jp"))
  })

  it("カウンターのキー数は上限内に保たれ、期限切れは掃除される", () => {
    const t0 = NOW + 7 * 86_400_000
    for (let i = 0; i < 25_000; i++) rateLimit.checkRateLimit([{ scope: "test:cap", identifier: `id-${i}`, limit: 5, windowSeconds: 600 }], t0)
    assert.ok(rateLimit.memoryCounterSize() <= rateLimit.MEMORY_MAX_KEYS + 5, `size=${rateLimit.memoryCounterSize()}`)
    rateLimit.checkRateLimit([{ scope: "test:cap", identifier: "after", limit: 5, windowSeconds: 600 }], t0 + 2 * 86_400_000)
    assert.ok(rateLimit.memoryCounterSize() < 100, `size=${rateLimit.memoryCounterSize()}`)
  })
})
