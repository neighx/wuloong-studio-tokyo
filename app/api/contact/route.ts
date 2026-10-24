import { NextRequest, NextResponse } from "next/server"
import { sendContactNotification } from "@/lib/email"
import { validateContactInput } from "@/lib/validation"
import { checkRateLimit, contactRateLimitRules, getClientIp } from "@/lib/rate-limit"

export interface ContactRequest {
  name: string
  email: string
  subject?: string
  message: string
}

export async function POST(req: NextRequest) {
  let rawBody: unknown

  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // 型・必須・文字数・メール形式・制御文字（改行等）を検証する（lib/validation.ts）。
  const validation = validateContactInput(rawBody)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }
  const body: ContactRequest = validation.value

  // メール送信より前に、送信元IPの受付回数を制限する（lib/rate-limit.ts）。
  const rateLimit = await checkRateLimit(contactRateLimitRules(getClientIp(req.headers)))
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    )
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
