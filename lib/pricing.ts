export type PlanId = "first-time-2h" | "standard-3h" | "song-package" | "monthly-support"

export interface Plan {
  id: PlanId
  name: string
  shortName: string
  price: string
  priceNote?: string
  duration?: string
  /** セッションの所要時間（時間）。予約APIでの終了時刻計算に使用します。 */
  durationHours: number
  description: string
  features: string[]
  cta: string
  ctaHref: string
  highlight?: boolean
  tag?: string
}

export const PLANS: Plan[] = [
  {
    id: "first-time-2h",
    name: "初回レコーディング体験 3時間",
    shortName: "初回体験 3h",
    price: "¥12,000",
    duration: "3時間",
    durationHours: 3,
    description: "初めてのレコーディングでも安心。歌詞と音源を持ってきていただければ、アイデア整理から録音の流れまで一緒に進めます。",
    features: [
      "初回限定",
      "3時間レコーディング",
      "歌詞と音源があればOK",
      "録音の流れをサポート",
      "アイデア整理も相談可能",
    ],
    cta: "初回体験を予約する",
    ctaHref: "/booking?plan=first-time-2h",
    tag: "初心者におすすめ",
  },
  {
    id: "standard-3h",
    name: "通常レコーディング 3時間",
    shortName: "通常 REC",
    price: "¥15,000",
    duration: "3時間",
    durationHours: 3,
    description: "録りたい内容が決まっている方の通常RECプラン。ボーカル録音に集中したい方向けです。",
    features: [
      "3時間レコーディング",
      "エンジニア常駐",
      "データ書き出し込み",
      "追加REC相談可能",
    ],
    cta: "通常RECを予約する",
    ctaHref: "/booking?plan=standard-3h",
  },
  {
    id: "song-package",
    name: "1曲完成パック",
    shortName: "1曲完成パック",
    price: "¥30,000〜",
    priceNote: "内容により変動します。",
    durationHours: 3,
    description: "録音だけで終わらせず、リリースできる1曲へ。REC、ボーカル編集、MIX / MASTERINGまでまとめて整えます。",
    features: [
      "3時間レコーディング",
      "ボーカル編集",
      "MIX / MASTERING",
      "修正2回まで",
    ],
    cta: "1曲完成パックを見る",
    ctaHref: "/song-package",
    highlight: true,
    tag: "For Release",
  },
  {
    id: "monthly-support",
    name: "30日アーティストサポート",
    shortName: "30日サポート",
    price: "¥50,000〜 / 30日",
    durationHours: 3,
    description: "録音、リリース計画、SNS・活動相談まで。継続して曲を出したい方のための30日サポートです。",
    features: [
      "2回の3時間レコーディング",
      "MIX / MASTERING相談",
      "リリース計画サポート",
      "SNS・活動相談",
    ],
    cta: "30日サポートを相談する",
    ctaHref: "/monthly-support",
    tag: "継続して活動したい方へ",
  },
]

export const getPlanById = (id: PlanId): Plan | undefined => PLANS.find((p) => p.id === id)
