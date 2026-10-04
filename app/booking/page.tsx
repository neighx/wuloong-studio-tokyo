import type { Metadata } from "next"
import BookingPageContent from "@/components/BookingPageContent"

// 予約カレンダーが「今日」を基準に表示されるため、ビルド時点の日付が
// 初期HTMLに固定されないよう、このページは常にリクエスト時にレンダリングする
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "予約する | Wuloong Studio TOKYO",
  description: "三軒茶屋のプライベートレコーディングスタジオ。プランと日時を選んで予約を申し込めます。",
  alternates: { canonical: "/booking" },
}

export default function BookingPage() {
  return <BookingPageContent />
}
