"use client"

import Link from "next/link"
import { useLang } from "@/contexts/LanguageContext"
import { INSTAGRAM_URL } from "@/lib/constants"

type PlanCard = {
  label: string
  name: string
  desc: string
  price: string
  priceNote: string | null
  features: string[]
  cta: string
  ctaHref: string
  tag: string | null
}

type GuideCard = { label: string; plan: string; href: string }

type TPage = {
  eyebrow: string
  title: string
  subtitle: string
  btnAvailability: string
  btnInstagram: string
  noteTitle: string
  notes: string[]
  guideEyebrow: string
  guideTitle: string
  guideBody: string
  guideCards: GuideCard[]
  ctaTitle: string
  ctaSubtitle: string
  btnBook: string
  btnConsult: string
}

const plans: Record<"ja" | "en", PlanCard[]> = {
  ja: [
    {
      label: "FIRST SESSION",
      name: "初回レコーディング体験 3時間",
      desc: "初めてスタジオで録音する方へ。\n歌詞と音源をお持ちいただければ、録音の流れから一緒に進めます。",
      price: "¥12,000",
      priceNote: null,
      features: ["初回限定", "3時間レコーディング", "歌詞と音源があればOK", "録音の流れをサポート", "アイデア整理も相談可能"],
      cta: "初回体験を予約する",
      ctaHref: "/booking?plan=first-time-2h",
      tag: null,
    },
    {
      label: "STANDARD REC",
      name: "通常レコーディング 3時間",
      desc: "録りたい内容が決まっている方の通常RECプラン。\nボーカル録音に集中したい方におすすめです。",
      price: "¥15,000",
      priceNote: null,
      features: ["3時間レコーディング", "エンジニア常駐", "データ書き出し込み", "追加REC相談可能"],
      cta: "通常RECを予約する",
      ctaHref: "/booking?plan=standard-3h",
      tag: null,
    },
    {
      label: "SONG PACKAGE",
      name: "1曲完成パック",
      desc: "録音だけで終わらせず、リリースできる1曲へ。\nREC、ボーカル編集、MIX / MASTERINGまでまとめて整えます。",
      price: "¥30,000〜",
      priceNote: "内容により変動します。",
      features: ["3時間レコーディング", "ボーカル編集", "MIX / MASTERING", "修正2回まで"],
      cta: "1曲完成パックを見る",
      ctaHref: "/song-package",
      tag: "For Release",
    },
    {
      label: "MONTHLY SUPPORT",
      name: "30日アーティストサポート",
      desc: "録音、リリース計画、SNS・活動相談まで。\n継続して曲を出したい方のための30日サポートです。",
      price: "¥50,000〜 / 30日",
      priceNote: null,
      features: ["2回の3時間レコーディング", "MIX / MASTERING相談", "リリース計画サポート", "SNS・活動相談"],
      cta: "30日サポートを相談する",
      ctaHref: "/monthly-support",
      tag: null,
    },
  ],
  en: [
    {
      label: "FIRST SESSION",
      name: "First Recording Session 3hrs",
      desc: "For first-time studio visitors.\nBring your lyrics and a backing track — we'll guide you through every step.",
      price: "¥12,000",
      priceNote: null,
      features: ["First-time rate", "3-hour session", "Lyrics + track is all you need", "Step-by-step recording guide", "Idea shaping available"],
      cta: "Book First Session",
      ctaHref: "/booking?plan=first-time-2h",
      tag: null,
    },
    {
      label: "STANDARD REC",
      name: "Standard Recording 3hrs",
      desc: "For those who know what they want to record.\nFocus on your vocal performance.",
      price: "¥15,000",
      priceNote: null,
      features: ["3-hour recording session", "Engineer on-site", "Data export included", "Additional REC available"],
      cta: "Book Standard REC",
      ctaHref: "/booking?plan=standard-3h",
      tag: null,
    },
    {
      label: "SONG PACKAGE",
      name: "Song Package",
      desc: "Beyond recording — to a release-ready track.\nREC, vocal editing, and MIX / MASTERING all in one.",
      price: "¥30,000+",
      priceNote: "Price varies based on scope.",
      features: ["3-hour recording session", "Vocal editing", "MIX / MASTERING", "Up to 2 revisions"],
      cta: "View Song Package",
      ctaHref: "/song-package",
      tag: "For Release",
    },
    {
      label: "MONTHLY SUPPORT",
      name: "30-Day Artist Support",
      desc: "Recording, release planning, SNS & activity support.\nFor artists who want to keep releasing consistently.",
      price: "¥50,000+ / 30 days",
      priceNote: null,
      features: ["2 × 3-hour recording sessions", "MIX / MASTERING consultation", "Release planning", "SNS & activity support"],
      cta: "Enquire About Monthly Support",
      ctaHref: "/monthly-support",
      tag: null,
    },
  ],
}

const page: Record<"ja" | "en", TPage> = {
  ja: {
    eyebrow: "PRICING",
    title: "今の制作に合わせて、選べるプラン。",
    subtitle: "初めての録音から、1曲完成、継続的な活動サポートまで。\n今の状態に合わせて、無理なく選べます。",
    btnAvailability: "空き時間を見る",
    btnInstagram: "Instagramで相談する",
    noteTitle: "ご利用にあたって",
    notes: [
      "料金はすべて税込みです。",
      "1曲完成パックは内容により価格が変動する場合があります。",
      "30日サポートの詳細は事前にご相談ください。",
      "前日18時までのキャンセルは無料です。",
      "当日のキャンセルはキャンセル料50%をいただきます。",
    ],
    guideEyebrow: "GUIDE",
    guideTitle: "迷ったら、今の状態で選んで大丈夫です。",
    guideBody: "まず録音の雰囲気を知りたい方は、初回レコーディング体験。\nリリースやSNS投稿まで考えている方は、1曲完成パック。\n継続して曲を出したい方は、30日アーティストサポートをご相談ください。",
    guideCards: [
      { label: "初めて録るなら", plan: "初回体験", href: "/booking?plan=first-time-2h" },
      { label: "1曲を完成させたいなら", plan: "1曲完成パック", href: "/song-package" },
      { label: "継続して活動したいなら", plan: "30日サポート", href: "/monthly-support" },
    ],
    ctaTitle: "まずは、今の曲の状態から。",
    ctaSubtitle: "完成していないアイデアでも、録りたい曲が1曲あるだけでも大丈夫です。\n今の状態に合わせて、無理なく進められるプランをご案内します。",
    btnBook: "空き時間を見る",
    btnConsult: "Instagramで相談する",
  },
  en: {
    eyebrow: "PRICING",
    title: "Choose the plan that fits where you are.",
    subtitle: "From a first recording to finishing a song to ongoing artist support.\nFind what works for you, at your own pace.",
    btnAvailability: "Check Availability",
    btnInstagram: "Ask on Instagram",
    noteTitle: "Please Note",
    notes: [
      "All prices include tax.",
      "Song Package pricing may vary based on the scope of work.",
      "Please enquire before booking for Monthly Support details.",
      "Cancellations are free up to 6 pm the day before.",
      "Same-day cancellations incur a 50% fee.",
    ],
    guideEyebrow: "GUIDE",
    guideTitle: "Not sure? Choose based on where you're at.",
    guideBody: "If you want to get a feel for the studio — start with the First Session.\nIf you're thinking about a release or a social post — go with the Song Package.\nIf you want to keep releasing consistently — let's talk about Monthly Support.",
    guideCards: [
      { label: "Recording for the first time", plan: "First Session", href: "/booking?plan=first-time-2h" },
      { label: "Want to finish one song", plan: "Song Package", href: "/song-package" },
      { label: "Want to keep releasing", plan: "Monthly Support", href: "/monthly-support" },
    ],
    ctaTitle: "Start from wherever you are.",
    ctaSubtitle: "An unfinished idea or a single song you want to record — that's enough.\nWe'll find the right plan for where you're at.",
    btnBook: "Check Availability",
    btnConsult: "Ask on Instagram",
  },
}

export default function PricingPageContent() {
  const { lang } = useLang()
  const T = page[lang]
  const cards = plans[lang]

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="pt-36 pb-20 px-5 sm:px-8 bg-white text-center">
        <p
          className="text-[#6b9fd4]"
          style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.2rem" }}
        >
          {T.eyebrow}
        </p>
        <h1
          className="text-[#1a2340] font-black"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", letterSpacing: "0.04em", lineHeight: 1.25, marginBottom: "1.5rem" }}
        >
          {T.title}
        </h1>
        <p
          className="text-[#64748b] max-w-lg mx-auto"
          style={{ fontSize: "clamp(0.82rem, 1.2vw, 0.95rem)", lineHeight: 2.1, letterSpacing: "0.03em", whiteSpace: "pre-line", marginBottom: "2.5rem" }}
        >
          {T.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/booking" className="btn-primary text-sm">{T.btnAvailability}</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">{T.btnInstagram}</a>
        </div>
      </section>

      {/* ── Plan Cards ── */}
      <section className="pb-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {cards.map((card) => (
              <div
                key={card.label}
                className="glass-card rounded-2xl flex flex-col"
                style={{ padding: "28px 24px 24px" }}
              >
                {/* Label + tag */}
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-[#6b9fd4]"
                    style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" }}
                  >
                    {card.label}
                  </p>
                  {card.tag && (
                    <span
                      className="text-white"
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        padding: "3px 9px",
                        borderRadius: "9999px",
                        background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)",
                      }}
                    >
                      {card.tag}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3
                  className="text-[#1a2340] font-bold leading-snug mb-3"
                  style={{ fontSize: "clamp(0.88rem, 1vw, 0.98rem)" }}
                >
                  {card.name}
                </h3>

                {/* Description */}
                <p
                  className="text-[#64748b] leading-relaxed mb-5"
                  style={{ fontSize: "12px", whiteSpace: "pre-line" }}
                >
                  {card.desc}
                </p>

                {/* Price */}
                <div className="mb-5">
                  <p className="gradient-text font-black" style={{ fontSize: "clamp(1.35rem, 1.8vw, 1.6rem)" }}>
                    {card.price}
                  </p>
                  {card.priceNote && (
                    <p className="text-[#94a3b8] mt-0.5" style={{ fontSize: "11px" }}>{card.priceNote}</p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-[#e8eef5] mb-5" />

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-[#6b9fd4] flex-shrink-0 font-bold" style={{ lineHeight: "1.5", fontSize: "13px" }}>·</span>
                      <span className="text-[#4a5568] leading-relaxed" style={{ fontSize: "12px" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={card.ctaHref}
                  className="block text-center text-white transition-opacity hover:opacity-80"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    padding: "12px 16px",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)",
                  }}
                >
                  {card.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guide ── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "linear-gradient(155deg, #faf8f5 0%, #f0f5ff 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-[#6b9fd4]"
            style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.2rem" }}
          >
            {T.guideEyebrow}
          </p>
          <h2 className="section-title mb-6">{T.guideTitle}</h2>
          <p
            className="text-[#64748b] text-sm leading-[2.1] mb-10 max-w-xl mx-auto"
            style={{ whiteSpace: "pre-line" }}
          >
            {T.guideBody}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {T.guideCards.map((gc) => (
              <Link
                key={gc.label}
                href={gc.href}
                className="glass-card rounded-2xl p-5 text-left block transition-all hover:-translate-y-0.5"
              >
                <p className="text-[#94a3b8] mb-2 tracking-wide" style={{ fontSize: "11px" }}>{gc.label}</p>
                <p className="text-[#1a2340] font-bold text-sm">{gc.plan}</p>
              </Link>
            ))}
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            {T.btnInstagram}
          </a>
        </div>
      </section>

      {/* ── Notes ── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-8 sm:p-10"
            style={{ background: "linear-gradient(155deg, #f8f9ff 0%, #f4f0ff 100%)", border: "1px solid rgba(107,159,212,0.12)" }}
          >
            <p className="text-[#1a2340] font-bold mb-6" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}>
              {T.noteTitle}
            </p>
            <ul className="space-y-3">
              {T.notes.map((note) => (
                <li key={note} className="flex items-start gap-3 text-sm text-[#64748b]">
                  <span className="text-[#6b9fd4] flex-shrink-0 mt-0.5 font-bold">·</span>
                  <span className="leading-[1.85]">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-24 px-4 sm:px-6 text-center"
        style={{ background: "linear-gradient(155deg, #f8f6ff 0%, #f0f4ff 100%)" }}
      >
        <div className="max-w-xl mx-auto">
          <p
            className="text-[#6b9fd4]"
            style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.2rem" }}
          >
            START
          </p>
          <h2
            className="text-[#1a2340] font-black mb-5"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "0.04em", lineHeight: 1.3 }}
          >
            {T.ctaTitle}
          </h2>
          <p
            className="text-[#64748b] text-sm leading-[2.1] mb-10"
            style={{ whiteSpace: "pre-line" }}
          >
            {T.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/booking" className="btn-primary text-sm">{T.btnBook}</Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">{T.btnConsult}</a>
          </div>
        </div>
      </section>

    </div>
  )
}
