import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import CTASection from "@/components/CTASection"

const HAS_MAP_IMAGE = true

export const metadata: Metadata = {
  title: "アクセス | Wuloong Studio TOKYO",
  description: "三軒茶屋・世田谷エリアの完全予約制プライベートレコーディングスタジオ。詳しい住所はご予約確定後にご案内します。",
}

export default function AccessPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">ACCESS</p>
          <h1 className="section-title mb-4">アクセス</h1>
          <p className="section-subtitle max-w-xl mx-auto">
            三軒茶屋エリアの完全予約制プライベートスタジオです。
            詳しい住所はご予約確定後にご案内します。
          </p>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* 地図エリア */}
          <div className="w-full rounded-3xl overflow-hidden aspect-video relative mb-10" aria-label="地図エリア">
            {HAS_MAP_IMAGE ? (
              /* 地図画像 (scripts/copy-media.sh でコピー後) */
              <Image
                src="/images/map/map.png"
                alt="Wuloong Studio TOKYO 地図"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 896px"
              />
            ) : (
              /* Google Maps iframe (埋め込みURLが入ったら下をアンコメント) */
              /* <iframe
                src="https://www.google.com/maps/embed?pb=..."
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              /> */
              <div className="w-full h-full bg-gradient-to-br from-[#e8f0f8] to-[#f0ecf8] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📍</div>
                  <p className="text-[#64748b] text-sm">三軒茶屋エリア</p>
                  <p className="text-xs text-[#94a3b8] mt-1">地図はご予約確定後にご案内します</p>
                </div>
              </div>
            )}
          </div>

          {/* Access info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-bold text-[#1a1a2e] mb-4">場所について</h3>
              <div className="space-y-3 text-sm text-[#4a5568]">
                <div className="flex items-start gap-3">
                  <span className="text-[#6b9fd4] flex-shrink-0">📍</span>
                  <div>
                    <p className="font-medium">エリア</p>
                    <p className="text-[#64748b]">三軒茶屋・世田谷（東京都）</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#6b9fd4] flex-shrink-0">🚃</span>
                  <div>
                    <p className="font-medium">最寄り駅</p>
                    <p className="text-[#64748b]">三軒茶屋駅（田園都市線）徒歩圏内</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#6b9fd4] flex-shrink-0">🔒</span>
                  <div>
                    <p className="font-medium">住所の案内</p>
                    <p className="text-[#64748b]">ご予約確定後にメールまたはInstagram DMでお知らせします</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-bold text-[#1a1a2e] mb-4">ご利用の流れ</h3>
              <div className="space-y-3 text-sm text-[#4a5568]">
                <div className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    1
                  </span>
                  <p>予約フォームから申し込む</p>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    2
                  </span>
                  <p>確認メールまたはDMでご連絡</p>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    3
                  </span>
                  <p>詳しい住所・当日の案内をお送りします</p>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold"
                    style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                  >
                    4
                  </span>
                  <p>当日はお気軽にお越しください</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/booking" className="btn-primary inline-block text-sm mr-3">
              予約する
            </Link>
            <Link href="/contact" className="btn-secondary inline-block text-sm">
              場所について問い合わせる
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
