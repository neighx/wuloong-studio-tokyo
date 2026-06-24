"use client"

import { useState, FormEvent } from "react"
import { INSTAGRAM_URL, LINE_URL } from "@/lib/constants"

type FormState = "idle" | "submitting" | "success" | "error"

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormState("submitting")
    // TODO: Implement contact form submission (Resend or Formspree)
    await new Promise((r) => setTimeout(r, 800))
    setFormState("success")
  }

  if (formState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 gradient-bg-soft">
        <div className="glass-card rounded-3xl p-12 text-center max-w-md">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">送信しました</h2>
          <p className="text-[#64748b] text-sm leading-relaxed">
            お問い合わせありがとうございます。内容を確認後、2〜3営業日以内にご連絡いたします。
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 gradient-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">CONTACT</p>
          <h1 className="text-4xl font-black text-[#1a1a2e] mb-4">お問い合わせ</h1>
          <p className="text-[#64748b]">
            ご不明な点はお気軽にご連絡ください。
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 pb-24 bg-white">
        <div className="max-w-2xl mx-auto">
          {/* Social contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="text-3xl">📷</div>
              <div>
                <p className="font-bold text-[#1a1a2e] text-sm">Instagramで相談</p>
                <p className="text-xs text-[#94a3b8]">DM歓迎 · 返信早め</p>
              </div>
            </a>
            {LINE_URL && (
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="text-3xl">💬</div>
                <div>
                  <p className="font-bold text-[#1a1a2e] text-sm">LINEで相談</p>
                  <p className="text-xs text-[#94a3b8]">気軽にメッセージ</p>
                </div>
              </a>
            )}
          </div>

          {/* Contact Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h2 className="font-bold text-[#1a1a2e] mb-6">メールフォーム</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#64748b] mb-1 font-medium">お名前 *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#64748b] mb-1 font-medium">メールアドレス *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1 font-medium">件名</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
                >
                  <option value="">選択してください</option>
                  <option value="booking">予約・スケジュールについて</option>
                  <option value="pricing">料金・プランについて</option>
                  <option value="song-package">1曲完成パックについて</option>
                  <option value="monthly">月額サポートについて</option>
                  <option value="other">その他</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1 font-medium">メッセージ *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="ご質問やご相談内容をお書きください。"
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={formState === "submitting"}
                className="w-full btn-primary py-4 font-bold disabled:opacity-60"
              >
                {formState === "submitting" ? "送信中..." : "送信する"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
