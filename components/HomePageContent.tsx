"use client"

import { useState } from "react"
import Link from "next/link"
import Hero from "@/components/Hero"
import OfferCards from "@/components/OfferCards"
import FAQ from "@/components/FAQ"
import CTASection from "@/components/CTASection"
import BookingCalendar from "@/components/BookingCalendar"
import { INSTAGRAM_URL, LINE_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function HomePageContent() {
  const { lang } = useLang()
  const T = t[lang]
  const [pickedDate, setPickedDate] = useState("")
  const [pickedTime, setPickedTime] = useState("")

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Why Book — 4 reasons */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">{T.whyBook.eyebrow}</p>
            <h2 className="section-title mb-4">{T.whyBook.title}</h2>
            <p className="section-subtitle max-w-lg mx-auto" style={{ whiteSpace: "pre-line" }}>{(T.whyBook as unknown as { subtitle: string }).subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(T.whyBook.cards as unknown as { num: string; title: string; desc: string }[]).map((card) => (
              <div key={card.num} className="glass-card rounded-2xl p-6">
                <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.3em] mb-3">{card.num}</p>
                <h3 className="font-bold text-[#1a1a2e] text-sm mb-2 leading-snug">{card.title}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed" style={{ whiteSpace: "pre-line" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Offer Cards */}
      <OfferCards />

      {/* 3. First Time Friendly */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "linear-gradient(155deg, #faf8f5 0%, #f0f5ff 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
                {T.firstTime.eyebrow}
              </p>
              <h2 className="section-title mb-5">
                {T.firstTime.title}<br />
                <span className="gradient-text">{T.firstTime.titleHighlight}</span>
              </h2>
              <p className="text-[#64748b] leading-[1.95] mb-8 max-w-sm" style={{ whiteSpace: "pre-line" }}>
                {T.firstTime.body}
              </p>

              <div className="grid grid-cols-1 gap-3 mb-10">
                {["📝", "🔒", "🎚️"].map((icon, i) => (
                  <div key={icon} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                    <p className="text-sm text-[#4a5568] leading-relaxed">{(T.firstTime.bullets as unknown as string[])[i]}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/booking?plan=first-time-2h" className="btn-primary text-sm">
                  {T.firstTime.btnBook}
                </Link>
                <Link href="/first-time" className="btn-secondary text-sm">
                  {T.firstTime.btnLearn}
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className="rounded-3xl p-7"
                style={{ background: "linear-gradient(155deg, #1a1a2e, #0d1535)", border: "1px solid rgba(107,159,212,0.2)" }}
              >
                <div className="text-3xl mb-4">🎙️</div>
                <h3 className="font-bold text-white text-lg mb-2">{T.firstTime.cardTitle}</h3>
                <p className="text-sm text-white/55 leading-relaxed mb-5">{T.firstTime.cardDesc}</p>
                <p className="text-3xl font-black mb-5" style={{ color: "#7eb8e8" }}>¥12,000〜</p>
                <ul className="space-y-2 mb-6">
                  {T.firstTime.cardFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/55">
                      <span className="text-[#7eb8e8] font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/booking?plan=first-time-2h"
                  className="block text-center py-3.5 rounded-full font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                >
                  {T.firstTime.cardCta}
                </Link>
              </div>

              <div className="glass-card rounded-2xl p-5 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">💬</span>
                <div>
                  <p className="font-semibold text-[#1a1a2e] text-sm mb-1">{T.firstTime.trustTitle}</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">{T.firstTime.trustBody}</p>
                  <div className="flex gap-3 mt-3">
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#6b9fd4] hover:underline">
                      {T.firstTime.trustInstagram}
                    </a>
                    {LINE_URL && (
                      <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#6b9fd4] hover:underline">
                        {T.firstTime.trustLine}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Studio Features */}
      <section className="bg-white">
        <div className="pt-24 pb-14 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">{T.studio.eyebrow}</p>
              <h2 className="section-title mb-4">{T.studio.title}</h2>
              <p className="section-subtitle max-w-md mx-auto">{T.studio.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(T.studio.specs as unknown as { label: string; value: string; desc: string }[]).map((item) => (
                <div key={item.label} className="glass-card rounded-2xl p-5">
                  <p className="text-[10px] text-[#94a3b8] tracking-widest uppercase mb-1.5">{item.label}</p>
                  <p className="text-sm font-bold text-[#1a1a2e] mb-2 leading-tight">{item.value}</p>
                  <p className="text-xs text-[#64748b] leading-relaxed" style={{ whiteSpace: "pre-line" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden" style={{ height: "80vh", maxHeight: 800 }}>
          <video
            src="/videos/studio.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "rgba(240,238,235,0.18)" }} />
        </div>

        <div className="pb-24" />
      </section>

      {/* 5. Booking Calendar */}
      <section id="calendar-section" className="py-24 px-4 sm:px-6" style={{ background: "linear-gradient(155deg, #f8f6ff 0%, #f0f4ff 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">{T.booking.eyebrow}</p>
            <h2 className="section-title mb-3">{T.booking.title}</h2>
            <p className="section-subtitle">{T.booking.subtitle}</p>
          </div>
          {/* Reassurance before calendar */}
          <div className="glass-card rounded-2xl p-6 mb-8 text-center">
            <h3 className="font-semibold text-[#1a1a2e] mb-2 text-sm">{T.bookingReassurance.title}</h3>
            <p className="text-sm text-[#64748b] leading-relaxed mb-4" style={{ whiteSpace: "pre-line" }}>{T.bookingReassurance.desc}</p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[#6b9fd4] text-xs font-semibold border border-[#6b9fd4]/30 rounded-full px-5 py-2 hover:bg-[#6b9fd4]/5 transition-colors"
            >
              {T.bookingReassurance.btnInstagram}
            </a>
          </div>

          <BookingCalendar
            onSelectDateTime={(date, time) => {
              setPickedDate(date)
              setPickedTime(time)
            }}
            selectedDate={pickedDate}
            selectedTime={pickedTime}
          />

          {/* CTA after calendar — shows dynamic link when date+time are selected */}
          <div className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center">
            {pickedDate && pickedTime ? (
              <Link
                href={`/booking?date=${pickedDate}&time=${encodeURIComponent(pickedTime)}`}
                className="btn-primary text-sm animate-pulse-once"
              >
                {T.booking.btnFormSelected}
              </Link>
            ) : (
              <Link href="/booking" className="btn-primary text-sm">
                {T.booking.btnForm}
              </Link>
            )}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
              {T.booking.btnInstagram}
            </a>
          </div>
        </div>
      </section>

      {/* 6. Sound Direction */}
      <section className="py-24 px-4 sm:px-6 bg-[#1a1a2e] text-white relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(155,142,196,0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div className="relative max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-[#7eb8e8] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
                {T.soundDirection.eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                {T.soundDirection.title}
              </h2>
              <div className="space-y-4 text-white/65 leading-[1.95] text-sm sm:text-base">
                <p>{T.soundDirection.p1}</p>
                <p>{T.soundDirection.p2}</p>
                <p>{T.soundDirection.p3}</p>
                <p>{T.soundDirection.p4}</p>
              </div>
              <div className="mt-6">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[#7eb8e8] text-xs font-semibold rounded-full px-5 py-2.5 hover:bg-[#7eb8e8]/10 transition-colors"
                  style={{ border: "1px solid rgba(126,184,232,0.35)" }}
                >
                  {T.soundDirection.btnInstagram}
                </a>
              </div>
            </div>

            <div
              className="rounded-3xl p-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(100,160,255,0.06)" }}
            >
              <p className="text-[#7eb8e8] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
                {T.soundDirection.worksLabel}
              </p>
              <iframe
                src="https://open.spotify.com/embed/playlist/5X4LimDsATStOPOQoY18oA?utm_source=generator&theme=0&si=806ededdc5d84763"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: "12px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Artist Support */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(155deg, #f0f5ff 0%, #f8f0ff 100%)", border: "1px solid rgba(155,142,196,0.2)" }}
          >
            <p className="text-[#9b8ec4] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">{T.artistSupport.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] mb-5 leading-tight">
              {T.artistSupport.title}<br />
              <span className="gradient-text">{T.artistSupport.titleHighlight}</span>
            </h2>
            <div className="space-y-4 text-[#64748b] leading-[1.95] mb-8 max-w-md mx-auto text-sm sm:text-base">
              <p style={{ whiteSpace: "pre-line" }}>{T.artistSupport.p1}</p>
              <p style={{ whiteSpace: "pre-line" }}>{T.artistSupport.p2}</p>
              <p style={{ whiteSpace: "pre-line" }}>{T.artistSupport.p3}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                {T.artistSupport.btnInstagram}
              </a>
              <Link href="/monthly-support" className="btn-secondary text-sm">
                {T.artistSupport.btnLearn}
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-5">{T.artistSupport.note}</p>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-24 px-4 sm:px-6 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">{T.faqSection.eyebrow}</p>
            <h2 className="section-title mb-4">{T.faqSection.title}</h2>
            <p className="section-subtitle">{T.faqSection.subtitle}</p>
          </div>

          <FAQ items={T.faqItems as unknown as { q: string; a: string }[]} title="" />

          <div className="mt-10 text-center">
            <Link href="/faq" className="btn-secondary text-sm">
              {T.faqSection.btnAll}
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <CTASection />
    </>
  )
}
