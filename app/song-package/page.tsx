import type { Metadata } from "next"
import Link from "next/link"
import CTASection from "@/components/CTASection"

export const metadata: Metadata = {
  title: "1曲完成パック | Wuloong Studio TOKYO",
  description: "RECからMIXまで。リリースできる1曲をまとめてサポートします。¥30,000〜",
}

const included = [
  { icon: "🎙️", title: "レコーディング", desc: "プロの技術で本番録音。" },
  { icon: "✂️", title: "ボーカル編集", desc: "余計なノイズを除去し、ピッチ・タイミングを整えます。" },
  { icon: "🎚️", title: "MIXMASTER", desc: "声をビートに馴染ませるバランス調整を行います。" },
  { icon: "💾", title: "データ書き出し", desc: "WAV/MP3形式で書き出してお渡しします。" },
]

const forWho = [
  "録って終わりではなく、1曲として完成させたい",
  "SpotifyやApple Musicにリリースしたい",
  "自分の曲を作品として残したい",
  "SNSで公開できるクオリティにしたい",
  "初めてのリリースを丁寧にサポートしてほしい",
]

export default function SongPackagePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#9b8ec4] text-sm font-semibold mb-3 tracking-wide">SONG PACKAGE</p>
          <h1 className="section-title mb-4">
            1曲完成パック
          </h1>
          <p className="text-[#9b8ec4] text-3xl font-black mb-4">¥30,000〜</p>
          <p className="section-subtitle max-w-xl mx-auto">
            録音だけで終わらせず、リリースできる1曲へ。<br />
            RECからMIXまでまとめてサポートします。
          </p>
          <div className="mt-8">
            <Link href="/booking?plan=song-package" className="btn-primary">
              1曲完成パックを申し込む
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
                className="rounded-3xl p-6 bg-gradient-to-br from-[#f8f0ff] to-[#fdf0f8] border border-[#9b8ec4]/20"
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
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-10">こんな方におすすめ</h2>
          <div className="space-y-3">
            {forWho.map((item) => (
              <div key={item} className="glass-card rounded-2xl p-5 flex items-start gap-3">
                <span className="text-[#9b8ec4] font-bold flex-shrink-0">✓</span>
                <p className="text-sm text-[#4a5568] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-10">完成までの流れ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: "1", title: "ご相談・予約", desc: "曲の方向性や仕上がりのイメージを事前にすり合わせます。" },
              { num: "2", title: "レコーディング当日", desc: "ブースで録音。その場でボーカルチェックも行います。" },
              { num: "3", title: "MIX・書き出し", desc: "後日または当日、MIXを仕上げてデータをお渡しします。" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #9b8ec4, #6b9fd4)" }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{step.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-10 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 text-sm text-[#64748b] space-y-2">
          <p className="font-semibold text-[#1a1a2e] mb-3">料金について</p>
          <p>・ 基本料金：¥30,000〜</p>
          <p>・ 曲の長さ、録音テイク数、MIXの複雑さにより変動します</p>
          <p>・ 事前にご相談いただくと正確なお見積もりをお出しできます</p>
          <div className="pt-4">
            <Link href="/booking?plan=song-package" className="btn-primary inline-block text-sm">
              申し込む / 相談する
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="まずは相談してみてください。"
        subtitle="どんな曲を作りたいか、気軽に話しかけてください。"
      />
    </>
  )
}
