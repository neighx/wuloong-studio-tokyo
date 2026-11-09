"use client"

/**
 * 「予約前のプラン案内」試作（/first-time 専用）
 *
 * 最大3つの質問に答えると、現在のPLANS定義（lib/pricing.ts）から
 * ルールベースで該当プランを案内する軽量な試作コンポーネント。
 * AI APIは使用せず、料金・プラン内容は予約フォームと同じデータを参照する。
 *
 * 取り外す場合は、このファイルと FirstTimePageContent.tsx 内の
 * <PlanGuide /> の呼び出し部分（PLAN_GUIDE マーカー間）を削除するだけでよい。
 */

import Link from "next/link"
import { useEffect, useState } from "react"
import { getPlanById, type PlanId } from "@/lib/pricing"
import { INSTAGRAM_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"
import { track } from "@/lib/analytics"

type Answers = {
  goal?: "record" | "song" | "ongoing"
  material?: "ready" | "partial" | "none"
  next?: "datetime" | "consult"
}

const GOAL_TO_PLAN = {
  record: "first-time-2h",
  song: "song-package",
  ongoing: "monthly-support",
} as const satisfies Record<NonNullable<Answers["goal"]>, PlanId>

export default function PlanGuide() {
  const { lang } = useLang()
  const T = t[lang].planGuide

  const [step, setStep] = useState(0) // 0,1,2 = questions, 3 = result
  const [answers, setAnswers] = useState<Answers>({})

  const keys: (keyof Answers)[] = ["goal", "material", "next"]

  const handleSelect = (value: string) => {
    const key = keys[step]
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setStep((s) => s + 1)
  }

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleRestart = () => {
    setAnswers({})
    setStep(0)
  }

  const needsConsultFirst = answers.material === "none"
  const resolvedPlanId = answers.goal ? GOAL_TO_PLAN[answers.goal] : undefined
  const resolvedPlan = resolvedPlanId ? getPlanById(resolvedPlanId) : undefined

  // 金額・時間は lib/pricing.ts の定義を使う。定義の文言は日本語のみなので、英語表示では翻訳に差し替える
  const result = resolvedPlan && resolvedPlanId && {
    name: lang === "ja" ? resolvedPlan.name : t.en.plans[resolvedPlanId].name,
    price: lang === "ja" ? resolvedPlan.price : resolvedPlan.price.replace(/^(¥[\d,]+)〜/, "From $1").replace("30日", "30 days"),
    priceNote: resolvedPlan.priceNote && (lang === "ja" ? resolvedPlan.priceNote : t.en.planGuide.resultPriceNote),
    description: lang === "ja" ? resolvedPlan.description : t.en.planGuide.resultDescriptions[resolvedPlanId],
    terms: T.resultTerms[resolvedPlanId].replace("{hours}", String(resolvedPlan.durationHours)),
    bookingHref: `/booking?plan=${resolvedPlanId}`,
  }

  const isResult = step >= 3

  useEffect(() => {
    if (isResult) {
      track("plan_guide_complete", {
        result_type: needsConsultFirst ? "consult" : "plan",
        plan_id: !needsConsultFirst ? resolvedPlanId : undefined,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResult])

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.35em] uppercase mb-3">{T.eyebrow}</p>
        <h3 className="font-bold text-[#1a1a2e] text-lg mb-2">{T.title}</h3>
        <p className="text-sm text-[#64748b] leading-relaxed">{T.subtitle}</p>
      </div>

      {!isResult ? (
        <div>
          <p className="text-xs text-[#94a3b8] text-center mb-4">
            {T.stepLabel} {step + 1} {T.stepOf}
          </p>
          <p className="font-semibold text-[#1a1a2e] text-center mb-5">{T.questions[step].label}</p>
          <div className="grid gap-3 sm:grid-cols-2 max-w-md mx-auto">
            {T.questions[step].options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className="px-4 py-3 rounded-2xl text-sm font-medium text-[#1a1a2e] bg-[#f8f9ff] border border-transparent hover:border-[#6b9fd4]/40 hover:bg-[#f0f4ff] transition-all text-left"
              >
                {opt.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <div className="text-center mt-5">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs text-[#94a3b8] hover:text-[#6b9fd4] transition-colors"
              >
                ← {T.btnBack}
              </button>
            </div>
          )}
        </div>
      ) : needsConsultFirst ? (
        <div className="text-center">
          <p className="font-bold text-[#1a1a2e] mb-2">{T.resultConsultTitle}</p>
          <p className="text-sm text-[#64748b] leading-relaxed mb-6 max-w-sm mx-auto">{T.resultConsultBody}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("consult_click", { location: "plan_guide_consult_first" })} className="btn-primary text-sm">
              {T.btnConsult}
            </a>
            <Link href="/pricing" className="btn-secondary text-sm">
              {T.btnPricing}
            </Link>
          </div>
        </div>
      ) : result ? (
        <div className="text-center">
          <p className="font-bold text-[#1a1a2e] mb-4">{T.resultPlanTitle}</p>
          <div
            className="rounded-2xl p-6 mb-4 max-w-sm mx-auto text-left"
            style={{ background: "linear-gradient(155deg, #f0f5ff 0%, #f8f0ff 100%)", border: "1px solid rgba(107,159,212,0.15)" }}
          >
            <p className="font-bold text-[#1a2340] mb-1">{result.name}</p>
            <p className="gradient-text font-black text-xl mb-2">
              {result.price}
              {result.priceNote && (
                <span className="text-xs font-normal text-[#94a3b8] block mt-0.5">{result.priceNote}</span>
              )}
            </p>
            <p className="text-sm text-[#64748b] leading-relaxed">{result.description}</p>
            <p className="text-sm text-[#4a5568] leading-relaxed mt-3">{result.terms}</p>
          </div>
          <p className="text-xs text-[#94a3b8] mb-1">{T.resultPlanNote}</p>
          <p className="text-xs text-[#64748b] leading-relaxed whitespace-pre-line mb-5">{t[lang].firstTimePage.applicationNotice}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {answers.next === "consult" ? (
              <>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("consult_click", { location: "plan_guide_result" })} className="btn-primary text-sm">
                  {T.btnConsult}
                </a>
                <Link href={result.bookingHref} className="btn-secondary text-sm">
                  {T.btnBookPlan}
                </Link>
              </>
            ) : (
              <>
                <Link href={result.bookingHref} className="btn-primary text-sm">
                  {T.btnBookPlan}
                </Link>
                <Link href="/pricing" className="btn-secondary text-sm">
                  {T.btnPricing}
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}

      {isResult && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleRestart}
            className="text-xs text-[#94a3b8] hover:text-[#6b9fd4] transition-colors"
          >
            ↺ {T.btnRestart}
          </button>
        </div>
      )}

      <p className="text-xs text-[#cbd5e1] text-center mt-6">{T.skipNote}</p>
    </div>
  )
}
