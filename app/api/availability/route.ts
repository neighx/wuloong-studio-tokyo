import { NextRequest, NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/google-calendar"

/**
 * GET /api/availability?date=2024-08-01
 * Returns available time slots for a given date
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "date is required (YYYY-MM-DD)" }, { status: 400 })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 })
  }

  try {
    const slots = await getAvailableSlots(date)
    return NextResponse.json({ date, slots })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("[availability] Error fetching slots:", error)
    return NextResponse.json({ error: "Failed to fetch availability", detail: msg }, { status: 500 })
  }
}
