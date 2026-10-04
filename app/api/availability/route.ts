import { NextRequest, NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/google-calendar"
import { getPlanById, type PlanId } from "@/lib/pricing"

/**
 * GET /api/availability?date=2026-10-05&planId=first-time-2h
 * Returns available time slots for a given date.
 * planId を省略した場合は初回体験プラン（3時間）を基準に判定する。
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")
  const planId = searchParams.get("planId") ?? "first-time-2h"

  if (!date) {
    return NextResponse.json({ error: "date is required (YYYY-MM-DD)" }, { status: 400 })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 })
  }

  const plan = getPlanById(planId as PlanId)
  if (!plan) {
    return NextResponse.json({ error: `Unknown planId: ${planId}` }, { status: 400 })
  }

  try {
    const slots = await getAvailableSlots(date, plan.durationHours)
    return NextResponse.json({ date, planId: plan.id, durationHours: plan.durationHours, slots })
  } catch (error) {
    // live/testモードで認証情報が不足している場合もここに来る。
    // 「空き枠ゼロ」として隠さず、明示的な失敗として返す。
    console.error("[availability] Error fetching slots:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}
