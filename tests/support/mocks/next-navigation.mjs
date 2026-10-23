// テスト用の next/navigation 代替。
// useSearchParams は globalThis.__TEST_SEARCH__（"plan=...&date=..." 形式）を返す。
export function useSearchParams() {
  return new URLSearchParams(globalThis.__TEST_SEARCH__ ?? "")
}

export function useRouter() {
  return { push() {}, replace() {}, refresh() {}, back() {}, forward() {}, prefetch() {} }
}

export function usePathname() {
  return "/"
}
