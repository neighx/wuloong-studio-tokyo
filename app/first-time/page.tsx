import type { Metadata } from "next"
import FirstTimePageContent from "@/components/FirstTimePageContent"

export const metadata: Metadata = {
  title: "初めての方へ | Wuloong Studio TOKYO",
  description: "初めてのレコーディングでも安心。当日の流れ、持ち物、よくある不安についてわかりやすく説明します。",
}

export default function FirstTimePage() {
  return <FirstTimePageContent />
}
