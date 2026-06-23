import type { Metadata } from "next"
import Link from "next/link"
import PricingCards from "@/components/PricingCards"
import CTASection from "@/components/CTASection"

export const metadata: Metadata = {
  title: "料金 | Wuloong Studio TOKYO",
  description: "三軒茶屋のプライベートレコーディングスタジオ料金。初回体験から1曲完成パック、30日アーティストサポートまで。",
}

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">PRICING</p>
          <h1 className="section-title mb-4">料金プラン</h1>
          <p className="section-subtitle">
            初めての録音から、継続的なアーティスト活動まで。<br />
            あなたのペースに合ったプランを選べます。
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <PricingCards />
        </div>
      </section>

      {/* Note */}
      <section className="py-10 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-6 text-sm text-[#64748b] space-y-2">
            <p className="font-semibold text-[#1a1a2e] mb-3">ご利用にあたって</p>
            <p>・ 料金はすべて税込みです</p>
            <p>・ 1曲完成パックは内容により価格が変動する場合があります</p>
            <p>・ 30日サポートの詳細はお問い合わせください</p>
            <p>・ キャンセルポリシー：前日までのキャンセルは無料。当日キャンセルは料金の50%をいただく場合があります</p>
          </div>
          <div className="mt-8 text-center">
            <Link href="/booking" className="btn-primary inline-block text-sm">
              予約する
            </Link>
            <Link href="/contact" className="btn-secondary inline-block text-sm ml-3">
              料金について相談する
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="まずは初回体験から。"
        subtitle="初めての録音でも大丈夫。エンジニアが丁寧にサポートします。"
      />
    </>
  )
}
