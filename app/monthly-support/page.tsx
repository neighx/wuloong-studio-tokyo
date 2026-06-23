import type { Metadata } from "next"
import Link from "next/link"
import CTASection from "@/components/CTASection"
import { INSTAGRAM_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "30日アーティストサポート | Wuloong Studio TOKYO",
  description: "継続して曲を出したい方へ。月額50,000円〜のアーティスト伴走サポート。",
}

const included = [
  { icon: "🎙️", title: "月2回レコーディング", desc: "毎月2回のスタジオセッション込み。定期的に録音を続けられます。" },
  { icon: "🎚️", title: "MIX相談", desc: "仕上がりについて何度でも相談できます。" },
  { icon: "📅", title: "リリース計画", desc: "曲のリリーススケジュールを一緒に設計します。" },
  { icon: "📱", title: "SNS・活動相談", desc: "発信の方向性や、フォロワーへの見せ方も一緒に考えます。" },
  { icon: "🎵", title: "次の曲の方向性相談", desc: "次に何を作るか、どんな曲を出すべきかを一緒に整理します。" },
  { icon: "🎯", title: "目標設計・伴走", desc: "アーティストとしてのビジョンを言語化し、独自の目標アプリを使って日々の具体的な行動に落とし込みます。" },
]

const forWho = [
  "継続して曲を出していきたい",
  "アーティストとして本格的に活動したい",
  "ただ録るだけではなく、方向性を決めたい",
  "1人で進めるのが不安、誰かと一緒に動きたい",
  "リリースから発信まで一気通貫でサポートしてほしい",
]

export default function MonthlySupportPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#e8afc4] text-sm font-semibold mb-3 tracking-wide">MONTHLY SUPPORT</p>
          <h1 className="section-title mb-4">30日アーティストサポート</h1>
          <p className="text-[#e8afc4] text-3xl font-black mb-4">¥50,000〜/30日</p>
          <p className="section-subtitle max-w-xl mx-auto">
            曲を作るだけで終わらせず、リリース・発信・次の動きまで一緒に進める30日サポートです。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Instagramで相談する
            </a>
            <Link href="/contact" className="btn-secondary">
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-12">含まれる内容</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl p-6 bg-gradient-to-br from-[#fde8f4] to-[#fdf5e8] border border-[#e8afc4]/30"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#fdf5e8] to-[#fde8f4]">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-10">こんな方へ</h2>
          <div className="space-y-3">
            {forWho.map((item) => (
              <div key={item} className="glass-card rounded-2xl p-5 flex items-start gap-3">
                <span className="text-[#e8afc4] font-bold flex-shrink-0">✓</span>
                <p className="text-sm text-[#4a5568] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message */}
      <section className="py-16 px-4 sm:px-6 bg-[#1a1a2e] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#e8afc4] text-sm font-semibold mb-6 tracking-wide">Wuloong一同</p>
          <blockquote className="text-xl sm:text-2xl font-bold leading-relaxed mb-8">
            「アーティストとして動き続けることが、一番難しい。<br />
            だから、隣で一緒に考える人が必要だと思っています。」
          </blockquote>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl mx-auto">
            30日サポートは、音楽制作だけでなく、アーティストとしての動き方そのものを一緒に設計するプログラムです。
            まずはInstagramまたはお問い合わせからご相談ください。
          </p>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 text-sm text-[#64748b] space-y-2">
          <p className="font-semibold text-[#1a1a2e] mb-3">料金・契約について</p>
          <p>・ 月額 ¥50,000〜（内容により変動）</p>
          <p>・ 最低契約期間なし。まずは1ヶ月から試していただけます</p>
          <p>・ 詳細はInstagramまたはお問い合わせフォームからご相談ください</p>
          <div className="pt-4 flex flex-wrap gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-sm">
              Instagramで相談する
            </a>
            <Link href="/contact" className="btn-secondary inline-block text-sm">
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="一緒に、アーティスト活動を前に進めよう。"
        subtitle="まずはInstagramやお問い合わせから気軽にご連絡ください。"
      />
    </>
  )
}
