"use client"

import Link from "next/link"
import CTASection from "@/components/CTASection"
import FAQ from "@/components/FAQ"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function FirstTimePageContent() {
  const { lang } = useLang()
  const T = t[lang].firstTimePage

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">{T.eyebrow}</p>
          <h1 className="section-title mb-4">
            {T.title}<br />
            <span className="gradient-text">{T.titleHighlight}</span>
          </h1>
          <p className="section-subtitle max-w-xl mx-auto">
            {T.subtitle}
          </p>
        </div>
      </section>

      {/* Safety points */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {T.safetyPoints.map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-12">{T.flowTitle}</h2>
          <div className="space-y-4">
            {T.steps.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    {step.num}
                  </div>
                  {i < T.steps.length - 1 && (
                    <div className="w-0.5 flex-1 mt-2 bg-gradient-to-b from-[#6b9fd4]/30 to-transparent" />
                  )}
                </div>
                <div className="pb-6 pt-1">
                  <h3 className="font-bold text-[#1a1a2e] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title text-center mb-8">{T.checklistTitle}</h2>
          <div className="space-y-3">
            {T.items.map((item) => (
              <div key={item.text} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#6b9fd4]/10 text-[#6b9fd4] mr-2">
                    {item.label}
                  </span>
                  <span className="text-sm text-[#4a5568]">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anxieties FAQ */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-3xl mx-auto">
          <FAQ items={T.anxieties as unknown as { q: string; a: string }[]} title={T.anxietiesTitle} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="section-title mb-4">{T.ctaTitle}</h2>
          <p className="section-subtitle mb-8">
            {T.ctaSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/booking?plan=first-time-2h" className="btn-primary text-sm">
              {T.btnBook}
            </Link>
            <Link href="/contact" className="btn-secondary text-sm">
              {T.btnConsult}
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
