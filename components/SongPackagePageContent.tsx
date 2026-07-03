"use client"

import Image from "next/image"
import Link from "next/link"
import CTASection from "@/components/CTASection"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"
import { INSTAGRAM_URL } from "@/lib/constants"

type IncludedItem = { num: string; title: string; desc: string }
type FlowStep = { num: string; title: string; desc: string }
type TSongPackagePage = {
  eyebrow: string
  title: string
  price: string
  priceNote: string
  subtitle: string
  btnConsult: string
  btnAvailability: string
  includedEyebrow: string
  includedTitle: string
  included: IncludedItem[]
  forWhoEyebrow: string
  forWhoTitle: string
  forWhoBody: string
  forWho: string[]
  flowEyebrow: string
  flowTitle: string
  flowSteps: FlowStep[]
  reassurance: string
  btnInstagram: string
}

export default function SongPackagePageContent() {
  const { lang } = useLang()
  const T = t[lang].songPackagePage as unknown as TSongPackagePage

  return (
    <div className="bg-white">
      {/* ── First view ── */}
      <div className="mt-[60px] lg:mt-[120px] px-3 sm:px-5 lg:px-10">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "65vh", maxHeight: 780, minHeight: 340, borderRadius: "4px" }}
        >
          <Image
            src="/images/studio/studio-main.jpg"
            alt="Wuloong Studio TOKYO — Song Package"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width:640px) 100vw, 95vw"
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,20,0.22)" }} />
        </div>
      </div>

      {/* ── Editorial intro ── */}
      <div className="bg-white text-center" style={{ padding: "5rem 2rem 3rem" }}>
        <p
          className="text-[#6b9fd4]"
          style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.25rem" }}
        >
          {T.eyebrow}
        </p>
        <h1
          className="text-[#1a2340] font-black"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", letterSpacing: "0.04em", lineHeight: 1.25, marginBottom: "1.5rem" }}
        >
          {T.title}
        </h1>
        <p
          className="gradient-text font-black"
          style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", marginBottom: "2rem" }}
        >
          {T.price}
        </p>
        <p
          className="text-[#64748b]"
          style={{ fontSize: "clamp(0.82rem, 1.2vw, 0.95rem)", lineHeight: 2.1, letterSpacing: "0.03em", maxWidth: "520px", margin: "0 auto 2.5rem", whiteSpace: "pre-line" }}
        >
          {T.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-opacity hover:opacity-80"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)",
              padding: "13px 28px",
              borderRadius: "9999px",
              display: "inline-block",
            }}
          >
            {T.btnConsult}
          </a>
          <Link
            href="#calendar-section"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6b9fd4",
              padding: "12px 28px",
              borderRadius: "9999px",
              border: "1px solid rgba(107,159,212,0.4)",
              display: "inline-block",
              transition: "all 0.2s",
            }}
          >
            {T.btnAvailability}
          </Link>
        </div>
        <p
          className="text-[#94a3b8]"
          style={{ fontSize: "11px", marginTop: "1rem", letterSpacing: "0.03em" }}
        >
          {T.priceNote}
        </p>
      </div>

      {/* ── Included ── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">{T.includedEyebrow}</p>
            <h2 className="section-title">{T.includedTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {T.included.map((item) => (
              <div key={item.num} className="glass-card rounded-2xl p-6">
                <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.3em] mb-3">{item.num}</p>
                <h3 className="font-bold text-[#1a1a2e] text-sm mb-3 leading-snug">{item.title}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed" style={{ whiteSpace: "pre-line" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Artists ── */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "linear-gradient(155deg, #faf8f5 0%, #f0f5ff 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">{T.forWhoEyebrow}</p>
              <h2 className="section-title mb-6">{T.forWhoTitle}</h2>
              <p
                className="text-[#64748b] leading-[1.95] text-sm sm:text-base"
                style={{ whiteSpace: "pre-line" }}
              >
                {T.forWhoBody}
              </p>
            </div>
            <div className="space-y-3">
              {T.forWho.map((item) => (
                <div key={item} className="glass-card rounded-2xl p-4 flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-sm text-[#4a5568] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Flow ── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">{T.flowEyebrow}</p>
            <h2 className="section-title">{T.flowTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {T.flowSteps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < T.flowSteps.length - 1 && (
                  <div
                    className="hidden sm:block absolute top-6 left-full w-8 h-px"
                    style={{ background: "linear-gradient(90deg, #6b9fd4, transparent)" }}
                  />
                )}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm mb-5"
                  style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-[#1a1a2e] mb-3 leading-snug">{step.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed" style={{ whiteSpace: "pre-line" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reassurance + CTA ── */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "linear-gradient(155deg, #f8f6ff 0%, #f0f4ff 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-[#64748b] leading-[2] mb-10"
            style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)", whiteSpace: "pre-line" }}
          >
            {T.reassurance}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              {T.btnInstagram}
            </a>
            <Link href="/booking?plan=song-package" className="btn-secondary text-sm">
              {T.btnAvailability}
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
