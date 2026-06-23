"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { INSTAGRAM_URL } from "@/lib/constants"

const navLinks = [
  { href: "/first-time",      label: "はじめての方へ" },
  { href: "/pricing",         label: "料金" },
  { href: "/song-package",    label: "1曲完成パック" },
  { href: "/monthly-support", label: "30日サポート" },
  { href: "/booking",         label: "予約" },
  { href: "/access",          label: "アクセス" },
  { href: "/faq",             label: "FAQ" },
]

// ロゴセクションの高さ（スクロール検知の閾値）
const SCROLL_THRESHOLD = 130

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    handler() // 初期値セット
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // モバイルメニューを開いた時にスクロール禁止
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      {/* ══════════════════════════════════════════════
          PC: 大きいヘッダー（スクロール前のみ表示）
          ロゴ + ナビ、上品な余白
          ══════════════════════════════════════════════ */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 bg-white
          hidden lg:block
          transition-all duration-400 ease-in-out
          ${scrolled ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}
        `}
      >
        {/* ロゴエリア：中央・上下余白たっぷり */}
        <div
          className="flex items-center justify-center relative"
          style={{ height: "82px" }}
        >
          {/* 右端: Instagram + 予約 */}
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
              予約する
            </Link>
          </div>

          {/* ロゴ中央 */}
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

        {/* ナビゲーション：中央・文字大きめ・letter-spacing広め */}
        <nav
          className="flex items-center justify-center"
          style={{
            gap: "3.2rem",
            paddingTop: "2px",
            paddingBottom: "18px",
            borderBottom: "1px solid #e8e8e8",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#5a6472] hover:text-[#1a2340] transition-colors duration-200"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ══════════════════════════════════════════════
          PC: Stickyコンパクトナビ（スクロール後）
          glassmorphism + blur
          ══════════════════════════════════════════════ */}
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
          className="flex items-center justify-center"
          style={{ gap: "3.2rem", padding: "15px 0" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#5a6472] hover:text-[#1a2340] transition-colors duration-200"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE: ヘッダーバー
          常に表示・コンパクト
          ══════════════════════════════════════════════ */}
      <div
        className={`
          fixed top-0 left-0 right-0 z-50 lg:hidden
          transition-all duration-200
        `}
        style={{
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <div className="relative flex items-center justify-between px-5 h-[60px]">
          {/* ハンバーガー (左) */}
          <button
            className="p-2 text-[#1a2340] relative z-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* ロゴ中央 */}
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

          {/* 予約ボタン (右) */}
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
            予約
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE: フルスクリーンメニュードロワー
          ══════════════════════════════════════════════ */}
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
              予約する
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-3.5 rounded-full text-sm font-semibold text-[#6b9fd4]"
              style={{ border: "1px solid rgba(107,159,212,0.35)", letterSpacing: "0.08em" }}
            >
              Instagramで相談する
            </a>
          </div>

          {/* スタジオ情報 */}
          <div className="mt-10 pt-8 border-t border-[#f2f2f2]">
            <p style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#94a3b8", textTransform: "uppercase" }}>
              SANGENJAYA · SETAGAYA · TOKYO
            </p>
            <p className="text-xs text-[#94a3b8] mt-2">完全予約制プライベートスタジオ</p>
          </div>
        </div>
      </div>
    </>
  )
}
