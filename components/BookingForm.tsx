"use client"

import { useState, FormEvent } from "react"
import { PLANS } from "@/lib/pricing"
import BookingCalendar from "@/components/BookingCalendar"

type FormState = "idle" | "submitting" | "success" | "error"

export default function BookingForm({ defaultPlan }: { defaultPlan?: string }) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [form, setForm] = useState({
    planId: defaultPlan ?? "first-time-2h",
    name: "",
    email: "",
    phone: "",
    instagram: "",
    message: "",
    isFirstTime: true,
  })

  const selectedPlan = PLANS.find((p) => p.id === form.planId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) {
      alert("日付と時間を選択してください")
      return
    }

    setFormState("submitting")
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          planName: selectedPlan?.name ?? form.planId,
          date: selectedDate,
          time: selectedTime,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          customerInstagram: form.instagram,
        }),
      })
      if (!res.ok) throw new Error("API error")
      setFormState("success")
    } catch {
      setFormState("error")
    }
  }

  if (formState === "success") {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">ご予約ありがとうございます</h3>
        <p className="text-[#64748b] leading-relaxed">
          内容を確認後、メールまたはInstagram DMでご連絡いたします。
          <br />
          しばらくお待ちください。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Plan Selection */}
      <div className="glass-card rounded-3xl p-6">
        <label className="block text-sm font-semibold text-[#1a1a2e] mb-4">プランを選ぶ</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLANS.map((plan) => {
            const selected = form.planId === plan.id
            return (
              <label
                key={plan.id}
                className={`flex flex-col p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  selected
                    ? "border-[#6b9fd4] bg-[#6b9fd4]/5"
                    : "border-transparent bg-[#f8f9ff] hover:bg-[#f0f4ff] hover:border-[#6b9fd4]/30"
                }`}
              >
                <input
                  type="radio"
                  name="planId"
                  value={plan.id}
                  checked={selected}
                  onChange={handleChange}
                  className="accent-[#6b9fd4] mb-2"
                />
                {plan.tag && (
                  <span className="text-[9px] text-white px-1.5 py-0.5 rounded-full bg-[#9b8ec4] self-start mb-2">
                    {plan.tag}
                  </span>
                )}
                <p className="text-xs font-bold text-[#1a1a2e] leading-snug mb-2">{plan.name}</p>
                <p className="text-sm font-black mt-auto" style={{ color: selected ? "#6b9fd4" : "#94a3b8" }}>
                  {plan.price}
                  {plan.priceNote && <span className="text-[10px] font-normal block">{plan.priceNote}</span>}
                </p>
              </label>
            )
          })}
        </div>
      </div>

      {/* Calendar */}
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e] mb-3">希望日・時間を選ぶ</p>
        <BookingCalendar
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectDateTime={(date, time) => {
            setSelectedDate(date)
            setSelectedTime(time)
          }}
        />
      </div>

      {/* Customer Info */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <p className="text-sm font-semibold text-[#1a1a2e]">お客様情報</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#64748b] mb-1 font-medium">お名前 *</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="山田 花子"
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
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1 font-medium">電話番号 *</label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="090-0000-0000"
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1 font-medium">Instagram ID（任意）</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm">@</span>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="your_handle"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#64748b] mb-1 font-medium">内容・相談したいこと</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="録音したい曲のジャンル、参考アーティスト、ご不明な点など、お気軽にお書きください。"
            className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all resize-none"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isFirstTime"
            checked={form.isFirstTime}
            onChange={handleChange}
            className="w-4 h-4 accent-[#6b9fd4]"
          />
          <span className="text-sm text-[#4a5568]">Wuloong Studio TOKYOへの初回利用です</span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full btn-primary py-4 text-base font-bold disabled:opacity-60"
      >
        {formState === "submitting" ? "送信中..." : "予約を申し込む"}
      </button>

      {formState === "error" && (
        <p className="text-center text-red-500 text-sm">
          エラーが発生しました。Instagramまたはメールからご連絡ください。
        </p>
      )}
    </form>
  )
}
