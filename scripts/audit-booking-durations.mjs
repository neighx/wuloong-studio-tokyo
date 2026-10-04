/**
 * 既存予約の所要時間を点検する読み取り専用スクリプト。
 *
 * 目的: 以前のバグ（planIdに"2h"という文字列が含まれるかどうかで判定していたため、
 * 実際は3時間プランの"first-time-2h"が2時間として登録されていた）の影響を受けた
 * 「今後の予約」が残っていないかを確認する。
 *
 * - 読み取り専用。カレンダーへの書き込み・変更・削除は一切行わない。
 * - 対象は「今日(JST)」から先の予約のみ（過去分は対象外）。
 * - イベントのタイトルが "[予約] <プラン名> — <お客様名>" の形式であることを前提に、
 *   現在のPLANS定義にある プラン名 と一致するものだけを判定対象にする。
 *   一致しないもの（過去に存在した別プランなど）は "unknown" として未確定扱いにする。
 *
 * Usage:
 *   node --env-file=.env.local --experimental-strip-types scripts/audit-booking-durations.mjs
 */

import { google } from "googleapis"
import { PLANS } from "../lib/pricing.ts"

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !CALENDAR_ID) {
  console.error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN / GOOGLE_CALENDAR_ID が必要です")
  process.exit(1)
}

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET)
auth.setCredentials({ refresh_token: REFRESH_TOKEN })
const calendar = google.calendar({ version: "v3", auth })

const now = new Date()
const horizon = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000) // 180日先まで

console.log(`[audit] 読み取り専用で予約を点検します（書き込みは行いません）`)
console.log(`[audit] 期間: ${now.toISOString()} 〜 ${horizon.toISOString()}`)

const res = await calendar.events.list({
  calendarId: CALENDAR_ID,
  timeMin: now.toISOString(),
  timeMax: horizon.toISOString(),
  singleEvents: true,
  orderBy: "startTime",
  maxResults: 2500,
})

const events = res.data.items ?? []
console.log(`[audit] 取得したイベント数: ${events.length}`)

const rows = []
for (const e of events) {
  const summary = e.summary ?? ""
  if (!summary.startsWith("[予約]") && !summary.startsWith("[TEST予約]")) continue // この予約システム以外のイベントは対象外

  const start = e.start?.dateTime
  const end = e.end?.dateTime
  if (!start || !end) continue // 終日イベントなどは対象外

  const actualHours = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60)

  const m = summary.match(/^\[(?:TEST)?予約\]\s*(.+?)\s*—\s*(.+)$/)
  const planNameInTitle = m?.[1] ?? null
  const customerName = m?.[2] ?? "(不明)"

  const matchedPlan = PLANS.find((p) => p.name === planNameInTitle)

  let status
  if (!matchedPlan) {
    status = "unknown" // 現在のプラン名と一致しない＝未確定（旧プラン等の可能性。自動では判定しない）
  } else if (actualHours !== matchedPlan.durationHours) {
    status = "mismatch" // プラン名が示す所要時間と、実際の登録時間が異なる＝要確認
  } else {
    status = "ok"
  }

  rows.push({
    status,
    start,
    end,
    actualHours,
    expectedHours: matchedPlan?.durationHours ?? null,
    planNameInTitle,
    customerName,
    isTest: summary.startsWith("[TEST予約]"),
  })
}

const mismatches = rows.filter((r) => r.status === "mismatch")
const unknowns = rows.filter((r) => r.status === "unknown")
const ok = rows.filter((r) => r.status === "ok")

console.log(`\n[audit] 集計: 合計${rows.length}件 / 一致${ok.length}件 / 要確認(mismatch)${mismatches.length}件 / 未確定(unknown)${unknowns.length}件`)

console.log("\n=== 要確認: プラン名が示す所要時間と実際の登録時間が異なる予約 ===")
if (mismatches.length === 0) {
  console.log("(該当なし)")
} else {
  for (const r of mismatches) {
    console.log(
      `- ${r.start} 〜 ${r.end} | 実際${r.actualHours}h / プラン上は${r.expectedHours}h | ${r.planNameInTitle} | ${r.customerName}${r.isTest ? " [TEST]" : ""}`
    )
  }
}

console.log("\n=== 未確定: 現在のプラン名と一致しないイベント（自動では判定しません） ===")
if (unknowns.length === 0) {
  console.log("(該当なし)")
} else {
  for (const r of unknowns) {
    console.log(`- ${r.start} 〜 ${r.end} | タイトル内プラン名: "${r.planNameInTitle}" | ${r.customerName}`)
  }
}

console.log("\n[audit] 完了。このスクリプトは読み取りのみで、予定の変更・削除は行っていません。")
