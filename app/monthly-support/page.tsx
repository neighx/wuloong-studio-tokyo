import type { Metadata } from "next"
import MonthlySupportPageContent from "@/components/MonthlySupportPageContent"

export const metadata: Metadata = {
  title: "30日アーティストサポート | Wuloong Studio TOKYO",
  description: "継続して曲を出したい方へ。月額50,000円〜のアーティスト伴走サポート。",
}

export default function MonthlySupportPage() {
  return <MonthlySupportPageContent />
}
