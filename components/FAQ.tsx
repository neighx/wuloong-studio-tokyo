"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DEFAULT_FAQ } from "@/lib/faq-data"

export type { FAQItem } from "@/lib/faq-data"
export { DEFAULT_FAQ } from "@/lib/faq-data"

interface FAQItem {
  q: string
  a: string
}

interface FAQProps {
  items?: FAQItem[]
  title?: string
}

export default function FAQ({ items = DEFAULT_FAQ, title = "よくある質問" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto">
      {title && (
        <h2 className="section-title text-center mb-10">{title}</h2>
      )}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="glass-card rounded-2xl overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-semibold text-[#1a1a2e] text-sm sm:text-base pr-4">{item.q}</span>
              <ChevronDown
                size={18}
                className="text-[#6b9fd4] flex-shrink-0 transition-transform duration-200"
                style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0)" }}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5">
                <p className="text-sm sm:text-base text-[#4a5568] leading-relaxed border-t border-gray-100 pt-4">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
