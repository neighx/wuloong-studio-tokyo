import type { Metadata } from "next"
import Link from "next/link"
import FAQ from "@/components/FAQ"
import CTASection from "@/components/CTASection"
import type { FAQItem } from "@/lib/faq-data"

export const metadata: Metadata = {
  title: "よくある質問 | Wuloong Studio TOKYO",
  description: "三軒茶屋のレコーディングスタジオに関するよくある質問。初回利用・料金・MIX・持ち物など。",
}

const allFaq: FAQItem[] = [
  {
    q: "スタジオに入ったことがなくても大丈夫ですか？",
    a: "初めてレコーディングをされる方にも安心してご利用いただけるよう、プロのサウンドエンジニアが進行や録り方も含めて丁寧にサポートしています。「うまくできるか不安」という方も、リラックスして録音できるようお手伝いしますので、完全にあなたの味方です。どうぞ安心してお越しください。",
  },
  {
    q: "女性1人でも安心して利用できますか？",
    a: "はい、完全予約制のプライベート空間なので、見知らぬ方と空間を共有することはありません。多くの女性アーティストの方にご利用いただいています。",
  },
  {
    q: "初回体験の3時間で何ができますか？",
    a: "楽曲の長さや内容、録り直しの回数によって異なりますが、1曲をしっかり録音したい方にちょうどよい目安としてご利用いただくことが多いです。初めての方や、じっくり確認しながら進めたい方には3時間もおすすめです。ご希望の内容に応じて進め方も調整できますので、事前にお気軽にご相談ください。",
  },
  {
    q: "MIXもお願いできますか？",
    a: "はい。録音だけでなく、ボーカル編集やMIX込みの1曲完成パックもあります。リリースまでまとめてサポートします。",
  },
  {
    q: "当日予約はできますか？",
    a: "空きがあれば可能です。予約カレンダーまたはInstagramからご確認ください。",
  },
  {
    q: "料金はどのように支払いますか？",
    a: "当日現金払い、各種カード払いも対応しております。詳細はご予約確定後にご案内します。",
  },
  {
    q: "キャンセルはできますか？",
    a: "大変申し訳ないのですが、エンジニアのスケジュール対応の都合上、キャンセルは前日の18時までとさせていただいております。当日のキャンセルにつきましては、キャンセル料5,000円をお願いしております。心苦しいのですが、ご理解のほどよろしくお願いいたします。クレジットカードで前払いの場合は5,000円を差し引いてからお振込対応いたしますのでよろしくお願いいたします。",
  },
  {
    q: "録音した音源のデータはもらえますか？",
    a: "はい、録音データはWAV形式でお渡しします。MIX・マスタリングまで含むプランでは、完成した音源をご提供します。",
  },
  {
    q: "持ち物は何が必要ですか？",
    a: "歌詞と録音したい楽曲のオケ音源をお持ちいただければ大丈夫です。参考音源などがある場合は、あわせてご用意いただくとスムーズです。事前にご不安な点があれば、必要なものについて個別にご案内も可能です。",
  },
]

export default function FAQPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">FAQ</p>
          <h1 className="section-title mb-4">よくある質問</h1>
          <p className="section-subtitle">
            ご不明な点があればお気軽にInstagramまたはお問い合わせからご連絡ください。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <FAQ items={allFaq} title="" />
          <div className="mt-12 glass-card rounded-3xl p-6 text-center">
            <p className="text-[#4a5568] mb-4">お探しの答えが見つからない場合</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary text-sm">
                お問い合わせ
              </Link>
              <Link href="/booking" className="btn-secondary text-sm">
                まず予約してみる
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
