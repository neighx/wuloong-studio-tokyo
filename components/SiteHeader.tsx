"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { INSTAGRAM_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

const NAV_HREFS = [
  "/first-time",
  "/pricing",
  "/song-package",
  "/monthly-support",
  "/booking",
  "/access",
  "/faq",
]

const SCROLL_THRESHOLD = 130

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang, setLang } = useLang()
  const T = t[lang]

  const navLinks = NAV_HREFS.map((href, i) => ({
    href,
    label: [
      T.nav.firstTime,
      T.nav.pricing,
      T.nav.songPackage,
      T.nav.support,
      T.nav.booking,
      T.nav.access,
      T.nav.faq,
    ][i],
  }))

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <button
      onClick={() => setLang(lang === "ja" ? "en" : "ja")}
      className={className}
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        color: "#94a3b8",
        padding: "5px 10px",
        borderRadius: "9999px",
        border: "1px solid rgba(148,163,184,0.35)",
        transition: "all 0.2s",
        background: "transparent",
        cursor: "pointer",
      }}
      aria-label="Toggle language"
    >
      {lang === "ja" ? "EN" : "JP"}
    </button>
  )

  return (
    <>
      {/* ══ PC: Large header (before scroll) ══ */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 bg-white
          hidden lg:block
          transition-all duration-400 ease-in-out
          ${scrolled ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}
        `}
      >
        <div
          className="flex items-center justify-center relative"
          style={{ height: "82px" }}
        >
          {/* Left: lang toggle */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2">
            <LangToggle />
          </div>

          {/* Right: Instagram + Book */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-6">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94a3b8] hover:text-[#1a2340] transition-colors"
              style={{ fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase" }}
            >
              Instagram
            </a>
            <Link
              href="/booking"
              className="text-white transition-opacity hover:opacity-80"
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)",
                padding: "8px 20px",
                borderRadius: "9999px",
              }}
            >
              {T.header.book}
            </Link>
          </div>

          {/* Logo center */}
          <Link href="/" className="block">
            <Image
              src="/images/logo/logo.png"
              alt="Wuloong Studio TOKYO"
              width={373}
              height={160}
              priority
              style={{
                height: "clamp(34px, 3.8vw, 48px)",
                width: "auto",
                filter: "brightness(0)",
              }}
            />
          </Link>
        </div>

        <nav
          className="flex items-center justify-center"
          style={{ gap: "3.2rem", paddingTop: "2px", paddingBottom: "18px", borderBottom: "1px solid #e8e8e8" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#5a6472] hover:text-[#1a2340] transition-colors duration-200"
              style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ══ PC: Sticky compact nav (after scroll) ══ */}
      <div
        className={`
          fixed top-0 left-0 right-0 z-50
          hidden lg:block
          transition-all duration-300 ease-in-out
          ${scrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
        `}
        style={{
          background: "rgba(255, 255, 255, 0.90)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <nav
          className="flex items-center justify-center relative"
          style={{ gap: "3.2rem", padding: "15px 0" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#5a6472] hover:text-[#1a2340] transition-colors duration-200"
              style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="absolute right-10">
            <LangToggle />
          </div>
        </nav>
      </div>

      {/* ══ Mobile: Header bar ══ */}
      <div
        className="fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-200"
        style={{
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <div className="relative flex items-center justify-between px-5 h-[60px]">
          {/* Hamburger (left) */}
          <button
            className="p-2 text-[#1a2340] relative z-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? T.header.menuClose : T.header.menuOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo center */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/images/logo/logo.png"
              alt="Wuloong Studio TOKYO"
              width={200}
              height={86}
              priority
              style={{ height: "32px", width: "auto", filter: "brightness(0)" }}
            />
          </Link>

          {/* Book button (right) */}
          <Link
            href="/booking"
            className="relative z-10 text-white"
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)",
              padding: "7px 14px",
              borderRadius: "9999px",
            }}
          >
            {T.header.bookShort}
          </Link>
        </div>
      </div>

      {/* ══ Mobile: Full-screen drawer ══ */}
      <div
        className={`
          fixed inset-0 z-40 bg-white lg:hidden
          transition-all duration-300 ease-in-out
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        style={{ paddingTop: "58px" }}
      >
        <div className="px-8 py-6 h-full overflow-y-auto">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-5 text-[#4a5568] hover:text-[#1a2340] transition-colors border-b border-[#f2f2f2]"
                style={{ fontSize: "13px", letterSpacing: "0.28em", textTransform: "uppercase" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-8 flex flex-col gap-3">
            <Link
              href="/booking"
              onClick={() => setMobileOpen(false)}
              className="text-center py-4 rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)", letterSpacing: "0.1em" }}
            >
              {T.header.book}
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-3.5 rounded-full text-sm font-semibold text-[#6b9fd4]"
              style={{ border: "1px solid rgba(107,159,212,0.35)", letterSpacing: "0.08em" }}
            >
              {T.header.contactInstagram}
            </a>
          </div>

          {/* Lang toggle in drawer */}
          <div className="mt-8 flex justify-center">
            <LangToggle />
          </div>

          <div className="mt-8 pt-6 border-t border-[#f2f2f2]">
            <p style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#94a3b8", textTransform: "uppercase" }}>
              SANGENJAYA · SETAGAYA · TOKYO
            </p>
            <p className="text-xs text-[#94a3b8] mt-2">{T.header.studioInfo}</p>
          </div>
        </div>
      </div>
    </>
  )
}
