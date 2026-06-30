import type { Metadata } from "next"
import FAQPageContent from "@/components/FAQPageContent"

export const metadata: Metadata = {
  title: "よくある質問 | Wuloong Studio TOKYO",
  description: "三軒茶屋のレコーディングスタジオに関するよくある質問。初回利用・料金・MIX・持ち物など。",
}

export default function FAQPage() {
  return <FAQPageContent />
}
