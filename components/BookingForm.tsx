"use client"

import { useState, useRef, FormEvent } from "react"
import { PLANS, type PlanId } from "@/lib/pricing"
import BookingCalendar from "@/components/BookingCalendar"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"
import { track } from "@/lib/analytics"

type FormState = "idle" | "submitting" | "success" | "error" | "conflict"

export default function BookingForm({ defaultPlan, defaultDate, defaultTime }: { defaultPlan?: string; defaultDate?: string; defaultTime?: string }) {
  const { lang } = useLang()
  const T = t[lang]
  const TF = T.bookingForm

  const [selectedDate, setSelectedDate] = useState(defaultDate ?? "")
  const [selectedTime, setSelectedTime] = useState(defaultTime ?? "")
  const [formState, setFormState] = useState<FormState>("idle")
  const [receiptNumber, setReceiptNumber] = useState("")
  // プラン変更に加えて、時間重複(409)が起きた際にもカレンダーを再マウントして
  // 最新の空き状況を取り直すためのキー
  const [calendarResetKey, setCalendarResetKey] = useState(0)
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
  const submittingRef = useRef(false)
  const bookingStartedRef = useRef(false)

  // 同じ日時への送信操作をもう一度行った場合に、サーバー側で
  // 「同じ予約の再送」と判定できるようにするキー。
  // 選択中の日時が変わった時だけ新しく発行し、通信エラー等での
  // 単純な再送（日時は変えていない）では同じキーを使い続ける。
  const idempotencySlotRef = useRef("")
  const idempotencyKeyRef = useRef("")
  const currentSlot = `${selectedDate}|${selectedTime}`
  if (idempotencySlotRef.current !== currentSlot) {
    idempotencySlotRef.current = currentSlot
    idempotencyKeyRef.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
      // プラン変更で所要時間や空き状況が変わる可能性があるため、
      // 選択済みの日時は一度解除し、送信前に必ず選び直してもらう
      if (name === "planId") {
        setSelectedDate("")
        setSelectedTime("")
        track("plan_select", { plan_id: value })
      }
      // 氏名・メール等は送信しない。「入力を始めた」ことのみ1回だけ計測する
      if (!bookingStartedRef.current && ["name", "email", "phone"].includes(name) && value) {
        bookingStartedRef.current = true
        track("booking_start", { plan_id: form.planId })
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) {
      alert(TF.alertMissingDateTime)
      return
    }
    if (submittingRef.current) return
    submittingRef.current = true

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
          idempotencyKey: idempotencyKeyRef.current,
        }),
      })
      if (res.status === 409) {
        setFormState("conflict")
        setSelectedTime("")
        setCalendarResetKey((k) => k + 1)
        submittingRef.current = false
        track("booking_submit_error", { plan_id: form.planId, error_type: "conflict" })
        return
      }
      if (!res.ok) throw new Error("API error")
      const data = await res.json()
      setReceiptNumber(data.receiptNumber ?? "")
      setFormState("success")
      // status: "pending_confirmation" ＝ APIが申込を受理したことのみを示す。
      // スタジオによる予約確定とは別（HTTP成功＝確定ではない）。
      track("booking_submit_success", { plan_id: form.planId })
    } catch {
      setFormState("error")
      submittingRef.current = false
      track("booking_submit_error", { plan_id: form.planId, error_type: "network_or_server" })
    }
  }

  if (formState === "success") {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <div className="text-5xl mb-4">📩</div>
        <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{TF.successTitle}</h3>
        <p className="text-[#64748b] leading-relaxed mb-6" style={{ whiteSpace: "pre-line" }}>
          {TF.successBody}
        </p>
        <div className="text-left max-w-sm mx-auto rounded-2xl bg-[#f8f9ff] p-5 space-y-2">
          {receiptNumber && (
            <p className="text-sm text-[#1a1a2e]">
              <span className="text-[#94a3b8]">{TF.receiptLabel}：</span>
              <span className="font-bold">{receiptNumber}</span>
            </p>
          )}
          <p className="text-sm text-[#1a1a2e]">
            <span className="text-[#94a3b8]">{TF.planLabel}：</span>
            <span className="font-bold">{selectedPlan?.name ?? form.planId}</span>
          </p>
          <p className="text-sm text-[#1a1a2e]">
            <span className="text-[#94a3b8]">{TF.requestedDateTimeLabel}：</span>
            <span className="font-bold">{selectedDate} {selectedTime}〜</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Plan Selection */}
      <div className="glass-card rounded-3xl p-6">
        <label className="block text-sm font-semibold text-[#1a1a2e] mb-4">{TF.selectPlan}</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLANS.map((plan) => {
            const selected = form.planId === plan.id
            const planT = T.plans[plan.id]
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
                    {planT.tag}
                  </span>
                )}
                <p className="text-xs font-bold text-[#1a1a2e] leading-snug mb-2">{planT.name}</p>
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
        <p className="text-sm font-semibold text-[#1a1a2e] mb-3">{TF.selectDateTime}</p>
        <BookingCalendar
          // BookingCalendarは内部でも日付/時間を保持するため、プラン変更時に
          // key を変えて再マウントし、古い選択状態が残らないようにする
          key={`${form.planId}-${calendarResetKey}`}
          planId={form.planId as PlanId}
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
        <p className="text-sm font-semibold text-[#1a1a2e]">{TF.customerInfo}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#64748b] mb-1 font-medium">{TF.name}</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder={TF.namePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1 font-medium">{TF.email}</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder={TF.emailPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1 font-medium">{TF.phone}</label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder={TF.phonePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1 font-medium">{TF.instagram}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm">@</span>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder={TF.instagramPlaceholder}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#64748b] mb-1 font-medium">{TF.message}</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder={TF.messagePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white/80 text-sm focus:outline-none focus:border-[#6b9fd4] focus:ring-2 focus:ring-[#6b9fd4]/20 transition-all resize-none"
          />
        </div>

      </div>

      {/* Submit */}
      <p className="text-xs text-[#94a3b8] text-center">{TF.preSubmitNotice}</p>
      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full btn-primary py-4 text-base font-bold disabled:opacity-60"
      >
        {formState === "submitting" ? TF.submitting : TF.submit}
      </button>

      {formState === "error" && (
        <p className="text-center text-red-500 text-sm">
          {TF.errorMsg}
        </p>
      )}

      {formState === "conflict" && (
        <p className="text-center text-red-500 text-sm">
          {TF.conflictMsg}
        </p>
      )}
    </form>
  )
}
