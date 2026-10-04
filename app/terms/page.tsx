import type { Metadata } from "next"
import TermsPageContent from "@/components/TermsPageContent"

export const metadata: Metadata = {
  title: "利用規約 | Wuloong Studio TOKYO",
  description: "Wuloong Studio TOKYOの利用規約。キャンセルポリシー・支払い・禁止事項など。",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return <TermsPageContent />
}
