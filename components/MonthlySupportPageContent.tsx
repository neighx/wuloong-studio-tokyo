"use client"

import Link from "next/link"
import CTASection from "@/components/CTASection"
import { INSTAGRAM_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function MonthlySupportPageContent() {
  const { lang } = useLang()
  const T = t[lang].monthlySupportPage

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#e8afc4] text-sm font-semibold mb-3 tracking-wide">{T.eyebrow}</p>
          <h1 className="section-title mb-4">{T.title}</h1>
          <p className="text-[#e8afc4] text-3xl font-black mb-4">{T.price}</p>
          <p className="section-subtitle max-w-xl mx-auto">
            {T.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              {T.btnInstagram}
            </a>
            <Link href="/contact" className="btn-secondary">
              {T.btnContact}
            </Link>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-12">{T.includedTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {T.included.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl p-6 bg-gradient-to-br from-[#fde8f4] to-[#fdf5e8] border border-[#e8afc4]/30"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#fdf5e8] to-[#fde8f4]">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-10">{T.forWhoTitle}</h2>
          <div className="space-y-3">
            {T.forWho.map((item) => (
              <div key={item} className="glass-card rounded-2xl p-5 flex items-start gap-3">
                <span className="text-[#e8afc4] font-bold flex-shrink-0">✓</span>
                <p className="text-sm text-[#4a5568] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message */}
      <section className="py-16 px-4 sm:px-6 bg-[#1a1a2e] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#e8afc4] text-sm font-semibold mb-6 tracking-wide">{T.messageLabel}</p>
          <blockquote className="text-xl sm:text-2xl font-bold leading-relaxed mb-8" style={{ whiteSpace: "pre-line" }}>
            {T.quote}
          </blockquote>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl mx-auto">
            {T.messageBody}
          </p>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 text-sm text-[#64748b] space-y-2">
          <p className="font-semibold text-[#1a1a2e] mb-3">{T.pricingNoteTitle}</p>
          {T.pricingNotes.map((note) => (
            <p key={note}>・ {note}</p>
          ))}
          <div className="pt-4 flex flex-wrap gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-sm">
              {T.btnInstagram}
            </a>
            <Link href="/contact" className="btn-secondary inline-block text-sm">
              {T.btnContact}
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title={T.ctaTitle}
        subtitle={T.ctaSubtitle}
      />
    </>
  )
}
