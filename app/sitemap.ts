import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"

// 公開ページのみを対象にする。/booking の date/time 付きURLや /ig、API、
// 予約完了専用URLなどはクロール対象として意味がないため含めない。
const PUBLIC_PATHS = [
  "",
  "/first-time",
  "/pricing",
  "/song-package",
  "/monthly-support",
  "/booking",
  "/access",
  "/faq",
  "/terms",
  "/privacy",
  "/contact",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }))
}
