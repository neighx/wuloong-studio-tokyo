import type { Metadata } from "next"
import AccessPageContent from "@/components/AccessPageContent"

export const metadata: Metadata = {
  title: "アクセス | Wuloong Studio TOKYO",
  description: "三軒茶屋・世田谷エリアの完全予約制プライベートレコーディングスタジオ。詳しい住所はご予約確定後にご案内します。",
}

export default function AccessPage() {
  return <AccessPageContent />
}
