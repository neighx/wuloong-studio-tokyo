"use client"

import Link from "next/link"
import { INSTAGRAM_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function MobileFixedCTA() {
  const { lang } = useLang()
  const T = t[lang].mobileFixed

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div
        style={{
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(107,159,212,0.18)",
          boxShadow: "0 -4px 30px rgba(100,130,200,0.14)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          className="text-center py-1.5 text-[10px] font-semibold tracking-wide"
          style={{
            background: "linear-gradient(90deg, rgba(107,159,212,0.12), rgba(155,142,196,0.12))",
            color: "#6b9fd4",
          }}
        >
          {T.strip}
        </div>

        <div className="flex items-stretch">
          <Link
            href="/booking"
            className="flex-1 py-4 text-center font-bold text-white text-sm flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
          >
            <span>📅</span>
            <span>{T.book}</span>
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 text-center font-bold text-sm flex items-center justify-center gap-2"
            style={{ color: "#9b8ec4", borderLeft: "1px solid rgba(155,142,196,0.2)" }}
          >
            <span>💬</span>
            <span>{T.consult}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
