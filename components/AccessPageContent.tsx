"use client"

import Link from "next/link"
import Image from "next/image"
import CTASection from "@/components/CTASection"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

const HAS_MAP_IMAGE = true

export default function AccessPageContent() {
  const { lang } = useLang()
  const T = t[lang].accessPage

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">{T.eyebrow}</p>
          <h1 className="section-title mb-4">{T.title}</h1>
          <p className="section-subtitle max-w-xl mx-auto">
            {T.subtitle}
          </p>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* 地図エリア */}
          <div className="w-full rounded-3xl overflow-hidden aspect-video relative mb-10" aria-label={T.mapArea}>
            {HAS_MAP_IMAGE ? (
              /* 地図画像 (scripts/copy-media.sh でコピー後) */
              <Image
                src="/images/map/map.png"
                alt="Wuloong Studio TOKYO Map"
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
                  <p className="text-[#64748b] text-sm">{T.mapArea}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">{T.mapNote}</p>
                </div>
              </div>
            )}
          </div>

          {/* Access info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-bold text-[#1a1a2e] mb-4">{T.locationTitle}</h3>
              <div className="space-y-3 text-sm text-[#4a5568]">
                <div className="flex items-start gap-3">
                  <span className="text-[#6b9fd4] flex-shrink-0">📍</span>
                  <div>
                    <p className="font-medium">{T.areaLabel}</p>
                    <p className="text-[#64748b]">{T.areaValue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#6b9fd4] flex-shrink-0">🚃</span>
                  <div>
                    <p className="font-medium">{T.stationLabel}</p>
                    <p className="text-[#64748b]">{T.stationValue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#6b9fd4] flex-shrink-0">🔒</span>
                  <div>
                    <p className="font-medium">{T.addressLabel}</p>
                    <p className="text-[#64748b]">{T.addressValue}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-bold text-[#1a1a2e] mb-4">{T.flowTitle}</h3>
              <div className="space-y-3 text-sm text-[#4a5568]">
                {T.flowSteps.map((step, idx) => (
                  <div key={step} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold"
                      style={{ background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" }}
                    >
                      {idx + 1}
                    </span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/booking" className="btn-primary inline-block text-sm mr-3">
              {T.btnBook}
            </Link>
            <Link href="/contact" className="btn-secondary inline-block text-sm">
              {T.btnContact}
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
