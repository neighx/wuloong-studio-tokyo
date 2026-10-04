/**
 * 初心者が予約前に知りたい情報を、クリックせずに読める文章として提示する。
 * 内容はすべて lib/pricing.ts・lib/i18n.ts の既存の確定済みテキストのみを使用し、
 * 担当者名・実績・未確認の納品条件などは今回追加しない。
 */
"use client"

import Link from "next/link"
import { getPlanById } from "@/lib/pricing"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function FirstTimeKeyFacts() {
  const { lang } = useLang()
  const T = t[lang].firstTimeFacts

  const firstTimePlan = getPlanById("first-time-2h")!
  const songPlan = getPlanById("song-package")!

  return (
    <section className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title text-center mb-3">{T.title}</h2>
        <p className="section-subtitle text-center mb-10">{T.subtitle}</p>

        {/* 含まれるもの／含まれないもの比較 */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="glass-card rounded-2xl p-6">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#6b9fd4] mb-2">{T.compare.firstLabel}</p>
            <p className="font-bold text-[#1a1a2e] mb-1">{firstTimePlan.name}</p>
            <p className="gradient-text font-black text-lg mb-3">{firstTimePlan.price}</p>
            <ul className="space-y-1.5">
              {firstTimePlan.features.map((f) => (
                <li key={f} className="text-sm text-[#4a5568] flex gap-2">
                  <span className="text-[#6b9fd4]">·</span>{f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#94a3b8] mt-3">{T.compare.firstNote}</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9b8ec4] mb-2">{T.compare.songLabel}</p>
            <p className="font-bold text-[#1a1a2e] mb-1">{songPlan.name}</p>
            <p className="gradient-text font-black text-lg mb-3">
              {songPlan.price}
              {songPlan.priceNote && <span className="text-xs font-normal text-[#94a3b8] block">{songPlan.priceNote}</span>}
            </p>
            <ul className="space-y-1.5">
              {songPlan.features.map((f) => (
                <li key={f} className="text-sm text-[#4a5568] flex gap-2">
                  <span className="text-[#9b8ec4]">·</span>{f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#94a3b8] mt-3">{T.compare.songNote}</p>
          </div>
        </div>

        {/* 一次情報Q&A（開閉なしで常に表示） */}
        <div className="space-y-6">
          {T.qa.map((item) => (
            <div key={item.q}>
              <p className="font-semibold text-[#1a1a2e] mb-1.5">{item.q}</p>
              <p className="text-sm text-[#64748b] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <Link href="/pricing" className="btn-secondary text-sm">{T.btnPricing}</Link>
          <Link href="/booking?plan=first-time-2h" className="btn-primary text-sm">{T.btnBook}</Link>
        </div>
      </div>
    </section>
  )
}
