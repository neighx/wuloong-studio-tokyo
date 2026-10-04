import type { Metadata } from "next"
import { SEO } from "@/lib/constants"
import HomePageContent from "@/components/HomePageContent"

// 予約カレンダーが「今日」を基準に表示されるため、ビルド時点の日付が
// 初期HTMLに固定されないよう、このページは常にリクエスト時にレンダリングする
export const dynamic = "force-dynamic"

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
