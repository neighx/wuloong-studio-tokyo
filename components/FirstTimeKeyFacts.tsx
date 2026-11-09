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

/** 読点・句点の位置でだけ折り返す（句の途中で改行しない）。英語はこれらの記号を含まないので通常どおり折り返す。 */
function wrapPhrases(text: string) {
  return (text.match(/[^、。]+[、。]?”?/g) ?? [text]).map((phrase, i) => (
    <span key={i} className="inline-block">{phrase}</span>
  ))
}

export default function FirstTimeKeyFacts() {
  const { lang } = useLang()
  const T = t[lang].firstTimeFacts

  // lib/pricing.ts の名称・特徴は日本語のみなので、英語表示では既存の対訳に差し替える
  const firstBase = getPlanById("first-time-2h")!
  const songBase = getPlanById("song-package")!
  const firstTimePlan = lang === "ja" ? firstBase : { ...firstBase, ...t.en.plans["first-time-2h"] }
  const songPlan = lang === "ja"
    ? songBase
    : { ...songBase, ...t.en.plans["song-package"], price: t.en.songPackagePage.price, priceNote: t.en.songPackagePage.priceNote }

  return (
    <section className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title text-center mb-3">{T.title}</h2>
        <p className="section-subtitle text-center mb-10">{T.subtitle}</p>

        {/* 録音と1曲完成パックの使い分けをひとことで示す。文面・対訳はTOPの引用と共通。和文の斜体は字形が崩れるため、日本語は細字の正体にする */}
        <p
          className="text-center text-[#1a2340] mb-10"
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
            fontWeight: lang === "ja" ? 300 : 500,
            fontStyle: lang === "ja" ? "normal" : "italic",
            letterSpacing: "0.05em",
            lineHeight: 2,
          }}
        >
          {`“${t[lang].hero.quote}”`.split("\n").map((line) => (
            <span key={line} className="block">{wrapPhrases(line)}</span>
          ))}
        </p>

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
