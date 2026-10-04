import { createHash } from "node:crypto"

/**
 * 受付番号（受付レシート番号）の生成。
 *
 * idempotencyKey（クライアントが送信操作ごとに発行するキー）と、
 * 申込内容（プラン・日時・連絡先等）のフィンガープリントから、
 * 純粋関数として受付番号を決定論的に計算する。
 *
 * この関数自体はメモリや外部ストレージに一切依存しない。
 * そのため、別プロセス・別サーバーインスタンス・再起動後のプロセスでも、
 * 「同じidempotencyKey + 同じ申込内容」であれば必ず同じ受付番号になる。
 * 一方、「同じidempotencyKeyでも申込内容（プラン・日時・連絡先等）が
 * 変わった場合」は、フィンガープリントが変わるため別の受付番号になり、
 * 別の申込として扱われる。
 *
 * 注意：この関数は「同じ受付番号が決定論的に求まる」ことだけを保証する。
 * 「その受付番号の申込が既にカレンダーに存在するか」の確認は別途
 * lib/google-calendar.ts の findBookingByReceipt で行う（カレンダー自体を
 * 正とするため、メモリ内キャッシュだけに依存しない）。
 */
export interface BookingFingerprint {
  planId: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerInstagram?: string
  message?: string
  isFirstTime: boolean
}

function stableFingerprint(f: BookingFingerprint): string {
  return [
    `plan=${f.planId}`,
    `date=${f.date}`,
    `time=${f.time}`,
    `name=${f.customerName}`,
    `email=${f.customerEmail}`,
    `phone=${f.customerPhone}`,
    `ig=${f.customerInstagram ?? ""}`,
    `msg=${f.message ?? ""}`,
    `first=${f.isFirstTime}`,
  ].join("&")
}

export function computeReceiptNumber(idempotencyKey: string, fingerprint: BookingFingerprint): string {
  const input = `${idempotencyKey}::${stableFingerprint(fingerprint)}`
  const hash = createHash("sha256").update(input).digest("hex")
  return `WLG-${hash.slice(0, 10).toUpperCase()}`
}
