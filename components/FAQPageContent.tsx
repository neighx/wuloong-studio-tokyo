"use client"

import Link from "next/link"
import FAQ from "@/components/FAQ"
import CTASection from "@/components/CTASection"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function FAQPageContent() {
  const { lang } = useLang()
  const T = t[lang].faqPage

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">{T.eyebrow}</p>
          <h1 className="section-title mb-4">{T.title}</h1>
          <p className="section-subtitle">
            {T.subtitle}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <FAQ items={T.items as unknown as { q: string; a: string }[]} title="" />
          <div className="mt-12 glass-card rounded-3xl p-6 text-center">
            <p className="text-[#4a5568] mb-4">{T.notFoundText}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary text-sm">
                {T.btnContact}
              </Link>
              <Link href="/booking" className="btn-secondary text-sm">
                {T.btnBookFirst}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
