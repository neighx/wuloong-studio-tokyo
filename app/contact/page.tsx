import type { Metadata } from "next"
import ContactPageContent from "@/components/ContactPageContent"

export const metadata: Metadata = {
  title: "お問い合わせ | Wuloong Studio TOKYO",
  description: "三軒茶屋のプライベートレコーディングスタジオへのお問い合わせ。予約・料金・1曲完成パックなどお気軽にご連絡ください。",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return <ContactPageContent />
}
