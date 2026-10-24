"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { INSTAGRAM_URL } from "@/lib/constants"
import { track } from "@/lib/analytics"
import { getPlanById, type PlanId } from "@/lib/pricing"
import { toJSTWallClock, getJSTDateString, getEndOfNextMonth, isValidDateString } from "@/lib/datetime"
import { useLang } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingCalendarProps {
  /** 日付または時刻を選ぶたびに呼ばれる。日付だけを選んだ（時刻未選択の）状態では time は "" */
  onSelectDateTime?: (date: string, time: string) => void
  selectedDate?: string
  selectedTime?: string
  /** 空き状況の判定に使う所要時間の基準となるプラン（省略時は初回体験プラン） */
  planId?: PlanId
}

export default function BookingCalendar({ onSelectDateTime, selectedDate, selectedTime, planId }: BookingCalendarProps) {
  const { lang } = useLang()
  const T = t[lang].bookingCalendar

  // サーバー（既定UTC）と閲覧端末のタイムゾーンが異なっても、
  // 営業時間はJSTの壁時計時刻で揃える
  // 事前選択された日付があればその月から表示する（無ければJSTの今月）
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (isValidDateString(selectedDate)) {
      const [y, m] = selectedDate.split("-").map(Number)
      return new Date(y, m - 1, 1)
    }
    return toJSTWallClock()
  })
  const durationHours = getPlanById(planId ?? "first-time-2h")?.durationHours ?? 3
  const [internalDate, setInternalDate] = useState(selectedDate ?? "")
  const [internalTime, setInternalTime] = useState(selectedTime ?? "")
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  // 空き状況の取得完了時に、最新の選択時刻と親への通知関数を参照するためのref
  const internalTimeRef = useRef(internalTime)
  internalTimeRef.current = internalTime
  const onSelectRef = useRef(onSelectDateTime)
  onSelectRef.current = onSelectDateTime

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const todayJSTForNav = getJSTDateString()
  const maxBookableDate = getEndOfNextMonth(todayJSTForNav)
  // 翌月の1日がすでにWeb予約の受付期間を超えている場合は、それ以上先へ進めない
  // （進んでも予約できる日が1つも無い月になるため）
  const firstDayOfNextMonthStr = `${month === 11 ? year + 1 : year}-${String(((month + 1) % 12) + 1).padStart(2, "0")}-01`
  const canGoNextMonth = firstDayOfNextMonthStr <= maxBookableDate

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1))
  const nextMonth = () => {
    if (canGoNextMonth) setCurrentMonth(new Date(year, month + 1))
  }

  useEffect(() => {
    if (!internalDate) return
    let cancelled = false
    setLoading(true)
    setError(false)
    setSlots([])

    fetch(`/api/availability?date=${internalDate}&planId=${encodeURIComponent(planId ?? "first-time-2h")}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`availability request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        // 日付を素早く切り替えた場合、古いリクエストの遅い応答が
        // 新しい日付の表示を上書きしないようにする
        if (cancelled) return
        const parsed: TimeSlot[] = (data.slots ?? []).map((s: { start: string; available: boolean }) => {
          const hour = new Date(s.start).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Tokyo",
            hour12: false,
          })
          return { time: hour, available: s.available }
        })
        setSlots(parsed)
        // 選択中の時刻（URLでの事前選択など）が空き枠に無い場合（予約済み・開始済み等）は、
        // 画面と送信内容がずれないよう、カレンダーと親の両方で時刻の選択を解除する
        const chosen = internalTimeRef.current
        if (chosen && !parsed.some((s) => s.available && s.time === chosen)) {
          setInternalTime("")
          onSelectRef.current?.(internalDate, "")
        }
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        track("availability_error", { plan_id: planId ?? "first-time-2h" })
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [internalDate, reloadKey, planId])

  const handleDateClick = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setInternalDate(date)
    setInternalTime("")
    // 日付を選び直した時点（同じ日付の再クリックを含む）で時刻の選択は解除されるため、
    // 親にも時刻未選択（""）を通知し、古い日時が送信内容や予約リンクに残らないようにする
    if (onSelectDateTime) onSelectDateTime(date, "")
  }

  const handleTimeClick = (time: string) => {
    setInternalTime(time)
    if (onSelectDateTime) onSelectDateTime(internalDate, time)
  }

  const todayJST = getJSTDateString()
  const isPast = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return dateStr < todayJST
  }
  // Web予約は常に「翌月末日」まで。それを超える日はカレンダー上では
  // 選べず、Instagram DM・メールでの個別相談に案内する。
  const isBeyondWindow = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return dateStr > maxBookableDate
  }

  const monthLabel = currentMonth.toLocaleDateString(T.locale, { year: "numeric", month: "long" })

  const availableSlots = slots.filter((s) => s.available)
  const bookedSlots = slots.filter((s) => !s.available)

  const maxBookableDateLabel = new Date(maxBookableDate + "T12:00:00").toLocaleDateString(T.locale, {
    month: "long",
    day: "numeric",
  })
  const windowNoteText = T.windowNote.replace("{date}", maxBookableDateLabel)
  const windowTooltipText = T.windowTooltip.replace("{date}", maxBookableDateLabel)

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="glass-card rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          {/* カレンダーは予約フォーム（<form>）の中でも使われるため、操作ボタンはすべて
              type="button" にし、クリックでフォームが送信されないようにする */}
          <button
            type="button"
            onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#6b9fd4]/10 transition-colors text-[#64748b]"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-[#1a1a2e]">{monthLabel}</span>
          <button
            type="button"
            onClick={nextMonth}
            disabled={!canGoNextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#6b9fd4]/10 transition-colors text-[#64748b] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {T.dayLabels.map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs font-semibold py-1 ${
                i === 0 ? "text-red-400" : i === 6 ? "text-[#6b9fd4]" : "text-[#94a3b8]"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const isSelected = internalDate === dateStr
            const past = isPast(day)
            const beyondWindow = isBeyondWindow(day)
            const disabledDay = past || beyondWindow

            return (
              <button
                type="button"
                key={day}
                onClick={() => !disabledDay && handleDateClick(day)}
                disabled={disabledDay}
                title={beyondWindow ? windowTooltipText : undefined}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all
                  ${disabledDay ? "text-[#cbd5e1] cursor-not-allowed" : "cursor-pointer"}
                  ${isSelected ? "text-white shadow-md" : disabledDay ? "" : "hover:bg-[#6b9fd4]/10 text-[#1a1a2e]"}
                `}
                style={isSelected ? { background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" } : {}}
              >
                {day}
              </button>
            )
          })}
        </div>

        {/* Web予約の公開期間の案内 */}
        <div className="mt-4 pt-4 border-t border-[#f0f4f8] text-xs text-[#64748b] leading-relaxed">
          <p>{windowNoteText}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("consult_click", { location: "booking_calendar_window_note" })}
              className="font-semibold text-[#6b9fd4] hover:underline"
            >
              {T.consultInstagram}
            </a>
            <Link href="/contact" className="font-semibold text-[#6b9fd4] hover:underline">
              {T.consultEmail}
            </Link>
          </div>
        </div>
      </div>

      {/* Time slots */}
      {internalDate && (
        <div className="glass-card rounded-3xl p-5 sm:p-6">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-1">
            {new Date(internalDate + "T12:00:00").toLocaleDateString(T.locale, {
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
            {T.dateTimeSuffix}
          </p>
          <p className="text-xs text-[#94a3b8] mb-4">
            {T.timezoneNotePrefix}
            {durationHours}
            {T.timezoneNoteSuffix}
          </p>

          {loading ? (
            <p className="text-sm text-[#94a3b8] text-center py-6">{T.loading}</p>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-sm text-[#64748b] mb-4">{T.errorMsg}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="text-sm font-semibold text-[#6b9fd4] border border-[#6b9fd4]/40 rounded-full px-5 py-2 hover:bg-[#6b9fd4]/5 transition-colors"
                >
                  {T.retry}
                </button>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("consult_click", { location: "booking_calendar_error" })}
                  className="text-sm font-semibold text-[#6b9fd4] hover:underline"
                >
                  {T.consultInstagram}
                </a>
              </div>
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-[#94a3b8] text-center py-6">{T.noSlotsConfigured}</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-[#94a3b8] text-center py-6">{T.fullyBooked}</p>
          ) : (
            <>
              {/* Available slots — single column on mobile for easy tapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {availableSlots.map((slot) => {
                  const selected = internalTime === slot.time
                  return (
                    <button
                      type="button"
                      key={slot.time}
                      onClick={() => handleTimeClick(slot.time)}
                      className={`
                        w-full flex items-center justify-between px-5 rounded-2xl font-semibold transition-all
                        min-h-[60px] text-base active:scale-[0.97]
                        ${selected
                          ? "text-white shadow-md"
                          : "bg-[#f0f5ff] text-[#1a1a2e] hover:bg-[#6b9fd4]/15 border border-[#6b9fd4]/25"
                        }
                      `}
                      style={selected ? { background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" } : {}}
                    >
                      <span>{slot.time}{T.timeSuffix}</span>
                      {selected
                        ? <span className="text-white/80 text-sm">{T.selectedLabel}</span>
                        : <span className="text-[#6b9fd4] text-sm">{T.availableLabel}</span>
                      }
                    </button>
                  )
                })}
              </div>

              {/* Booked slots — compact, secondary */}
              {bookedSlots.length > 0 && (
                <div>
                  <p className="text-xs text-[#94a3b8] mb-2">{T.bookedTitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {bookedSlots.map((slot) => (
                      <span
                        key={slot.time}
                        className="px-3 py-1.5 rounded-xl text-xs text-[#cbd5e1] bg-[#f1f5f9] line-through"
                      >
                        {slot.time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
