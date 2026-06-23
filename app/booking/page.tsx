"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import BookingForm from "@/components/BookingForm"
import { INSTAGRAM_URL } from "@/lib/constants"

function BookingContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") ?? undefined

  return (
    <BookingForm defaultPlan={plan} />
  )
}

export default function BookingPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">BOOKING</p>
          <h1 className="section-title mb-4">予約する</h1>
          <p className="section-subtitle">
            ご希望のプランと日時を選んでお申し込みください。
            確認後、メールまたはInstagram DMでご連絡します。
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-10 px-4 sm:px-6 pb-20 bg-white">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div className="glass-card rounded-3xl p-8 text-center text-[#94a3b8]">読み込み中...</div>}>
            <BookingContent />
          </Suspense>
        </div>
      </section>

      {/* Alternative contact */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-[#64748b] mb-4">フォームが使いにくい場合はこちらからもご相談いただけます</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-block text-sm"
          >
            Instagramで相談する
          </a>
        </div>
      </section>
    </>
  )
}
