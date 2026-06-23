import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { INSTAGRAM_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Wuloong Studio TOKYO — 三軒茶屋のプライベートスタジオ",
  description: "三軒茶屋のプライベートレコーディングスタジオ。初回体験 ¥12,000〜。女性1人OK・初心者大歓迎・完全予約制。",
  robots: { index: false, follow: false },
}

export default function InstagramLandingPage() {
  return (
    <div className="min-h-screen bg-[#08090d] text-white">

      {/* ── TOP: Logo + Studio name ── */}
      <div className="pt-16 pb-0 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6b9fd4] animate-pulse" />
          <span className="text-white/40 text-[10px] font-semibold tracking-[0.4em] uppercase">SANGENJAYA · TOKYO</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4">
          三軒茶屋の<br />
          <span style={{ background: "linear-gradient(135deg, #7eb8e8, #c8b4e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            プライベートスタジオ
          </span>
        </h1>

        <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          Wuloong Studio TOKYO<br />
          初めての録音から、1曲完成まで。
        </p>
      </div>

      {/* ── STUDIO PHOTO ── */}
      <div className="px-6 mb-8">
        <div className="relative w-full max-w-sm mx-auto aspect-[4/5] rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <Image
            src="/images/studio/studio-main.jpg"
            alt="Wuloong Studio TOKYO"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width:640px) 90vw, 384px"
          />
          <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(8,9,13,0.85) 100%)" }} />

          {/* Trust badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(107,159,212,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(107,159,212,0.3)" }}>
              🎙 PRIVATE STUDIO
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              ✓ 女性1人でも安心
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(8,9,13,0.75)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-white/40 text-[10px] mb-0.5">STARTING FROM</p>
              <p className="text-white font-black text-lg">初回体験 ¥12,000〜</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST SIGNALS ── */}
      <div className="px-6 mb-8 max-w-sm mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "✓", text: "女性1人でも安心" },
            { icon: "✓", text: "初めてでも大丈夫" },
            { icon: "✓", text: "完全予約制" },
            { icon: "✓", text: "手ぶらでOK" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-white/60"
              style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-[#7eb8e8] font-bold">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── 3 PLANS QUICK OVERVIEW ── */}
      <div className="px-6 mb-10 max-w-sm mx-auto">
        <div className="space-y-3">
          {[
            { name: "初回体験", desc: "初めての録音・3時間", price: "¥12,000〜", color: "#6b9fd4", href: "/booking?plan=first-time-2h" },
            { name: "1曲完成パック", desc: "録音〜MIX〜マスタリング", price: "¥30,000〜", color: "#9b8ec4", href: "/booking?plan=song-package", featured: true },
            { name: "30日サポート", desc: "継続的なアーティスト活動", price: "¥50,000〜/30日", color: "#e8afc4", href: "/monthly-support" },
          ].map((plan) => (
            <Link
              key={plan.name}
              href={plan.href}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${plan.featured ? "" : ""}`}
              style={
                plan.featured
                  ? { background: "linear-gradient(135deg, rgba(107,159,212,0.15), rgba(155,142,196,0.15))", border: "1px solid rgba(107,159,212,0.3)" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-sm text-white">{plan.name}</p>
                  {plan.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}>人気No.1</span>
                  )}
                </div>
                <p className="text-[11px] text-white/40">{plan.desc}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-sm" style={{ color: plan.color }}>{plan.price}</p>
                <p className="text-[10px] text-white/30 mt-0.5">詳細 →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── PRIMARY CTAs ── */}
      <div className="px-6 pb-16 max-w-sm mx-auto space-y-3">
        <Link
          href="/booking"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-white text-base"
          style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
        >
          <span>📅</span>
          <span>今すぐ予約する</span>
        </Link>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-sm"
          style={{ border: "1px solid rgba(155,142,196,0.35)", color: "#c8b4e8", background: "rgba(155,142,196,0.06)" }}
        >
          <span>💬</span>
          <span>まずInstagramで相談する（無料）</span>
        </a>
        <Link
          href="/"
          className="flex items-center justify-center w-full py-3 rounded-full font-medium text-xs text-white/35"
        >
          サイト全体を見る →
        </Link>
      </div>
    </div>
  )
}
