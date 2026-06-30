export type PlanId = "first-time-2h" | "standard-3h" | "song-package" | "monthly-support"

export interface Plan {
  id: PlanId
  name: string
  shortName: string
  price: string
  priceNote?: string
  duration?: string
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
    description: "初めてのレコーディングでも安心。歌詞と音源を持ってきていただければ、アイデア整理から録音の流れまで一緒に進めます。",
    features: [
      "初回限定価格",
      "歌詞と音源があればOK",
      "アイデア整理サポート",
      "録音の流れを丁寧に案内",
      "完全個室・初心者歓迎",
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
    description: "経験者向けの通常スタジオ利用プラン。",
    features: [
      "3時間のスタジオ利用",
      "エンジニア常駐",
      "データ書き出し込み",
    ],
    cta: "予約する",
    ctaHref: "/booking?plan=standard-3h",
  },
  {
    id: "song-package",
    name: "1曲完成パック",
    shortName: "1曲完成パック",
    price: "¥30,000〜",
    priceNote: "内容により変動",
    description: "録音だけで終わらせず、リリースできる1曲へ。RECからMIXまでまとめてサポートします。",
    features: [
      "3時間レコーディング",
      "ボーカル編集",
      "MIXMASTER",
    ],
    cta: "1曲完成パックを見る",
    ctaHref: "/song-package",
    highlight: true,
    tag: "一番人気",
  },
  {
    id: "monthly-support",
    name: "30日アーティストサポート",
    shortName: "30日サポート",
    price: "¥50,000〜",
    priceNote: "30日",
    description: "曲を作るだけで終わらせず、リリース・発信・次の動きまで一緒に進める30日サポートです。",
    features: [
      "月2回３時間レコーディング込",
      "MIXMASTERING",
      "リリース計画サポート",
      "SNS・活動相談",
      "独自のマネジメントアプリで目標達成を支援",
    ],
    cta: "30日サポートに相談する",
    ctaHref: "/monthly-support",
    tag: "継続して活動したい方へ",
  },
]

export const getPlanById = (id: PlanId): Plan | undefined => PLANS.find((p) => p.id === id)
