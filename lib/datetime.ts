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
