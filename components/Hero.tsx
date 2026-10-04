"use client"

import Image from "next/image"
import Link from "next/link"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"
import { INSTAGRAM_URL } from "@/lib/constants"

export default function Hero() {
  const { lang } = useLang()
  const T = t[lang].hero

  return (
    <div className="bg-white">
      {/* Studio photo */}
      <div className="mt-[60px] lg:mt-[120px] px-3 sm:px-5 lg:px-10">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "72vh", maxHeight: 860, minHeight: 380, borderRadius: "4px" }}
        >
          <Image
            src="/images/studio/studio-main.jpg"
            alt="Wuloong Studio TOKYO"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width:640px) 100vw, 95vw"
          />
        </div>
      </div>

      {/* White editorial section */}
      <div className="bg-white text-center" style={{ padding: "6rem 2rem 3rem" }}>
        <p
          className="text-[#1a2340]"
          style={{ fontSize: "clamp(1.15rem, 2.8vw, 2rem)", fontWeight: 300, letterSpacing: "0.12em", lineHeight: 2.1, marginBottom: "2rem" }}
        >
          {T.tagline}
        </p>

        {/* Hero description + CTAs */}
        <div style={{ maxWidth: "560px", margin: "0 auto 3rem" }}>
          <p
            className="text-[#64748b]"
            style={{ fontSize: "clamp(0.82rem, 1.2vw, 0.95rem)", lineHeight: 2.2, letterSpacing: "0.04em", marginBottom: "2rem", whiteSpace: "pre-line" }}
          >
            {T.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/first-time"
              className="transition-opacity hover:opacity-80"
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#6b9fd4",
                padding: "12px 27px",
                borderRadius: "9999px",
                border: "1px solid rgba(107,159,212,0.4)",
                display: "inline-block",
              }}
            >
              {T.btnFirstTime}
            </Link>
            <Link
              href="#calendar-section"
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
              {T.btnAvailability}
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
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
              {T.btnInstagram}
            </a>
          </div>
        </div>

        <div style={{ maxWidth: "600px", margin: "0 auto 3.5rem" }}>
          <p
            className="text-[#1a2340]"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)", fontWeight: 500, letterSpacing: "0.05em", lineHeight: 2.0, fontStyle: "italic", whiteSpace: "pre-line" }}
          >
            &ldquo;{T.quote}&rdquo;
          </p>
        </div>

        <h1
          className="text-[#1a2340] font-black uppercase leading-none"
          style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)", letterSpacing: "0.1em", marginBottom: "2.5rem" }}
        >
          VOCAL IS BEAUTIFUL
        </h1>

        <div className="flex justify-center" style={{ marginBottom: "3.5rem" }}>
          <Image
            src="/images/logo/logo.png"
            alt="Wuloong Studio"
            width={373}
            height={160}
            style={{ height: "clamp(28px, 3.2vw, 40px)", width: "auto", filter: "brightness(0)", opacity: 0.6 }}
          />
        </div>
      </div>
    </div>
  )
}
