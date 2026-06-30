import { NextRequest, NextResponse } from "next/server"
import { createBookingEvent, type BookingEvent } from "@/lib/google-calendar"
import { sendCustomerConfirmation, sendAdminNotification } from "@/lib/email"

export interface BookingRequest {
  planId: string
  planName: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerInstagram?: string
  message?: string
  isFirstTime: boolean
}

/**
 * POST /api/bookings
 * Creates a booking, adds to Google Calendar, sends confirmation emails
 *
 * Future: add Stripe/Square payment intent creation before confirming
 */
export async function POST(req: NextRequest) {
  let body: BookingRequest

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const required = ["planId", "planName", "date", "time", "customerName", "customerEmail", "customerPhone"]
  const missing = required.filter((key) => !body[key as keyof BookingRequest])

  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 })
  }

  try {
    const startDateTime = `${body.date}T${body.time}:00+09:00`
    const durationHours = body.planId.includes("2h") ? 2 : 3
    const endHour = parseInt(body.time.split(":")[0]) + durationHours
    const endDateTime = `${body.date}T${String(endHour).padStart(2, "0")}:${body.time.split(":")[1]}:00+09:00`

    const bookingEvent: BookingEvent = {
      planId: body.planId,
      planName: body.planName,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerInstagram: body.customerInstagram,
      message: body.message,
      isFirstTime: body.isFirstTime,
      startTime: startDateTime,
      endTime: endDateTime,
    }

    const eventId = await createBookingEvent(bookingEvent)

    // Send emails in parallel
    await Promise.allSettled([
      sendCustomerConfirmation({
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        planName: body.planName,
        date: body.date,
        time: body.time,
        isFirstTime: body.isFirstTime,
      }),
      sendAdminNotification({
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        planName: body.planName,
        date: body.date,
        time: body.time,
        isFirstTime: body.isFirstTime,
        instagram: body.customerInstagram,
        message: body.message,
      }),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === "rejected") console.error("[bookings] Email send failed:", r.reason)
      })
    })

    return NextResponse.json({
      success: true,
      eventId,
      message: "ご予約ありがとうございます。内容を確認後、メールまたはInstagram DMでご連絡いたします。",
    })
  } catch (error) {
    console.error("[bookings] Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
