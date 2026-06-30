import type { Metadata } from "next"
import SongPackagePageContent from "@/components/SongPackagePageContent"

export const metadata: Metadata = {
  title: "1曲完成パック | Wuloong Studio TOKYO",
  description: "RECからMIXまで。リリースできる1曲をまとめてサポートします。¥30,000〜",
}

export default function SongPackagePage() {
  return <SongPackagePageContent />
}
