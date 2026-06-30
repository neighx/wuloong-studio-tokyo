"use client"

import Link from "next/link"
import Image from "next/image"
import { INSTAGRAM_URL, LINE_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function SiteFooter() {
  const { lang } = useLang()
  const T = t[lang].footer

  return (
    <footer className="bg-[#1a1a2e] text-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <Image
                src="/images/logo/logo.png"
                alt="Wuloong Studio"
                width={140}
                height={48}
                className="h-9 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              {T.brand}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">{T.menu}</h3>
            <ul className="space-y-2">
              {T.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#7eb8e8] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">{T.contact}</h3>
            <div className="space-y-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#7eb8e8] transition-colors"
              >
                <span>📷</span>
                <span>{T.instagram}</span>
              </a>
              {LINE_URL && (
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-[#7eb8e8] transition-colors"
                >
                  <span>💬</span>
                  <span>{T.line}</span>
                </a>
              )}
              <Link
                href="/booking"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#7eb8e8] transition-colors"
              >
                <span>📅</span>
                <span>{T.calendarLink}</span>
              </Link>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">
                {T.location}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Wuloong Studio TOKYO. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/contact" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              {T.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
