/**
 * 予約・お問い合わせAPIの送信回数制限（固定ウィンドウ方式・プロセス内メモリ）。
 *
 * 【2種類の制限】
 * - 送信元IPの受付制限（checkRateLimit）：上限を超えたリクエストは429で拒否する。
 * - 宛先ごとの確認メール送信枠（reserveConfirmationEmailQuota）：確認メールを送る直前に
 *   1通分を確保する。枠が無い場合は確認メールだけを省略し、予約そのものは拒否しない
 *   （第三者が他人のアドレスを指定して、その人の予約を止められないようにするため）。
 * どちらも「すべてのルールが上限未満のときだけ全カウンターを1つ進める」方式で、
 * 拒否されたリクエストはカウンターを増やさない。
 *
 * 【保存先と制約（運用上受け入れている制約）】
 * カウンターはこのモジュールのプロセス内メモリ（Map）だけに保存する。外部ストレージは使わない。
 * - Vercel等で複数インスタンスが並行稼働すると、カウンターはインスタンスごとに別々になる
 *   （実際の上限は「上限 × 同時に動いているインスタンス数」まで緩む）。
 * - 再起動・新しいデプロイ・コールドスタートでカウンターは0に戻る。
 * そのため、これは悪用の規模を抑えるための対策であり、厳密な上限保証ではない。
 * 制限で拒否された件数はサーバーログ（[rate-limit]）に残るので、問題が出たらそれを確認する。
 *
 * 【送信元IP】
 * Vercel上（VERCEL=1）では、Vercelのエッジが付与する x-vercel-forwarded-for
 * （無ければ x-real-ip）を使う。Vercelはクライアントが送ったこれらのヘッダーを上書きし
 * 外部の値を転送しない。IPv6は同じ/64を1つの利用者として扱う（1契約に/64が割り当てられるため）。
 * Vercel以外の環境ではヘッダーを信頼せず、全リクエストを同じ "untrusted" として数える。
 *
 * IPやメールアドレスは正規化・SHA-256でハッシュ化してからキーにする（メモリ上にも生の値を残さない）。
 */
import { createHash } from "node:crypto"
import { isIPv4, isIPv6 } from "node:net"

export interface RateLimitRule {
  /** キーの名前空間（例: "booking:ip:10m"） */
  scope: string
  /** 対象を識別する値（正規化済みのIP・メールアドレス）。ハッシュ化して使う */
  identifier: string
  limit: number
  windowSeconds: number
}

export interface RateLimitResult {
  limited: boolean
  /** 制限された場合、次に送信できるまでの秒数 */
  retryAfterSeconds: number
}

// ── 送信元IP ──────────────────────────────────────────────

/**
 * IPアドレスを回数制限用のキーに正規化する。
 * - IPv4: "v4:a.b.c.d"（Node の isIPv4 で先頭ゼロ等の曖昧な表記は拒否される）
 * - IPv4射影IPv6（::ffff:a.b.c.d）: 対応するIPv4と同じキー
 * - IPv6: 省略表記・大文字小文字を展開し、先頭64ビットのみ "v6:xxxx:xxxx:xxxx:xxxx::/64"
 * - 解析できない値: すべて共通の "invalid"
 */
export function normalizeIpForRateLimit(raw: string): string {
  let ip = raw.trim()
  if (ip.startsWith("[") && ip.endsWith("]")) ip = ip.slice(1, -1)
  const zoneIndex = ip.indexOf("%")
  if (zoneIndex !== -1) ip = ip.slice(0, zoneIndex)

  if (isIPv4(ip)) return `v4:${ip}`
  if (!isIPv6(ip)) return "invalid"

  const h = expandIPv6(ip)
  if (h.slice(0, 5).every((x) => x === 0) && h[5] === 0xffff) {
    return `v4:${h[6] >> 8}.${h[6] & 0xff}.${h[7] >> 8}.${h[7] & 0xff}`
  }
  return `v6:${h.slice(0, 4).map((x) => x.toString(16)).join(":")}::/64`
}

/** 検証済みのIPv6表記を8つの16ビット値に展開する（"::" と末尾のIPv4表記に対応）。 */
function expandIPv6(ip: string): number[] {
  let embeddedV4: [number, number] | null = null
  const lastColon = ip.lastIndexOf(":")
  if (ip.slice(lastColon + 1).includes(".")) {
    const o = ip.slice(lastColon + 1).split(".").map(Number)
    embeddedV4 = [(o[0] << 8) | o[1], (o[2] << 8) | o[3]]
    ip = `${ip.slice(0, lastColon + 1)}0:0`
  }
  const [headStr, tailStr] = ip.includes("::") ? ip.split("::") : [ip, null]
  const head = headStr ? headStr.split(":") : []
  const tail = tailStr ? tailStr.split(":") : []
  const fill = tailStr === null ? 0 : 8 - head.length - tail.length
  const hextets = [...head, ...Array<string>(fill).fill("0"), ...tail].map((x) => parseInt(x, 16))
  if (embeddedV4) [hextets[6], hextets[7]] = embeddedV4
  return hextets
}

/** 送信元IPを、偽装できないヘッダーからのみ取得し、回数制限用に正規化する（上記コメント参照）。 */
export function getClientIp(headers: Headers): string {
  if (process.env.VERCEL !== "1") return "untrusted"
  const raw = (headers.get("x-vercel-forwarded-for") ?? headers.get("x-real-ip") ?? "").split(",")[0].trim()
  return raw ? normalizeIpForRateLimit(raw) : "unknown"
}

// ── メールアドレス ─────────────────────────────────────────

// 提供元の公式資料で「同じ受信箱に届く」と確認できたドメインのみを対象にする。
// Gmail（個人向け）: ドットの有無は区別されない／"+任意の文字" の別名は同じ受信箱に届く／
// @googlemail.com は @gmail.com と同じ。Google Workspace等の独自ドメインには適用しない
// （Workspaceではドットが区別されるなど規則が異なり、外部から判別できないため）。
const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"])

/**
 * 回数制限のキー用にメールアドレスを正規化する（実際の送信先アドレスは変更しない）。
 * 許可リストのドメイン以外は、小文字化と前後空白の除去のみ行う。
 */
export function normalizeEmailForRateLimit(email: string): string {
  const lower = email.trim().toLowerCase()
  const at = lower.lastIndexOf("@")
  if (at <= 0) return lower
  let local = lower.slice(0, at)
  const domain = lower.slice(at + 1)
  if (GMAIL_DOMAINS.has(domain)) {
    const plus = local.indexOf("+")
    if (plus !== -1) local = local.slice(0, plus)
    return `${local.replace(/\./g, "")}@gmail.com`
  }
  return lower
}

function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32)
}

// ── カウンター本体（プロセス内メモリ） ───────────────────────
// キー数に上限を設け、期限切れの掃除は一定間隔でだけ行う（リクエストごとに全件を走査しない）。
// 上限に達しても既存のカウンターは捨てない。新しい識別子はルールごとの共通枠
// （overflow）にまとめて数えるため、メモリを埋めても制限は緩まず、むしろ厳しくなる。
export const MEMORY_MAX_KEYS = 10_000
const MEMORY_PRUNE_INTERVAL_MS = 60_000
const counters = new Map<string, { count: number; expiresAt: number }>()
let lastPrune = 0

interface CounterKey {
  key: string
  scope: string
  windowIndex: number
  limit: number
  /** このウィンドウの残り秒数（有効期限・Retry-Afterに使う） */
  remainingSeconds: number
}

function buildKeys(rules: RateLimitRule[], now: number): CounterKey[] {
  return rules.map((r) => {
    const windowMs = r.windowSeconds * 1000
    const windowIndex = Math.floor(now / windowMs)
    return {
      key: `rl:${r.scope}:${hashIdentifier(r.identifier)}:${windowIndex}`,
      scope: r.scope,
      windowIndex,
      limit: r.limit,
      remainingSeconds: Math.ceil((windowMs - (now % windowMs)) / 1000),
    }
  })
}

function prune(now: number): void {
  lastPrune = now
  for (const [k, v] of counters) if (v.expiresAt <= now) counters.delete(k)
}

function resolveKey(k: CounterKey): string {
  // 期限切れでも残っているキーはそのまま再利用する（掃除は reserve の定期処理のみ）
  if (counters.has(k.key) || counters.size < MEMORY_MAX_KEYS) return k.key
  return `rl:${k.scope}:overflow:${k.windowIndex}`
}

/**
 * すべてのルールが上限未満なら全カウンターを1つ進めて許可し、1つでも上限なら何も進めずに拒否する。
 * 同期処理のため、同一プロセス内では確認から加算までの間に他の処理は割り込まない。
 */
function reserve(rules: RateLimitRule[], now: number): RateLimitResult {
  if (now - lastPrune >= MEMORY_PRUNE_INTERVAL_MS) prune(now)
  const keys = buildKeys(rules, now)
  const memKeys = keys.map(resolveKey)
  const current = memKeys.map((mk) => {
    const e = counters.get(mk)
    return e && e.expiresAt > now ? e.count : 0
  })
  const exceeded = keys.filter((k, i) => current[i] >= k.limit)
  if (exceeded.length > 0) {
    return { limited: true, retryAfterSeconds: Math.max(1, ...exceeded.map((k) => k.remainingSeconds)) }
  }
  memKeys.forEach((mk, i) => {
    const e = counters.get(mk)
    const live = e && e.expiresAt > now
    counters.set(mk, { count: live ? e.count + 1 : 1, expiresAt: live ? e.expiresAt : now + keys[i].remainingSeconds * 1000 })
  })
  return { limited: false, retryAfterSeconds: 0 }
}

/** 現在のメモリ内キー数（検証用） */
export function memoryCounterSize(): number {
  return counters.size
}

// ── 公開API ──────────────────────────────────────────────

/** 送信元IPの受付制限。limited の場合は呼び出し側で429を返す。 */
export function checkRateLimit(rules: RateLimitRule[], now: number = Date.now()): RateLimitResult {
  const result = reserve(rules, now)
  if (result.limited) console.warn(`[rate-limit] limited: ${rules[0]?.scope.split(":")[0] ?? "unknown"} (retry after ${result.retryAfterSeconds}s)`)
  return result
}

/**
 * 確認メールを1通送る直前に、宛先（正規化済み）ごとの送信枠を確保する。
 * allowed=false なら確認メールを省略する（予約そのものは拒否しない）。
 * 送信に失敗しても確保した枠は戻さない（失敗を利用して無制限に送信を試みられないようにする）。
 */
export function reserveConfirmationEmailQuota(email: string, now: number = Date.now()): { allowed: boolean } {
  const id = normalizeEmailForRateLimit(email)
  const result = reserve(
    [
      { scope: "booking:confirm-email:1h", identifier: id, limit: 3, windowSeconds: 3600 },
      { scope: "booking:confirm-email:1d", identifier: id, limit: 10, windowSeconds: 86400 },
    ],
    now
  )
  return { allowed: !result.limited }
}

/** 予約API：送信元IPの受付制限（宛先単位の制限は確認メール送信時に別途行う）。 */
export function bookingRateLimitRules(ip: string): RateLimitRule[] {
  return [
    { scope: "booking:ip:10m", identifier: ip, limit: 5, windowSeconds: 600 },
    { scope: "booking:ip:1d", identifier: ip, limit: 20, windowSeconds: 86400 },
  ]
}

/**
 * お問い合わせAPI：送信元IPの受付制限。通知先はスタジオのみで入力アドレスへは送信しないため、
 * アドレス単位の制限は設けない（第三者が他人のアドレスで送信を止められないようにする）。
 */
export function contactRateLimitRules(ip: string): RateLimitRule[] {
  return [
    { scope: "contact:ip:10m", identifier: ip, limit: 5, windowSeconds: 600 },
    { scope: "contact:ip:1d", identifier: ip, limit: 20, windowSeconds: 86400 },
  ]
}
