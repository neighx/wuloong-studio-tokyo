import type { Metadata } from "next"
import FirstTimePageContent from "@/components/FirstTimePageContent"

export const metadata: Metadata = {
  title: "初めてのレコーディング｜三軒茶屋・3時間12,000円｜Wuloong Studio TOKYO",
  description: "三軒茶屋のレコーディングスタジオ。初回3時間12,000円（税込）。歌詞はあればお持ちください、なくてもご相談可能です。当日の流れ・持ち物・よくある不安をご案内します。",
  alternates: { canonical: "/first-time" },
}

export default function FirstTimePage() {
  return <FirstTimePageContent />
}
