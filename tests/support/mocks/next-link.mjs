// テスト用の next/link 代替。href をそのまま持つ <a> を描画する（遷移はしない）。
import { createElement, forwardRef } from "react"

const Link = forwardRef(function Link({ href, children, prefetch, replace, scroll, shallow, ...rest }, ref) {
  const resolved = typeof href === "string" ? href : String(href?.pathname ?? "")
  return createElement("a", { ...rest, ref, href: resolved }, children)
})

export default Link
