"use client"

import Link from "next/link"
import { INSTAGRAM_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

interface CTASectionProps {
  title?: string
  subtitle?: string
}

export default function CTASection({ title, subtitle }: CTASectionProps = {}) {
  const { lang } = useLang()
  const T = t[lang].cta
  const displayTitle = title ?? T.title
  const displaySubtitle = subtitle ?? T.subtitle

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d2b52 50%, #1a2a3e 100%)" }}
      />
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(155,142,196,0.2) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(107,159,212,0.2) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
          {displayTitle}
        </h2>
        <p className="text-white/60 text-base sm:text-lg mb-12 max-w-xl mx-auto">{displaySubtitle}</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/booking" className="btn-primary text-sm sm:text-base">
            {T.btnAvailability}
          </Link>
          <Link href="/booking?plan=first-time-2h" className="btn-outline-white text-sm sm:text-base">
            {T.btnFirstTime}
          </Link>
          <Link href="/song-package" className="btn-outline-white text-sm sm:text-base">
            {T.btnSongPackage}
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-white text-sm sm:text-base"
          >
            {T.btnInstagram}
          </a>
        </div>
      </div>
    </section>
  )
}
