// コンポーネントテスト用の実行環境。react-dom を読み込む前に import すること。
// - jsdom でブラウザの window/document を用意する
// - 「今日」を 2026-10-23 12:00 JST に固定する（受付期間は 2026-11-30 まで）
// - fetch を差し替え、/api/availability と /api/bookings だけに応答する。
//   それ以外への通信は例外にする（本番APIや外部サービスへは一切送らない）
import { JSDOM } from "jsdom"

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/" })
const { window } = dom
for (const key of ["window", "document", "navigator", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement", "HTMLFormElement", "Node", "Event", "MouseEvent", "KeyboardEvent", "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame"]) {
  if (window[key] !== undefined) {
    Object.defineProperty(globalThis, key, { value: typeof window[key] === "function" && /^[a-z]/.test(key) ? window[key].bind(window) : window[key], configurable: true, writable: true })
  }
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// 日付固定
export const FIXED_NOW = Date.parse("2026-10-23T03:00:00Z")
const RealDate = Date
class FixedDate extends RealDate {
  constructor(...args) {
    if (args.length === 0) super(FIXED_NOW)
    else super(...args)
  }
  static now() {
    return FIXED_NOW
  }
}
globalThis.Date = FixedDate

// alert は呼ばれた内容だけを記録する
export const alerts = []
globalThis.alert = window.alert = (msg) => alerts.push(String(msg))

// API のモック
export const api = {
  calls: [],
  /** "ok" | "conflict" */
  bookingMode: "ok",
  reset() {
    this.calls.length = 0
    this.bookingMode = "ok"
    alerts.length = 0
  },
  availabilityCalls(date) {
    return this.calls.filter((c) => c.url.startsWith("/api/availability") && (!date || c.url.includes(`date=${date}`)))
  },
  bookingCalls() {
    return this.calls.filter((c) => c.url === "/api/bookings")
  },
}
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })
globalThis.fetch = async (input, init = {}) => {
  const url = String(input)
  api.calls.push({ url, method: init.method ?? "GET", body: init.body ? JSON.parse(init.body) : undefined })
  if (url.startsWith("/api/availability")) {
    const date = new URL(url, "http://localhost").searchParams.get("date")
    const slots = ["10", "13", "16", "19"].map((h) => ({
      start: `${date}T${h}:00:00+09:00`,
      end: `${date}T${String(Number(h) + 3).padStart(2, "0")}:00:00+09:00`,
      available: true,
    }))
    return json(200, { date, slots })
  }
  if (url === "/api/bookings") {
    if (api.bookingMode === "conflict") return json(409, { error: "conflict" })
    return json(200, { success: true, status: "pending_confirmation", receiptNumber: "WLG-TEST000001", eventId: "mock-event", message: "" })
  }
  throw new Error(`Unexpected fetch in test: ${url}`)
}
