"use client"

import Image from "next/image"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function Hero() {
  const { lang } = useLang()
  const T = t[lang].hero

  return (
    <>
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
          style={{ fontSize: "clamp(1.15rem, 2.8vw, 2rem)", fontWeight: 300, letterSpacing: "0.12em", lineHeight: 2.1, marginBottom: "3rem" }}
        >
          {T.tagline}
        </p>

        <div style={{ maxWidth: "600px", margin: "0 auto 4rem" }}>
          <p
            className="text-[#1a2340]"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)", fontWeight: 500, letterSpacing: "0.05em", lineHeight: 2.0, marginBottom: "1.8rem", fontStyle: "italic" }}
          >
            &ldquo;{T.quote}&rdquo;
          </p>
          <p
            className="text-[#64748b]"
            style={{ fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)", lineHeight: 2.1, letterSpacing: "0.02em", marginBottom: "1.2rem" }}
          >
            {T.body1}
          </p>
          <p
            className="text-[#64748b]"
            style={{ fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)", lineHeight: 2.1, letterSpacing: "0.02em" }}
          >
            {T.body2}
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
    </>
  )
}
