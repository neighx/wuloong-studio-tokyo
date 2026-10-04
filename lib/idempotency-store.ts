/**
 * 「同じ申込の再送」をなるべく早く・安く判定するための、同一プロセス内の
 * 高速パスキャッシュ（ファストパス）。
 *
 * 【保存先・有効範囲】
 * lib/slot-lock.ts と同じく、Node.jsプロセスのメモリ（ヒープ）上のMapのみ。
 * 外部サービス・DBは使わない。したがって、別のサーバーインスタンス（別プロセス）や
 * コールドスタート後の新しいプロセスからは、このキャッシュは見えない。
 *
 * 【これは「正」ではない】
 * 受付番号（lib/receipt.ts）自体は、このキャッシュに依存しない決定論的な
 * 純粋関数で計算される。また「その受付番号の申込が既にカレンダーに
 * 存在するか」は lib/google-calendar.ts の findBookingByReceipt が
 * 実際のカレンダー（live/testモード）を見て判定する（＝正はカレンダー）。
 * このモジュールは、同一プロセス内での再送について、その都度カレンダーへ
 * 問い合わせる手間を省くための高速パスに過ぎない。キャッシュがミスしても、
 * 呼び出し元（app/api/bookings/route.ts）はfindBookingByReceiptへフォール
 * バックするため、正しさ自体はこのキャッシュの有無に依存しない。
 *
 * キーは受付番号（申込内容＋idempotencyKeyから決まる）。失敗（空き無し等）は
 * 保存しない。
 */

interface CachedResult {
  eventId: string
  createdAt: number
}

const MAX_ENTRIES = 500
const results = new Map<string, CachedResult>()

export function getCachedBookingResult(receiptNumber: string): CachedResult | undefined {
  return results.get(receiptNumber)
}

export function cacheBookingResult(receiptNumber: string, eventId: string): void {
  if (results.size >= MAX_ENTRIES) {
    // 一番古いエントリ（Mapは挿入順を保持する）を1件捨てて、無制限に増え続けないようにする
    const oldestKey = results.keys().next().value
    if (oldestKey !== undefined) results.delete(oldestKey)
  }
  results.set(receiptNumber, { eventId, createdAt: Date.now() })
}
