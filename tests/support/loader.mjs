// Node のモジュール読み込みフック（テスト専用）。
// - "@/..." の別名と、拡張子なしの .ts/.tsx を解決する
// - .ts/.tsx は既存の devDependency の typescript で JS に変換する（型チェックは tsc で別途行う）
// - Next.js のランタイムが無いと動かない next/link・next/image・next/navigation だけを
//   tests/support/mocks の最小実装に差し替える（予約フォーム・カレンダー本体は実物を使う）
import { readFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const ROOT = new URL("../../", import.meta.url)
const MOCKS = {
  "next/link": "./mocks/next-link.mjs",
  "next/image": "./mocks/next-image.mjs",
  "next/navigation": "./mocks/next-navigation.mjs",
}

export async function resolve(specifier, context, nextResolve) {
  if (MOCKS[specifier]) return { url: new URL(MOCKS[specifier], import.meta.url).href, shortCircuit: true }
  let spec = specifier
  if (spec.startsWith("@/")) spec = new URL(spec.slice(2), ROOT).href
  if ((spec.startsWith("file:") || spec.startsWith(".")) && !/\.[cm]?[jt]sx?$/.test(spec)) {
    const base = new URL(spec, context.parentURL)
    for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
      if (existsSync(fileURLToPath(base) + ext)) return { url: base.href + ext, shortCircuit: true }
    }
  }
  return nextResolve(spec, context)
}

export async function load(url, context, nextLoad) {
  if (url.startsWith("file:") && /\.tsx?$/.test(new URL(url).pathname)) {
    const fileName = fileURLToPath(url)
    const { outputText } = ts.transpileModule(readFileSync(fileName, "utf8"), {
      fileName,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        isolatedModules: true,
      },
    })
    return { format: "module", source: outputText, shortCircuit: true }
  }
  return nextLoad(url, context)
}
