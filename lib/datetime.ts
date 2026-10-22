/**
 * スタジオの営業時間はすべて日本時間（Asia/Tokyo）。
 * サーバー（Vercelは既定でUTC）と閲覧端末のタイムゾーンが異なると、
 * 素の `new Date()` の年月日はJSTの壁時計時刻と一致しないことがある
 * （例：UTC環境でJST深夜0時台=UTC前日15時台の場合、日付が1日ずれる）。
 * そのため「今日」「今月」を扱う箇所では、常にこのヘルパーでJSTへ
 * 明示的に変換した値を使う。
 */

const JST_TZ = "Asia/Tokyo"

/**
 * 任意の時点（省略時は現在時刻）を、Asia/Tokyoの壁時計時刻を表す
 * ローカルDateオブジェクトに変換する。
 * .getFullYear() / .getMonth() / .getDate() などがJSTの年月日を返すようになる。
 */
export function toJSTWallClock(instant: Date = new Date()): Date {
  const jstString = instant.toLocaleString("en-US", { timeZone: JST_TZ })
  return new Date(jstString)
}

/** JSTの "YYYY-MM-DD" 文字列を返す */
export function getJSTDateString(instant: Date = new Date()): string {
  const d = toJSTWallClock(instant)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/**
 * "YYYY-MM-DD" 文字列に日数を加算し、"YYYY-MM-DD" 文字列で返す純粋関数。
 * タイムゾーンに依存しないようUTC正午を基準に計算する（DST等の影響を受けない）。
 */
export function addDaysToDateString(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  const base = new Date(Date.UTC(y, m - 1, d, 12))
  base.setUTCDate(base.getUTCDate() + days)
  const yy = base.getUTCFullYear()
  const mm = String(base.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(base.getUTCDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

/**
 * "YYYY-MM-DD" 文字列（JSTの「今日」）を受け取り、その「翌月の末日」を
 * "YYYY-MM-DD" 文字列で返す純粋関数。年またぎも自動で処理される
 * （例：2026-12-15 → 2027-01-31）。タイムゾーンに依存しないようUTCで計算する。
 */
export function getEndOfNextMonth(dateStr: string): string {
  const [y, m] = dateStr.split("-").map(Number)
  // 「翌々月の0日目」＝「翌月の末日」。month は0-indexedなので、
  // 1-indexedの今月 m がそのまま「翌月の0-indexed値」になる。
  const base = new Date(Date.UTC(y, m + 1, 0, 12))
  const yy = base.getUTCFullYear()
  const mm = String(base.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(base.getUTCDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}
