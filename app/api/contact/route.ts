import { NextRequest, NextResponse } from "next/server"
import { sendContactNotification } from "@/lib/email"

export interface ContactRequest {
  name: string
  email: string
  subject?: string
  message: string
}

export async function POST(req: NextRequest) {
  let body: ContactRequest

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    await sendContactNotification({
      name: body.name,
      email: body.email,
      subject: body.subject ?? "",
      message: body.message,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[contact] Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
