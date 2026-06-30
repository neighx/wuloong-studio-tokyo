import type { Metadata } from "next"
import { SEO } from "@/lib/constants"
import HomePageContent from "@/components/HomePageContent"

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: [
    "三軒茶屋 レコーディングスタジオ",
    "世田谷 レコーディングスタジオ",
    "プライベートスタジオ 三軒茶屋",
    "初心者 レコーディング 東京",
    "ボーカル録音 三軒茶屋",
    "HIPHOP スタジオ 東京",
    "R&B 録音スタジオ 東京",
    "女性 レコーディングスタジオ 東京",
    ...SEO.keywords,
  ],
}

export default function HomePage() {
  return <HomePageContent />
}
