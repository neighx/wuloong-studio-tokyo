"use client"

import { useState, FormEvent } from "react"
import { INSTAGRAM_URL, LINE_URL } from "@/lib/constants"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

type FormState = "idle" | "submitting" | "success" | "error"

export default function ContactPage() {
  const { lang } = useLang()
  const T = t[lang].contactPage

  const [formState, setFormState] = useState<FormState>("idle")
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormState("submitting")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("API error")
      setFormState("success")
    } catch {
      setFormState("error")
    }
  }

  if (formState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 gradient-bg-soft">
        <div className="glass-card rounded-3xl p-12 text-center max-w-md">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">{T.successTitle}</h2>
          <p className="text-[#64748b] text-sm leading-relaxed">
            {T.successBody}
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
          <p className="text-[#6b9fd4] text-sm font-semibold mb-3 tracking-wide">{T.eyebrow}</p>
          <h1 className="text-4xl font-black text-[#1a1a2e] mb-4">{T.title}</h1>
          <p className="text-[#64748b]">
            {T.subtitle}
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
                <p className="font-bold text-[#1a1a2e] text-sm">{T.instagramTitle}</p>
                <p className="text-xs text-[#94a3b8]">{T.instagramDesc}</p>
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
                  <p className="font-bold text-[#1a1a2e] text-sm">{T.lineTitle}</p>
                  <p className="text-xs text-[#94a3b8]">{T.lineDesc}</p>
                </div>
              </a>
            )}
          </div>

          {/* Contact Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h2 className="font-bold text-[#1a1a2e] mb-6">{T.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#64748b] mb-1 font-medium">{T.name}</label>
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
                  <label className="block text-xs text-[#64748b] mb-1 font-medium">{T.email}</label>
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
                <label className="block text-xs text-[#64748b] mb-1 font-medium">{T.subject}</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
                >
                  <option value="">{T.subjectPlaceholder}</option>
                  {T.subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1 font-medium">{T.message}</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={T.messagePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={formState === "submitting"}
                className="w-full btn-primary py-4 font-bold disabled:opacity-60"
              >
                {formState === "submitting" ? T.submitting : T.submit}
              </button>
              {formState === "error" && (
                <p className="text-center text-red-500 text-sm">{T.errorMsg}</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
