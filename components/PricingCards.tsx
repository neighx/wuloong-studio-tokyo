"use client"

import Link from "next/link"
import { PLANS, PlanId } from "@/lib/pricing"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

const STEP_IDS: { id: PlanId; step: string; icon: string }[] = [
  { id: "first-time-2h", step: "01", icon: "🎙️" },
  { id: "standard-3h", step: "02", icon: "🎵" },
  { id: "song-package", step: "03", icon: "✨" },
  { id: "monthly-support", step: "04", icon: "🚀" },
]

const FEATURED_ID = "song-package"

export default function PricingCards() {
  const { lang } = useLang()
  const T = t[lang]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
      {STEP_IDS.map(({ id, step, icon }, idx) => {
        const plan = PLANS.find((p) => p.id === id)!
        const planT = T.plans[id]
        const featured = id === FEATURED_ID
        const label = T.pricingCardsLabels[idx]

        return (
          <div
            key={id}
            className="relative rounded-3xl flex flex-col transition-all duration-300 hover:-translate-y-1"
            style={
              featured
                ? {
                    background: "linear-gradient(155deg, #1a1a2e 0%, #0d1535 55%, #19143a 100%)",
                    border: "1px solid rgba(107,159,212,0.22)",
                    boxShadow: "0 0 80px rgba(107,159,212,0.12), 0 25px 60px rgba(0,0,0,0.4)",
                  }
                : {
                    background: "linear-gradient(155deg, #f8f9ff 0%, #f4f0ff 100%)",
                    border: "1px solid rgba(200,195,230,0.4)",
                    boxShadow: "0 2px 20px rgba(107,100,180,0.06)",
                  }
            }
          >
            {/* Top section */}
            <div className="px-5 pt-6 pb-0">
              {/* Step + label */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-[10px] font-black tracking-[0.25em]"
                  style={{ color: featured ? "rgba(107,159,212,0.7)" : "#a0aec0" }}
                >
                  STEP {step}
                </span>
                {featured ? (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    {label}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#94a3b8]">{label}</span>
                )}
              </div>

              {/* Icon */}
              <div className="text-3xl mb-3">{icon}</div>

              {/* Plan name */}
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: featured ? "#ffffff" : "#1a1a2e" }}
              >
                {planT.name}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: featured ? "rgba(255,255,255,0.55)" : "#64748b", minHeight: "5.5rem" }}
              >
                {planT.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span
                  className="text-2xl font-black"
                  style={{
                    color: featured
                      ? "#7eb8e8"
                      : id === "first-time-2h"
                      ? "#6b9fd4"
                      : id === "standard-3h"
                      ? "#6b9fd4"
                      : "#e8afc4",
                  }}
                >
                  {plan.price}
                </span>
                {plan.priceNote && (
                  <span
                    className="text-xs block mt-0.5"
                    style={{ color: featured ? "rgba(255,255,255,0.38)" : "#94a3b8" }}
                  >
                    {plan.priceNote}
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="px-5 flex-1">
              <ul className="space-y-2.5 mb-7">
                {planT.features.slice(0, featured ? 6 : 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span
                      className="mt-0.5 flex-shrink-0 font-bold"
                      style={{ color: featured ? "#7eb8e8" : "#6b9fd4" }}
                    >
                      ✓
                    </span>
                    <span style={{ color: featured ? "rgba(255,255,255,0.62)" : "#4a5568" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
              <Link
                href={plan.ctaHref}
                className="block text-center py-3.5 px-6 rounded-full font-bold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: featured
                    ? "linear-gradient(135deg, #6b9fd4, #9b8ec4)"
                    : id === "first-time-2h" || id === "standard-3h"
                    ? "#6b9fd4"
                    : "#e8afc4",
                }}
              >
                {planT.cta}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
