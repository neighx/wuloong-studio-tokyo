/**
 * 予約ページのURL（?plan=&date=&time=）で渡された事前選択を検証する。URLの値は信用せず、
 * 不正・範囲外・開始済みの値は「未選択」に戻す（予約済みかどうかは、空き状況の取得後に
 * BookingCalendar が確認して解除する）。クライアントとサーバーで同じ定義を使う。
 */
import { PLANS, type PlanId } from "./pricing"
import { getEndOfNextMonth, getJSTDateString, isValidDateString } from "./datetime"
import { isAllowedStartTime } from "./booking-slots"

export const DEFAULT_PLAN_ID: PlanId = "first-time-2h"

export function sanitizeBookingPreselect(
  input: { plan?: string; date?: string; time?: string },
  now: number = Date.now()
): { planId: PlanId; date: string; time: string } {
  const plan = PLANS.find((p) => p.id === input.plan) ?? PLANS.find((p) => p.id === DEFAULT_PLAN_ID)!
  const today = getJSTDateString(new Date(now))
  const date =
    isValidDateString(input.date) && input.date >= today && input.date <= getEndOfNextMonth(today) ? input.date : ""
  const time =
    date &&
    typeof input.time === "string" &&
    isAllowedStartTime(input.time, plan.durationHours) &&
    Date.parse(`${date}T${input.time}:00+09:00`) > now
      ? input.time
      : ""
  return { planId: plan.id, date, time }
}
