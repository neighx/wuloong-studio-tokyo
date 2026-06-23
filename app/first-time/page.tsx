import type { Metadata } from "next"
import Link from "next/link"
import CTASection from "@/components/CTASection"
import FAQ from "@/components/FAQ"
import type { FAQItem } from "@/lib/faq-data"

export const metadata: Metadata = {
  title: "初めての方へ | Wuloong Studio TOKYO",
  description: "初めてのレコーディングでも安心。当日の流れ、持ち物、よくある不安についてわかりやすく説明します。",
}

const steps = [
  { num: "01", title: "予約", desc: "予約ページから希望日・プランを選んで申し込む。確認メールまたはDMでご連絡します。" },
  { num: "02", title: "来店", desc: "予約確定後に住所をご案内します。三軒茶屋エリアの落ち着いた場所にあります。" },
  { num: "03", title: "曲の確認", desc: "どんな曲を録りたいか、参考曲や歌詞などを確認します。リラックスしてお話しください。" },
  { num: "04", title: "録音準備", desc: "マイクのセッティング、モニター音量の調整など、録音しやすい環境を整えます。" },
  { num: "05", title: "レコーディング", desc: "実際に録音します。何度でも撮り直しOK。自分のペースで進められます。" },
  { num: "06", title: "簡単な確認", desc: "録れた音源を一緒に確認します。気になる箇所があれば追加で録音できます。" },
  { num: "07", title: "書き出し / 次の提案", desc: "データを書き出してお渡しします。MIXや次のセッションについてご相談することもできます。" },
]

const items = [
  { icon: "📝", label: "必須", text: "歌詞（印刷またはスマホ）" },
  { icon: "🎵", label: "あると◎", text: "ビート音源（YouTube URLやファイルでOK）" },
  { icon: "🎧", label: "あると◎", text: "参考にしたいアーティストや曲名" },
  { icon: "📱", label: "OK", text: "スマホのデモ音源" },
  { icon: "👕", label: "推奨", text: "動きやすい服装（マイクに当たらないように）" },
]

const anxieties: FAQItem[] = [
  {
    q: "音程がズレても大丈夫ですか？",
    a: "大丈夫です。プロでも何度も撮り直しします。完璧な一発録りは求めていません。",
  },
  {
    q: "上手く歌えるか不安です",
    a: "スタジオの雰囲気に慣れるまで少し時間をもらえれば大丈夫です。焦らずゆっくり進めましょう。",
  },
  {
    q: "機材のことがわかりません",
    a: "知識がなくても大丈夫です。こちらで全て設定します。歌詞と声さえ持ってきてください。",
  },
  {
    q: "予算が少なくて不安です",
    a: "初回体験は3時間12,000円から。まずは体験してみて、続けるかどうか考えていただいて大丈夫です。",
  },
]

export default function FirstTimePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">FIRST TIME</p>
          <h1 className="section-title mb-4">
            歌詞と音源があれば、<br />
            <span className="gradient-text">はじめてでも大丈夫。</span>
          </h1>
          <p className="section-subtitle max-w-xl mx-auto">
            スタジオに入ったことがなくても安心です。歌詞と音源を持ってきていただければ、曲のイメージや歌いたい雰囲気を一緒に整理しながら、録音の流れに沿って丁寧にサポートします。
          </p>
        </div>
      </section>

      {/* Safety points */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "📝", title: "歌詞と音源があればOK", desc: "曲のイメージがまだ固まっていなくても大丈夫です。持ってきていただけた素材をもとに一緒に整理します。" },
              { icon: "🎙️", title: "録音の進め方を一緒に確認", desc: "どこから録るか、何回録るか、どう重ねるかを相談しながら進めます。分からないことはその場で聞けます。" },
              { icon: "💡", title: "アイデア整理もサポート", desc: "「こういう雰囲気にしたい」「この曲みたいにしたい」など、言葉にしきれない部分も一緒に形にしていきます。" },
              { icon: "🔒", title: "完全予約制のプライベート空間", desc: "周りを気にせず、自分のペースで録音できます。知らない人と空間を共有しません。" },
              { icon: "👍", title: "初めてでも安心して来られます", desc: "分からないことはその場で聞きながら進められます。焦る必要はありません。" },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-12">当日の流れ</h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    {step.num}
                  </div>
                  {i < steps.length - 1 && (
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

      {/* Checklist */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title text-center mb-8">持ち物リスト</h2>
          <div className="space-y-3">
            {items.map((item) => (
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
        </div>
      </section>

      {/* Anxieties FAQ */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#f8f6ff] to-[#f0f4ff]">
        <div className="max-w-3xl mx-auto">
          <FAQ items={anxieties} title="よくある不安" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="section-title mb-4">まずは1曲録ってみよう。</h2>
          <p className="section-subtitle mb-8">
            初回体験は3時間12,000円から。準備ゼロでも大丈夫です。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/booking?plan=first-time-2h" className="btn-primary text-sm">
              初回体験を予約する
            </Link>
            <Link href="/contact" className="btn-secondary text-sm">
              まずは相談する
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
