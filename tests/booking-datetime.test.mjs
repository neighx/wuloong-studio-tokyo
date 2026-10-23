// 予約カレンダーの日付変更と、送信される日時の一致を検証する回帰テスト。
// 実際の BookingForm / BookingCalendar / HomePageContent / BookingPageContent を jsdom 上に描画し、
// クリック等の操作で状態遷移を確認する。API はすべて tests/support/dom-env.mjs のモック。
//
// 実行: npm run test:booking
import { describe, it, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import { api, alerts } from "./support/dom-env.mjs"

const { createElement, act } = await import("react")
const { createRoot } = await import("react-dom/client")
const { default: BookingForm } = await import("../components/BookingForm.tsx")
const { default: HomePageContent } = await import("../components/HomePageContent.tsx")
const { default: BookingPageContent } = await import("../components/BookingPageContent.tsx")

// 「今日」は 2026-10-23（dom-env.mjs で固定）。表示中の10月のうち 23〜31日が選択可能。
const A = 27 // 2026-10-27
const B = 28 // 2026-10-28
const ymd = (day) => `2026-10-${String(day).padStart(2, "0")}`
const SELECTED_LABEL = "✓ 選択中"

let container, root

async function render(element) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => root.render(element))
}

async function flush() {
  for (let i = 0; i < 3; i++) await act(async () => { await new Promise((r) => setTimeout(r, 0)) })
}

async function click(el) {
  assert.ok(el, "クリック対象が見つからない")
  await act(async () => el.click())
  await flush()
}

const buttons = () => [...container.querySelectorAll("button")]
const dayButton = (day) => buttons().find((b) => b.className.includes("aspect-square") && b.textContent.trim() === String(day))
const timeButton = (hhmm) => buttons().find((b) => b.textContent.trim().startsWith(hhmm) && b.className.includes("min-h-[60px]"))
const submitButton = () => container.querySelector('button[type="submit"]')
const form = () => container.querySelector("form")
const hasSelectedTime = () => container.textContent.includes(SELECTED_LABEL)

async function fillCustomer() {
  const setValue = (el, value) => {
    const proto = el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value)
    el.dispatchEvent(new window.Event("input", { bubbles: true }))
  }
  await act(async () => {
    setValue(container.querySelector('input[name="name"]'), "テスト 太郎")
    setValue(container.querySelector('input[name="email"]'), "test@example.com")
    setValue(container.querySelector('input[name="phone"]'), "090-0000-0000")
  })
}

/** 送信ボタンを押す操作と、ボタンを経由しない submit（Enterキー等の想定）の両方で、APIが呼ばれないことを確認する */
async function assertCannotSubmit() {
  const before = api.bookingCalls().length
  assert.equal(submitButton().disabled, true, "送信ボタンが無効になっていない")
  await click(submitButton())
  await act(async () => form().requestSubmit())
  await flush()
  assert.equal(api.bookingCalls().length, before, "日時未選択なのに予約APIが呼ばれた")
}

async function pickDateTime(day, hhmm) {
  await click(dayButton(day))
  await click(timeButton(hhmm))
}

beforeEach(() => {
  api.reset()
  globalThis.__TEST_SEARCH__ = ""
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
})

describe("予約フォーム（BookingForm + BookingCalendar）", () => {
  it("1〜2. A日10:00選択→B日クリックで時刻が解除され送信不可。B日の時刻を選ぶとB日の日時で送信される", async () => {
    await render(createElement(BookingForm, { defaultPlan: "first-time-2h" }))
    await fillCustomer()
    await pickDateTime(A, "10:00")
    assert.equal(api.bookingCalls().length, 0, "日付・時刻のクリックだけで予約APIが呼ばれた")
    assert.equal(hasSelectedTime(), true)
    assert.equal(submitButton().disabled, false)

    // 1. 別の日付をクリック（カレンダーのボタン操作だけでフォームが送信されないこと）
    await click(dayButton(B))
    assert.deepEqual(api.bookingCalls().map((c) => `${c.body.date} ${c.body.time}`), [], "日付クリックだけで予約APIが呼ばれた")
    assert.equal(hasSelectedTime(), false, "カレンダー上の時刻選択が解除されていない")
    assert.ok(api.availabilityCalls(ymd(B)).length >= 1, "B日の空き状況を取得していない")
    await assertCannotSubmit()
    assert.ok(alerts.length >= 1, "送信処理側の日時未選択ガード（alert）が働いていない")

    // 2. B日の時刻を選び直して送信
    await click(timeButton("13:00"))
    assert.equal(submitButton().disabled, false, "時刻を選び直しても送信可能に戻らない")
    await click(submitButton())
    const calls = api.bookingCalls()
    assert.equal(calls.length, 1)
    assert.equal(calls[0].body.date, ymd(B))
    assert.equal(calls[0].body.time, "13:00")
  })

  it("フォーム内のカレンダー操作ボタン（月送り・日付・時刻）は送信ボタンとして扱われない", async () => {
    await render(createElement(BookingForm, { defaultPlan: "first-time-2h" }))
    await click(dayButton(A))
    // DOM要素同士を比較すると失敗時の差分表示が極端に重くなるため、文言で比較する
    const submitters = [...form().querySelectorAll("button")].filter((b) => b.type === "submit").map((b) => b.textContent.trim())
    assert.deepEqual(submitters, [submitButton().textContent.trim()], "送信ボタン以外に type=submit のボタンがある")
  })

  it("3. 同じ日付の再クリックで時刻が解除されたら、親の時刻も解除される", async () => {
    await render(createElement(BookingForm, { defaultPlan: "first-time-2h" }))
    await fillCustomer()
    await pickDateTime(A, "10:00")
    await click(dayButton(A))
    assert.equal(hasSelectedTime(), false)
    await assertCannotSubmit()
  })

  it("4. 日付・時刻の初回選択で従来どおり申し込める", async () => {
    await render(createElement(BookingForm, { defaultPlan: "standard-3h" }))
    await fillCustomer()
    assert.equal(submitButton().disabled, true, "日時未選択の初期状態で送信できてしまう")
    await pickDateTime(29, "16:00")
    await click(submitButton())
    const calls = api.bookingCalls()
    assert.equal(calls.length, 1)
    assert.deepEqual([calls[0].body.planId, calls[0].body.date, calls[0].body.time], ["standard-3h", ymd(29), "16:00"])
    assert.ok(container.textContent.includes("WLG-TEST000001"), "受付完了画面に受付番号が表示されない")
  })

  it("5. プラン変更で日時が解除される（既存動作の維持）", async () => {
    await render(createElement(BookingForm, { defaultPlan: "first-time-2h" }))
    await fillCustomer()
    await pickDateTime(A, "10:00")
    const standard = container.querySelector('input[name="planId"][value="standard-3h"]')
    await act(async () => standard.click())
    await flush()
    assert.equal(hasSelectedTime(), false)
    assert.equal(timeButton("10:00"), undefined, "プラン変更後も時刻一覧が残っている")
    await assertCannotSubmit()
  })

  it("6. 409競合で時刻が解除され、空き状況を再取得する（既存動作の維持）", async () => {
    await render(createElement(BookingForm, { defaultPlan: "first-time-2h" }))
    await fillCustomer()
    await pickDateTime(A, "10:00")
    const fetchedBefore = api.availabilityCalls(ymd(A)).length
    api.bookingMode = "conflict"
    await click(submitButton())
    assert.equal(api.bookingCalls().length, 1)
    assert.ok(api.availabilityCalls(ymd(A)).length > fetchedBefore, "409後に空き状況を再取得していない")
    assert.equal(hasSelectedTime(), false)
    assert.ok(timeButton("10:00"), "409後に同じ日付の時刻一覧が表示されていない")
    assert.ok(container.textContent.includes("その時間帯は他のお申し込みが入っています"))
    await assertCannotSubmit()
  })
})

describe("TOPページのカレンダー（HomePageContent）", () => {
  it("7. 日付変更後に古い日時付きの予約リンクが残らない", async () => {
    await render(createElement(HomePageContent))
    const dateLinks = () => [...container.querySelectorAll('a[href^="/booking?date="]')].map((a) => a.getAttribute("href"))
    assert.deepEqual(dateLinks(), [])
    await pickDateTime(A, "10:00")
    assert.deepEqual(dateLinks(), [`/booking?date=${ymd(A)}&time=10%3A00`])

    await click(dayButton(B))
    assert.deepEqual(dateLinks(), [], "日付変更後もA日の予約リンクが残っている")
    assert.ok(container.querySelector('a[href="/booking"]'), "日時未選択時の通常の予約リンクが表示されない")

    await click(timeButton("13:00"))
    assert.deepEqual(dateLinks(), [`/booking?date=${ymd(B)}&time=13%3A00`])
  })
})

describe("URLによる日時の事前選択（BookingPageContent）", () => {
  it("8a. 有効な事前選択はそのまま申し込める", async () => {
    globalThis.__TEST_SEARCH__ = `plan=standard-3h&date=${ymd(30)}&time=13:00`
    await render(createElement(BookingPageContent))
    await flush()
    await fillCustomer()
    assert.equal(hasSelectedTime(), true, "事前選択した時刻がカレンダー上で選択表示されない")
    assert.equal(submitButton().disabled, false)
    await click(submitButton())
    const calls = api.bookingCalls()
    assert.equal(calls.length, 1)
    assert.deepEqual([calls[0].body.planId, calls[0].body.date, calls[0].body.time], ["standard-3h", ymd(30), "13:00"])
  })

  it("8b. 事前選択の後に日付を変更すると、古い時刻が解除される", async () => {
    globalThis.__TEST_SEARCH__ = `plan=standard-3h&date=${ymd(30)}&time=13:00`
    await render(createElement(BookingPageContent))
    await flush()
    await fillCustomer()
    await click(dayButton(31))
    assert.equal(hasSelectedTime(), false)
    await assertCannotSubmit()
    await click(timeButton("19:00"))
    await click(submitButton())
    const calls = api.bookingCalls()
    assert.equal(calls.length, 1)
    assert.deepEqual([calls[0].body.date, calls[0].body.time], [ymd(31), "19:00"])
  })
})
