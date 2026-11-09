"use client"

import Image from "next/image"
import Link from "next/link"
import CTASection from "@/components/CTASection"
import FAQ from "@/components/FAQ"
import PlanGuide from "@/components/PlanGuide"
import FirstTimeKeyFacts from "@/components/FirstTimeKeyFacts"
import { getPlanById } from "@/lib/pricing"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export default function FirstTimePageContent() {
  const { lang } = useLang()
  const T = t[lang].firstTimePage
  // キャッチはTOPと同じ文面・対訳を使い、最初の読点・ピリオドの位置で2行に分ける
  const catchCopy = t[lang].hero.tagline.replace(/([、.])\s*/, "$1\n")

  // 料金・時間・予約先は lib/pricing.ts の初回プラン定義を参照する（文言側に金額を持たない）
  const firstTimePlan = getPlanById("first-time-2h")!
  const hours = String(firstTimePlan.durationHours)
  const offerLabel = T.offerLabel.replace("{hours}", hours)
  const offerPrice = T.offerPrice.replace("{price}", firstTimePlan.price.replace("¥", ""))
  const btnAvailability = T.btnAvailability.replace("{hours}", hours)

  // PCの左カラムの内側余白。1024pxで24px、1280px以上で48pxになるよう幅に応じて変化する（写真の列は動かさない）
  const pcIndent = "lg:pr-0 lg:pl-[clamp(24px,calc(9.375vw_-_72px),48px)]"

  // 料金から下の書体と文字サイズ。和文は数字・欧文も明朝で揃え、サイト共通の数字用サンセリフをここだけ外す。
  // 英語のCormorantは字面が小さいので、同じ見た目になるよう少し大きくする
  const isJa = lang === "ja"
  const offerFont = isJa ? "[font-family:var(--font-noto-serif),var(--font-cormorant),serif]" : "font-sans lining-nums"
  const offerSmall = isJa ? "text-xs lg:text-[13px]" : "text-sm lg:text-[15px]"
  const offerBody = isJa ? "text-[13px] lg:text-sm" : "text-[15px] lg:text-base"

  return (
    <>
      {/* ファーストビュー。スマホは「見出し→室内写真→料金・予約」の順。1024px以上は写真だけ右列へ移す */}
      <section className="bg-white pt-[88px] pb-10 lg:px-8 lg:pt-[164px] lg:pb-16">
        <div className="mx-auto grid max-w-2xl grid-cols-1 lg:max-w-[1200px] lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-14">
          <div className={`px-6 lg:col-start-1 lg:row-start-1 ${pcIndent}`}>
            <p className="text-xs font-medium tracking-[0.23em] text-[#55647a] lg:text-[13px]">
              VOCAL IS BEAUTIFUL
            </p>
            <h1
              className={`mt-[18px] whitespace-pre-line text-[clamp(1.75rem,8.2vw,2rem)] font-normal leading-[1.67] text-[#1a2340] lg:text-[clamp(2.25rem,3.1vw,2.625rem)] ${isJa ? "tracking-[0.06em]" : "tracking-[0.03em]"}`}
            >
              {catchCopy}
            </h1>
            <p className={`mt-4 whitespace-pre-line leading-[1.9] text-[#5d6371] ${isJa ? "text-sm lg:text-[15px]" : "text-[15px] tracking-[0.02em] lg:text-base"}`}>
              {T.heroDescription}
            </p>
          </div>

          <div className="mt-5 px-3.5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center lg:px-0">
            {/* 比率で表示領域を先に確保し、画像の読み込みでレイアウトがずれないようにする */}
            <div className="relative aspect-video overflow-hidden rounded-[4px] lg:aspect-[4/3]">
              <Image
                src="/images/studio/studio-main.jpg"
                alt={T.heroImageAlt}
                fill
                loading="eager"
                fetchPriority="high"
                className="object-cover object-[45%_50%]"
                sizes="(min-width: 1264px) 572px, (min-width: 1024px) calc(50vw - 60px), (min-width: 672px) 644px, calc(100vw - 28px)"
              />
            </div>
          </div>

          <div className={`mt-[22px] px-6 lg:col-start-1 lg:row-start-2 lg:mt-7 ${pcIndent} ${offerFont}`}>
            <p className={`leading-[1.7] tracking-[0.08em] text-[#5b6376] ${offerSmall}`}>
              {offerLabel}
            </p>
            <p className="mt-1 whitespace-nowrap text-[#1a2340]">
              <span className="text-[28px] font-normal leading-[1.4] tracking-[0.02em] lg:text-[32px]">{offerPrice}</span>
              <span className={`text-[#5b6376] ${offerSmall}`}>{T.offerTax}</span>
            </p>
            <div className="mt-2.5">
              {T.offerPoints.map((point, i) => (
                <p key={point} className={`leading-[25px] ${i === 0 ? `${offerBody} text-[#363f52]` : `${offerSmall} text-[#646b79]`}`}>
                  {point}
                </p>
              ))}
            </div>

            <div className="mt-[18px] flex flex-col items-center lg:mt-6 lg:items-start">
              <Link
                href={firstTimePlan.ctaHref}
                className={`flex min-h-[50px] w-full items-center justify-center text-balance rounded-full bg-[#1a2340] px-6 py-3 text-center leading-snug tracking-[0.02em] text-white transition-colors hover:bg-[#2c3a60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a2340] lg:w-auto lg:px-9 ${isJa ? "text-sm font-normal lg:text-[15px]" : "text-base font-medium"}`}
              >
                {btnAvailability}
              </Link>
              <Link
                href="/contact"
                className={`mt-1 inline-flex min-h-11 items-center text-[#515e75] underline underline-offset-4 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a2340] ${offerSmall}`}
              >
                {T.btnConsultRecording}
              </Link>
            </div>
            <p className={`mt-1 whitespace-pre-line text-center leading-[1.65] text-[#6a7180] lg:text-left ${isJa ? "text-xs" : "text-[13px]"}`}>
              {T.applicationNotice}
            </p>
          </div>
        </div>
      </section>

      {/* Safety points */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {T.safetyPoints.map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FirstTimeKeyFacts />

      {/* Flow */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-12">{T.flowTitle}</h2>
          <div className="space-y-4">
            {T.steps.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    {step.num}
                  </div>
                  {i < T.steps.length - 1 && (
                    <div className="w-0.5 flex-1 mt-2 bg-gradient-to-b from-[#6b9fd4]/30 to-transparent" />
                  )}
                </div>
                <div className="pb-6 pt-1">
                  <h3 className="font-bold text-[#1a1a2e] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLAN_GUIDE_PROTOTYPE START — 取り外す場合はこのsectionとPlanGuideコンポーネントを削除 */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <PlanGuide />
        </div>
      </section>
      {/* PLAN_GUIDE_PROTOTYPE END */}

      {/* Checklist */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title text-center mb-8">{T.checklistTitle}</h2>
          <div className="space-y-3">
            {T.items.map((item) => (
              <div key={item.text} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#6b9fd4]/10 text-[#6b9fd4] mr-2">
                    {item.label}
                  </span>
                  <span className="text-sm text-[#4a5568]">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#64748b] text-center mt-6 leading-relaxed">{T.checklistNote}</p>
        </div>
      </section>

      {/* Anxieties FAQ */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-3xl mx-auto">
          <FAQ items={T.anxieties as unknown as { q: string; a: string }[]} title={T.anxietiesTitle} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="section-title mb-4">{T.ctaTitle}</h2>
          <p className="section-subtitle mb-8">
            {T.ctaSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/booking?plan=first-time-2h" className="btn-primary text-sm">
              {T.btnBook}
            </Link>
            <Link href="/contact" className="btn-secondary text-sm">
              {T.btnConsult}
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
