/**
 * 最小限の計測ラッパー。
 *
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID が設定されていない場合は、
 *   gtag.jsを読み込まず、track()を呼んでも外部へは何も送信しない
 *   （計測IDが無い状態での意図しない外部送信を防ぐ）。
 * - 氏名・メール・電話番号・Instagram ID・相談内容などの個人情報は
 *   一切パラメータに含めないこと（plan_id・page・langなどのみ）。
 * - 「送信（API受理）」と「スタジオによる予約確定」は別イベントとして扱う。
 *   booking_submit_success は「APIが予約リクエストを受理した」ことを示すのみで、
 *   スタジオが予約を確定した（人による返信）ことを意味しない。
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export type AnalyticsEvent =
  | "plan_select"
  | "booking_start"
  | "availability_error"
  | "booking_submit_success"
  | "booking_submit_error"
  | "consult_click"
  | "plan_guide_complete"

type EventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return
  if (!GA_MEASUREMENT_ID) return // 計測ID未設定時は何もしない（外部送信なし）
  if (typeof window.gtag !== "function") return // gtag.js未読み込み時も何もしない

  window.gtag("event", event, params)
}
