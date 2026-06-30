"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import BookingForm from "@/components/BookingForm"
import { INSTAGRAM_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

function BookingContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") ?? undefined

  return (
    <BookingForm defaultPlan={plan} />
  )
}

export default function BookingPage() {
  const { lang } = useLang()
  const T = t[lang].bookingPage

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">{T.eyebrow}</p>
          <h1 className="section-title mb-4">{T.title}</h1>
          <p className="section-subtitle">
            {T.subtitle}
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-10 px-4 sm:px-6 pb-20 bg-white">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div className="glass-card rounded-3xl p-8 text-center text-[#94a3b8]">{T.loading}</div>}>
            <BookingContent />
          </Suspense>
        </div>
      </section>

      {/* Alternative contact */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-[#64748b] mb-4">{T.altText}</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-block text-sm"
          >
            {T.btnInstagram}
          </a>
        </div>
      </section>
    </>
  )
}
