/**
 * メール送信 — Gmail SMTP (nodemailer)
 *
 * Setup:
 *   1. Googleアカウント → セキュリティ → 2段階認証を有効化
 *   2. 「アプリパスワード」を生成（16文字）
 *   3. .env.local に以下を追加:
 *        GMAIL_USER=wuloong.music@gmail.com
 *        GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  ← スペースなしで16文字
 *        ADMIN_EMAIL=wuloong.music@gmail.com
 *   4. Vercel側にも同じ環境変数を設定（Project Settings → Environment Variables）
 */

import nodemailer from "nodemailer"
import { isLiveProductionTarget, isTestIntegrationAllowed } from "./env"

type EmailMode = "mock" | "test" | "live"

/**
 * production（VercelのVERCEL_ENV）以外では、ALLOW_TEST_INTEGRATION=true かつ
 * TEST_ADMIN_EMAIL が設定されている場合に限り test モードで実際に送信する。
 * それ以外は常に mock（console.logのみ、実送信なし）。
 */
function getEmailMode(): EmailMode {
  if (isLiveProductionTarget()) return "live"
  if (isTestIntegrationAllowed() && process.env.TEST_ADMIN_EMAIL) return "test"
  return "mock"
}

export interface BookingConfirmationData {
  receiptNumber: string
  customerName: string
  customerEmail: string
  planName: string
  date: string
  time: string
  isFirstTime: boolean
  instagram?: string
  message?: string
}

export interface ContactMessageData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * 現在の実行環境（mock/test/live）で、メール送信に必要な設定が
 * 揃っているかを先に確認する。mockでは何もしない。
 * live/testで不足している場合は、その場で例外を投げて呼び出し元に
 * 明示的な失敗を返させる（モックの「成功」にフォールバックしない）。
 */
export function assertEmailConfigured(): void {
  const mode = getEmailMode()
  if (mode === "mock") return
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(`[email] ${mode} mode requires GMAIL_USER and GMAIL_APP_PASSWORD, but they are missing`)
  }
  if (mode === "live" && !process.env.ADMIN_EMAIL) {
    throw new Error("[email] live mode requires ADMIN_EMAIL, but it is missing")
  }
  if (mode === "test" && !process.env.TEST_ADMIN_EMAIL) {
    throw new Error("[email] test mode requires TEST_ADMIN_EMAIL, but it is missing")
  }
}

// ── GMail transporter factory ─────────────────────────────────────────────
function createTransporter(mode: "live" | "test") {
  const user = process.env.GMAIL_USER
  const password = process.env.GMAIL_APP_PASSWORD

  if (!user || !password) {
    throw new Error(`[email] ${mode} mode requires GMAIL_USER and GMAIL_APP_PASSWORD, but they are missing`)
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: password },
  })
}

/**
 * テスト専用フック：mockモードでのみ有効。BOOKING_TEST_FORCE_EMAIL_FAILURE=true の
 * 場合に、メール送信を意図的に例外で失敗させる（外部通信は一切発生しない）。
 * 「カレンダー保存は成功したがメール送信だけ失敗した」状況をローカルで安全に
 * 再現するためのもの。liveモードでは無視される（本番で使っても何も起こらない）。
 */
function maybeForceMockEmailFailureForTesting(mode: EmailMode): void {
  if (mode === "mock" && process.env.BOOKING_TEST_FORCE_EMAIL_FAILURE === "true") {
    throw new Error("[email-mock] forced failure for testing (BOOKING_TEST_FORCE_EMAIL_FAILURE)")
  }
}

// ── お客様への確認メール ──────────────────────────────────────────────────
export async function sendCustomerConfirmation(data: BookingConfirmationData) {
  const mode = getEmailMode()
  if (mode === "mock") {
    maybeForceMockEmailFailureForTesting(mode)
    console.log("[email-mock] Customer confirmation →", data.customerEmail)
    return
  }

  const transporter = createTransporter(mode)
  // testモードでは、入力された（架空の可能性がある）customerEmailへは絶対に送らず、
  // 検証用に用意されたTEST_ADMIN_EMAILへ送る
  const to = mode === "test" ? process.env.TEST_ADMIN_EMAIL! : data.customerEmail
  const subjectPrefix = mode === "test" ? "【TEST】" : ""

  await transporter.sendMail({
    from: `"Wuloong Studio TOKYO" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${subjectPrefix}【Wuloong Studio TOKYO】予約申込の受付（受付番号: ${data.receiptNumber}）`,
    html: customerHtml(data),
  })
}

// ── 管理者への通知メール ─────────────────────────────────────────
export async function sendAdminNotification(data: BookingConfirmationData) {
  const mode = getEmailMode()
  if (mode === "mock") {
    maybeForceMockEmailFailureForTesting(mode)
    console.log("[email-mock] Admin notification → admin")
    return
  }

  const transporter = createTransporter(mode)
  const to = mode === "test" ? process.env.TEST_ADMIN_EMAIL! : process.env.ADMIN_EMAIL
  if (mode === "live" && !to) {
    throw new Error("[email] live mode requires ADMIN_EMAIL, but it is missing")
  }
  const subjectPrefix = mode === "test" ? "【TEST】" : ""

  await transporter.sendMail({
    from: `"Wuloong Studio 予約" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${subjectPrefix}【要確認：予約申込】${data.customerName} — ${data.planName}（受付番号: ${data.receiptNumber}）`,
    html: adminHtml(data),
  })
}

// ── お問い合わせフォームの通知メール ───────────────────────────────────────
export async function sendContactNotification(data: ContactMessageData) {
  const mode = getEmailMode()
  if (mode === "mock") {
    console.log("[email-mock] Contact notification → admin")
    return
  }

  const transporter = createTransporter(mode)
  const to = mode === "test" ? process.env.TEST_ADMIN_EMAIL! : process.env.ADMIN_EMAIL
  if (mode === "live" && !to) {
    throw new Error("[email] live mode requires ADMIN_EMAIL, but it is missing")
  }
  const subjectPrefix = mode === "test" ? "【TEST】" : ""

  await transporter.sendMail({
    from: `"Wuloong Studio お問い合わせ" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: data.email,
    subject: `${subjectPrefix}【お問い合わせ】${data.name} — ${data.subject || "件名なし"}`,
    html: contactHtml(data),
  })
}

// ── HTML テンプレート ─────────────────────────────────────────────────────
function customerHtml(d: BookingConfirmationData) {
  return `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#fafaf8;padding:32px;border-radius:16px;">
    <h2 style="color:#1a1a2e;font-size:20px;margin-bottom:8px;">予約のお申し込みを受け付けました</h2>
    <p style="color:#64748b;font-size:14px;margin-top:0;">${d.customerName} 様</p>

    <div style="background:#fff3cd;border-radius:10px;padding:14px 18px;margin:16px 0;border:1px solid #f0d58c;">
      <p style="font-size:13px;color:#7a5c00;margin:0;line-height:1.7;">
        現在は<strong>未確定</strong>です。内容と空き状況を確認後、スタジオから確定のご連絡をします。<br>
        ご希望の日時を確保できない場合は、別日程をご相談します。
      </p>
    </div>

    <div style="background:#fff;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #e2e8f0;">
      <table style="width:100%;font-size:14px;color:#4a5568;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#94a3b8;width:100px;">受付番号</td><td style="font-weight:600;">${d.receiptNumber}</td></tr>
        <tr><td style="padding:6px 0;color:#94a3b8;">プラン</td><td style="font-weight:600;">${d.planName}</td></tr>
        <tr><td style="padding:6px 0;color:#94a3b8;">希望日時</td><td style="font-weight:600;">${d.date} ${d.time}〜（日本時間）</td></tr>
        <tr><td style="padding:6px 0;color:#94a3b8;">初回利用</td><td>${d.isFirstTime ? "はい" : "いいえ"}</td></tr>
      </table>
    </div>

    <p style="font-size:14px;color:#4a5568;line-height:1.8;">
      スタジオ所在地など詳細は、確定のご連絡の際にお知らせします。<br>
      ご不明な点があれば、お気軽にご連絡ください。
    </p>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">

    <p style="font-size:13px;color:#64748b;line-height:1.8;">Thank you, ${d.customerName}. We've received your booking application.</p>
    <p style="font-size:13px;color:#4a5568;line-height:1.8;">
      This is <strong>not yet confirmed</strong>. We'll check availability and contact you to confirm.
      If we can't accommodate your requested time, we'll suggest alternative dates.
    </p>
    <p style="font-size:13px;color:#4a5568;line-height:1.8;">
      Receipt number: ${d.receiptNumber}<br>
      Plan: ${d.planName}<br>
      Requested date/time: ${d.date} ${d.time} (Japan time)
    </p>

    <p style="font-size:12px;color:#94a3b8;margin-top:32px;">
      Wuloong Studio TOKYO · Sangenjaya, Setagaya, Tokyo
    </p>
  </div>
  `
}

function adminHtml(d: BookingConfirmationData) {
  return `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
    <h2 style="color:#1a1a2e;">🎙 要確認：予約申込が届きました（未確定）</h2>
    <p style="font-size:13px;color:#7a5c00;background:#fff3cd;border:1px solid #f0d58c;border-radius:8px;padding:10px 14px;">
      カレンダーには「未確定」として登録済みです。空き状況・重複申込を確認し、
      対応できる場合のみカレンダー上で確定に変更の上、お客様へ手動でご連絡ください。
    </p>
    <table style="width:100%;font-size:14px;color:#4a5568;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;">
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;width:120px;">受付番号</td><td style="padding:10px;">${d.receiptNumber}</td></tr>
      <tr><td style="padding:10px;font-weight:600;">プラン</td><td style="padding:10px;">${d.planName}</td></tr>
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;">希望日時</td><td style="padding:10px;">${d.date} ${d.time}〜（日本時間）</td></tr>
      <tr><td style="padding:10px;font-weight:600;">お名前</td><td style="padding:10px;">${d.customerName}</td></tr>
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;">メール</td><td style="padding:10px;">${d.customerEmail}</td></tr>
      <tr><td style="padding:10px;font-weight:600;">Instagram</td><td style="padding:10px;">${d.instagram ? "@" + d.instagram : "—"}</td></tr>
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;">初回</td><td style="padding:10px;">${d.isFirstTime ? "はい ⭐" : "いいえ"}</td></tr>
      ${d.message ? `<tr><td style="padding:10px;font-weight:600;vertical-align:top;">メッセージ</td><td style="padding:10px;">${d.message}</td></tr>` : ""}
    </table>
  </div>
  `
}

function contactHtml(d: ContactMessageData) {
  return `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
    <h2 style="color:#1a1a2e;">✉️ お問い合わせフォームより</h2>
    <table style="width:100%;font-size:14px;color:#4a5568;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;">
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;width:100px;">お名前</td><td style="padding:10px;">${d.name}</td></tr>
      <tr><td style="padding:10px;font-weight:600;">メール</td><td style="padding:10px;">${d.email}</td></tr>
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;">件名</td><td style="padding:10px;">${d.subject || "—"}</td></tr>
      <tr><td style="padding:10px;font-weight:600;vertical-align:top;">メッセージ</td><td style="padding:10px;white-space:pre-wrap;">${d.message}</td></tr>
    </table>
  </div>
  `
}
