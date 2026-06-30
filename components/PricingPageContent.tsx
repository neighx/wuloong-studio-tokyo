"use client"

import Link from "next/link"
import PricingCards from "@/components/PricingCards"
import CTASection from "@/components/CTASection"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function PricingPageContent() {
  const { lang } = useLang()
  const T = t[lang].pricingPage

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">{T.eyebrow}</p>
          <h1 className="section-title mb-4">{T.title}</h1>
          <p className="section-subtitle">
            {T.subtitle1}<br />
            {T.subtitle2}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <PricingCards />
        </div>
      </section>

      {/* Note */}
      <section className="py-10 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-6 text-sm text-[#64748b] space-y-2">
            <p className="font-semibold text-[#1a1a2e] mb-3">{T.noteTitle}</p>
            {T.notes.map((note) => (
              <p key={note}>・ {note}</p>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/booking" className="btn-primary inline-block text-sm">
              {T.btnBook}
            </Link>
            <Link href="/contact" className="btn-secondary inline-block text-sm ml-3">
              {T.btnConsult}
            </Link>
          </div>
        </div>
      </section>

      <CTASection title={T.ctaTitle} subtitle={T.ctaSubtitle} />
    </>
  )
}
