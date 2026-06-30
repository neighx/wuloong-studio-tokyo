"use client"

import Link from "next/link"
import CTASection from "@/components/CTASection"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function SongPackagePageContent() {
  const { lang } = useLang()
  const T = t[lang].songPackagePage

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#9b8ec4] text-sm font-semibold mb-3 tracking-wide">{T.eyebrow}</p>
          <h1 className="section-title mb-4">
            {T.title}
          </h1>
          <p className="text-[#9b8ec4] text-3xl font-black mb-4">{T.price}</p>
          <p className="section-subtitle max-w-xl mx-auto">
            {T.subtitle1}<br />
            {T.subtitle2}
          </p>
          <div className="mt-8">
            <Link href="/booking?plan=song-package" className="btn-primary">
              {T.btnApply}
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
                className="rounded-3xl p-6 bg-gradient-to-br from-[#f8f0ff] to-[#fdf0f8] border border-[#9b8ec4]/20"
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
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-10">{T.forWhoTitle}</h2>
          <div className="space-y-3">
            {T.forWho.map((item) => (
              <div key={item} className="glass-card rounded-2xl p-5 flex items-start gap-3">
                <span className="text-[#9b8ec4] font-bold flex-shrink-0">✓</span>
                <p className="text-sm text-[#4a5568] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-10">{T.flowTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {T.flowSteps.map((step) => (
              <div key={step.num} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #9b8ec4, #6b9fd4)" }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{step.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-10 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 text-sm text-[#64748b] space-y-2">
          <p className="font-semibold text-[#1a1a2e] mb-3">{T.pricingNoteTitle}</p>
          {T.pricingNotes.map((note) => (
            <p key={note}>・ {note}</p>
          ))}
          <div className="pt-4">
            <Link href="/booking?plan=song-package" className="btn-primary inline-block text-sm">
              {T.btnApply2}
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
