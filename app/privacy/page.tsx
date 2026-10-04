import type { Metadata } from "next"
import PrivacyPageContent from "@/components/PrivacyPageContent"

export const metadata: Metadata = {
  title: "プライバシーポリシー | Wuloong Studio TOKYO",
  description: "Wuloong Studio TOKYOのプライバシーポリシー。取得する情報、利用目的、外部サービスの利用について。",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return <PrivacyPageContent />
}
