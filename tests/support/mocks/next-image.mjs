// テスト用の next/image 代替。最適化を行わず <img> を描画する。
import { createElement } from "react"

export default function Image({ src, alt, fill, priority, sizes, quality, placeholder, blurDataURL, loader, ...rest }) {
  return createElement("img", { ...rest, src: typeof src === "string" ? src : src?.src, alt })
}
