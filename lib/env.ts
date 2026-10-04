/**
 * 実行環境の判定。
 *
 * Vercelは VERCEL_ENV を "production" | "preview" | "development" として
 * プラットフォーム側から自動的に注入する（開発者が.envで書き換えても
 * 実際のデプロイには影響しない）。これを「本当に本番か」の判定に使うことで、
 * ".env.localの認証情報を空にする" といった運用ミスに依存せず、
 * Preview/ローカルから本番の予約カレンダー・メールへ書き込まれることを防ぐ。
 */
export type RuntimeTarget = "production" | "preview" | "development"

export function getRuntimeTarget(): RuntimeTarget {
  const v = process.env.VERCEL_ENV
  if (v === "production" || v === "preview" || v === "development") return v
  // Vercel以外（ローカルの `next dev` / `next start` など）は常に development 扱い
  return "development"
}

export function isLiveProductionTarget(): boolean {
  return getRuntimeTarget() === "production"
}

export function isTestIntegrationAllowed(): boolean {
  const v = process.env.ALLOW_TEST_INTEGRATION
  return v === "1" || v?.toLowerCase() === "true"
}
