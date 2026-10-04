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
  return (
    <div className="max-w-3xl mx-auto">
      {title && (
        <h2 className="section-title text-center mb-10">{title}</h2>
      )}
      <div className="space-y-3">
        {items.map((item, i) => (
          // <details>/<summary> を使うことで、開閉前から質問・回答の本文が
          // サーバーから返るHTMLに含まれる（JavaScript無しでも読める）
          <details
            key={i}
            className="group glass-card rounded-2xl overflow-hidden transition-all duration-200"
          >
            <summary
              className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6b9fd4] focus-visible:outline-offset-2"
            >
              <span className="font-semibold text-[#1a1a2e] text-sm sm:text-base pr-4">{item.q}</span>
              <ChevronDown
                size={18}
                className="text-[#6b9fd4] flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <div className="px-5 pb-5">
              <p className="text-sm sm:text-base text-[#4a5568] leading-relaxed border-t border-gray-100 pt-4">
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
