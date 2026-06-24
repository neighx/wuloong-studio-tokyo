import type { Metadata } from "next"
import Link from "next/link"
import Hero from "@/components/Hero"
import OfferCards from "@/components/OfferCards"
import FAQ from "@/components/FAQ"
import CTASection from "@/components/CTASection"
import BookingCalendar from "@/components/BookingCalendar"
import { INSTAGRAM_URL, LINE_URL, SEO } from "@/lib/constants"

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: [
    "三軒茶屋 レコーディングスタジオ",
    "世田谷 レコーディングスタジオ",
    "プライベートスタジオ 三軒茶屋",
    "初心者 レコーディング 東京",
    "ボーカル録音 三軒茶屋",
    "HIPHOP スタジオ 東京",
    "R&B 録音スタジオ 東京",
    "女性 レコーディングスタジオ 東京",
    ...SEO.keywords,
  ],
}

// ── FAQ data (anxiety-first framing for beginners) ──
const homeFaq = [
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

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero (Ron Herman white editorial) ── */}
      <Hero />

      {/* ── 4. Offer Cards (STEP 01/02/03 with featured 1曲完成) ── */}
      <OfferCards />

      {/* ── 5. First Time Friendly ── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "linear-gradient(155deg, #faf8f5 0%, #f0f5ff 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
                FIRST TIME WELCOME
              </p>
              <h2 className="section-title mb-5">
                歌詞と音源があれば、<br />
                <span className="gradient-text">はじめてでも大丈夫。</span>
              </h2>
              <p className="text-[#64748b] leading-[1.95] mb-8 max-w-sm">
                スタジオに入ったことがなくても安心です。歌詞と音源を持ってきていただければ、曲のイメージや歌いたい雰囲気を一緒に整理しながら、録音の流れに沿って丁寧にサポートします。
              </p>

              <div className="grid grid-cols-1 gap-3 mb-10">
                {[
                  { icon: "📝", text: "歌詞と音源があればOK。曲のイメージがまだ固まっていなくても大丈夫です。" },
                  { icon: "🎙️", text: "録音の進め方を一緒に確認。どこから録るか、何回録るか、どう重ねるかを相談しながら進めます。" },
                  { icon: "💡", text: "アイデア整理もサポート。「こういう雰囲気にしたい」など、言葉にしきれない部分も一緒に形にしていきます。" },
                  { icon: "🔒", text: "完全予約制のプライベート空間。周りを気にせず、自分のペースで録音できます。" },
                  { icon: "👍", text: "初めてでも安心して来られます。分からないことはその場で聞きながら進められます。" },
                ].map((item) => (
                  <div key={item.icon} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <p className="text-sm text-[#4a5568] leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/booking?plan=first-time-2h" className="btn-primary text-sm">
                  初回体験を予約する
                </Link>
                <Link href="/first-time" className="btn-secondary text-sm">
                  初めての方へ詳しく
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {/* Featured first-time card */}
              <div
                className="rounded-3xl p-7"
                style={{ background: "linear-gradient(155deg, #1a1a2e, #0d1535)", border: "1px solid rgba(107,159,212,0.2)" }}
              >
                <div className="text-3xl mb-4">🎙️</div>
                <h3 className="font-bold text-white text-lg mb-2">初回レコーディング体験</h3>
                <p className="text-sm text-white/55 leading-relaxed mb-5">
                  初めてのレコーディングでも安心。歌詞と音源を持ってきていただければ、アイデア整理から録音の流れまで一緒に進めます。
                </p>
                <p className="text-3xl font-black mb-5" style={{ color: "#7eb8e8" }}>¥12,000〜</p>
                <ul className="space-y-2 mb-6">
                  {["3時間コース", "歌詞と音源があればOK", "アイデア整理サポート", "録音の流れを丁寧に案内", "完全個室・初心者歓迎"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/55">
                      <span className="text-[#7eb8e8] font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/booking?plan=first-time-2h"
                  className="block text-center py-3.5 rounded-full font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                >
                  初回体験を予約する
                </Link>
              </div>

              {/* Trust note */}
              <div className="glass-card rounded-2xl p-5 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">💬</span>
                <div>
                  <p className="font-semibold text-[#1a1a2e] text-sm mb-1">まずは相談だけでもOK</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    「こんな曲にしたい」「初めてで何を準備すればいいか分からない」そんな段階でも大丈夫です。Instagram DMまたはLINEから気軽にご相談ください。
                  </p>
                  <div className="flex gap-3 mt-3">
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#6b9fd4] hover:underline">Instagram DM →</a>
                    {LINE_URL && <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#6b9fd4] hover:underline">LINE →</a>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Studio Features ── */}
      <section className="bg-white">
        {/* Header + Specs */}
        <div className="pt-24 pb-14 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">THE STUDIO</p>
              <h2 className="section-title mb-4">集中できる、でも緊張しすぎない空間。</h2>
              <p className="section-subtitle max-w-md mx-auto">
                音楽に向き合える、居心地のいいプライベート空間。
              </p>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: "エリア", value: "三軒茶屋・世田谷" },
                { label: "スタイル", value: "完全予約制" },
                { label: "空間", value: "完全プライベートREC" },
                { label: "サポート", value: "相談しやすいエンジニア常駐" },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-[#94a3b8] mb-1.5">{item.label}</p>
                  <p className="text-sm font-bold text-[#1a1a2e] leading-tight">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-width studio video — Ron Herman Pick Up Movie style */}
        <div className="relative overflow-hidden" style={{ height: "80vh", maxHeight: 800 }}>
          <video
            src="/videos/studio.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* 淡いフィルター */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(240,238,235,0.18)" }}
          />
        </div>

        <div className="pb-24" />
      </section>

      {/* ── 7. Booking Calendar Preview ── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "linear-gradient(155deg, #f8f6ff 0%, #f0f4ff 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">RESERVATION</p>
            <h2 className="section-title mb-3">空き時間を確認して予約</h2>
            <p className="section-subtitle">
              希望の日程を選んで、そのままフォームから申し込めます。
            </p>
          </div>
          <BookingCalendar />
          <div className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/booking" className="btn-primary text-sm">
              予約フォームに進む
            </Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
              日程をInstagramで相談する
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. Sound Direction / Recording Support ── */}
      <section className="py-24 px-4 sm:px-6 bg-[#1a1a2e] text-white relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(155,142,196,0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div className="relative max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* Left: text */}
            <div>
              <p className="text-[#7eb8e8] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
                SOUND DIRECTION / RECORDING SUPPORT
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                どこでライブをするのが夢ですか？
              </h2>
              <div className="space-y-4 text-white/65 leading-[1.95] text-sm sm:text-base">
                <p>大きな夢も、最初は&ldquo;録ってみる&rdquo;ところから始まります。</p>
                <p>レコーディングが初めてでも大丈夫。</p>
                <p>歌詞と音源を持ってきていただければ、録音の流れや表現の整理まで、安心して進められるようサポートします。</p>
                <p>あなたの夢を応援させてください。</p>
              </div>
            </div>

            {/* Right: Spotify playlist */}
            <div
              className="rounded-3xl p-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(100,160,255,0.06)" }}
            >
              <p className="text-[#7eb8e8] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
                RECORDING WORKS
              </p>
              <iframe
                src="https://open.spotify.com/embed/playlist/5X4LimDsATStOPOQoY18oA?utm_source=generator&theme=0&si=806ededdc5d84763"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: "12px" }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 9. 月額サポート相談 CTA ── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(155deg, #f0f5ff 0%, #f8f0ff 100%)",
              border: "1px solid rgba(155,142,196,0.2)",
            }}
          >
            <p className="text-[#9b8ec4] text-[10px] font-bold tracking-[0.45em] uppercase mb-5">ARTIST SUPPORT</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] mb-5 leading-tight">
              活動のこと、<br />
              <span className="gradient-text">まずは気軽に話してみませんか。</span>
            </h2>
            <div className="space-y-4 text-[#64748b] leading-[1.95] mb-8 max-w-md mx-auto text-sm sm:text-base">
              <p>活動を続ける中で出てくる、<br />録音、作品づくり、発信、今後の進め方。</p>
              <p>ひとりで抱えず、今の状況を聞きながら<br />一緒に整えていくための時間です。</p>
              <p>「何から始めればいいかわからない」<br />そんな段階でも大丈夫です。<br />まずは気軽にご相談ください。</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                Instagramで気軽に相談する
              </a>
              <Link href="/monthly-support" className="btn-secondary text-sm">
                30日サポートの詳細を見る
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-5">
              無理な契約や営業はありません。まず話を聞くだけでも大丈夫です。
            </p>
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section className="py-24 px-4 sm:px-6 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#6b9fd4] text-[10px] font-bold tracking-[0.45em] uppercase mb-4">FAQ</p>
            <h2 className="section-title mb-4">よくある質問</h2>
            <p className="section-subtitle">
              初めてスタジオを使う方からよくいただく質問です。
            </p>
          </div>

          <FAQ items={homeFaq} title="" />

          <div className="mt-10 text-center">
            <Link href="/faq" className="btn-secondary text-sm">
              すべてのFAQを見る
            </Link>
          </div>
        </div>
      </section>

      {/* ── 11. Final CTA ── */}
      <CTASection />
    </>
  )
}
