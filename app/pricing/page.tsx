import type { Metadata } from "next"
import PricingPageContent from "@/components/PricingPageContent"

export const metadata: Metadata = {
  title: "料金 | Wuloong Studio TOKYO",
  description: "三軒茶屋のプライベートレコーディングスタジオ料金。初回体験から1曲完成パック、30日アーティストサポートまで。",
}

export default function PricingPage() {
  return <PricingPageContent />
}
