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

export interface BookingConfirmationData {
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

// ── GMail transporter factory ─────────────────────────────────────────────
function createTransporter() {
  const user = process.env.GMAIL_USER
  const password = process.env.GMAIL_APP_PASSWORD

  if (!user || !password) return null

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: password },
  })
}

// ── お客様への確認メール ──────────────────────────────────────────────────
export async function sendCustomerConfirmation(data: BookingConfirmationData) {
  const transporter = createTransporter()
  if (!transporter) {
    console.log("[email-mock] Customer confirmation →", data.customerEmail)
    return
  }

  await transporter.sendMail({
    from: `"Wuloong Studio TOKYO" <${process.env.GMAIL_USER}>`,
    to: data.customerEmail,
    subject: "【Wuloong Studio TOKYO】ご予約を受け付けました",
    html: customerHtml(data),
  })
}

// ── 管理者（Ryuw）への通知メール ─────────────────────────────────────────
export async function sendAdminNotification(data: BookingConfirmationData) {
  const transporter = createTransporter()
  if (!transporter) {
    console.log("[email-mock] Admin notification → admin")
    return
  }

  await transporter.sendMail({
    from: `"Wuloong Studio 予約" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `【新規予約】${data.customerName} — ${data.planName}`,
    html: adminHtml(data),
  })
}

// ── お問い合わせフォームの通知メール ───────────────────────────────────────
export async function sendContactNotification(data: ContactMessageData) {
  const transporter = createTransporter()
  if (!transporter) {
    console.log("[email-mock] Contact notification → admin")
    return
  }

  await transporter.sendMail({
    from: `"Wuloong Studio お問い合わせ" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: data.email,
    subject: `【お問い合わせ】${data.name} — ${data.subject || "件名なし"}`,
    html: contactHtml(data),
  })
}

// ── HTML テンプレート ─────────────────────────────────────────────────────
function customerHtml(d: BookingConfirmationData) {
  return `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#fafaf8;padding:32px;border-radius:16px;">
    <h2 style="color:#1a1a2e;font-size:20px;margin-bottom:8px;">ご予約ありがとうございます</h2>
    <p style="color:#64748b;font-size:14px;margin-top:0;">${d.customerName} 様</p>

    <div style="background:#fff;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #e2e8f0;">
      <table style="width:100%;font-size:14px;color:#4a5568;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#94a3b8;width:100px;">プラン</td><td style="font-weight:600;">${d.planName}</td></tr>
        <tr><td style="padding:6px 0;color:#94a3b8;">日時</td><td style="font-weight:600;">${d.date} ${d.time}〜</td></tr>
        <tr><td style="padding:6px 0;color:#94a3b8;">初回利用</td><td>${d.isFirstTime ? "はい" : "いいえ"}</td></tr>
      </table>
    </div>

    <p style="font-size:14px;color:#4a5568;line-height:1.8;">
      内容を確認後、<strong>メールまたはInstagram DM</strong>でご連絡いたします。<br>
      しばらくお待ちください。
    </p>

    <p style="font-size:12px;color:#94a3b8;margin-top:32px;">
      Wuloong Studio TOKYO<br>
      三軒茶屋・世田谷エリア · 完全予約制プライベートスタジオ
    </p>
  </div>
  `
}

function adminHtml(d: BookingConfirmationData) {
  return `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
    <h2 style="color:#1a1a2e;">🎙 新規予約が入りました</h2>
    <table style="width:100%;font-size:14px;color:#4a5568;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;">
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;width:120px;">プラン</td><td style="padding:10px;">${d.planName}</td></tr>
      <tr><td style="padding:10px;font-weight:600;">日時</td><td style="padding:10px;">${d.date} ${d.time}〜</td></tr>
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;">お名前</td><td style="padding:10px;">${d.customerName}</td></tr>
      <tr><td style="padding:10px;font-weight:600;">メール</td><td style="padding:10px;">${d.customerEmail}</td></tr>
      <tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;">Instagram</td><td style="padding:10px;">${d.instagram ? "@" + d.instagram : "—"}</td></tr>
      <tr><td style="padding:10px;font-weight:600;">初回</td><td style="padding:10px;">${d.isFirstTime ? "はい ⭐" : "いいえ"}</td></tr>
      ${d.message ? `<tr style="background:#f8f9ff;"><td style="padding:10px;font-weight:600;vertical-align:top;">メッセージ</td><td style="padding:10px;">${d.message}</td></tr>` : ""}
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
