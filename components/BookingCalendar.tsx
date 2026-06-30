"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingCalendarProps {
  onSelectDateTime?: (date: string, time: string) => void
  selectedDate?: string
  selectedTime?: string
}

export default function BookingCalendar({ onSelectDateTime, selectedDate, selectedTime }: BookingCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today)
  const [internalDate, setInternalDate] = useState(selectedDate ?? "")
  const [internalTime, setInternalTime] = useState(selectedTime ?? "")
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1))

  useEffect(() => {
    if (!internalDate) return
    setLoading(true)
    setSlots([])
    fetch(`/api/availability?date=${internalDate}`)
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }, [internalDate])

  const handleDateClick = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setInternalDate(date)
    setInternalTime("")
  }

  const handleTimeClick = (time: string) => {
    setInternalTime(time)
    if (onSelectDateTime) onSelectDateTime(internalDate, time)
  }

  const isPast = (day: number) => {
    const d = new Date(year, month, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return d < t
  }

  const monthLabel = currentMonth.toLocaleDateString("ja-JP", { year: "numeric", month: "long" })
  const dayLabels = ["日", "月", "火", "水", "木", "金", "土"]

  const availableSlots = slots.filter((s) => s.available)
  const bookedSlots = slots.filter((s) => !s.available)

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="glass-card rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#6b9fd4]/10 transition-colors text-[#64748b]"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-[#1a1a2e]">{monthLabel}</span>
          <button
            onClick={nextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#6b9fd4]/10 transition-colors text-[#64748b]"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {dayLabels.map((d, i) => (
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

            return (
              <button
                key={day}
                onClick={() => !past && handleDateClick(day)}
                disabled={past}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all
                  ${past ? "text-[#cbd5e1] cursor-not-allowed" : "cursor-pointer"}
                  ${isSelected ? "text-white shadow-md" : past ? "" : "hover:bg-[#6b9fd4]/10 text-[#1a1a2e]"}
                `}
                style={isSelected ? { background: "linear-gradient(135deg, #6b9fd4, #9b8ec4)" } : {}}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {internalDate && (
        <div className="glass-card rounded-3xl p-5 sm:p-6">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-4">
            {new Date(internalDate + "T12:00:00").toLocaleDateString("ja-JP", {
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
            　の空き時間
          </p>

          {loading ? (
            <p className="text-sm text-[#94a3b8] text-center py-6">読み込み中...</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-[#94a3b8] text-center py-6">空き枠がありません</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-[#94a3b8] text-center py-6">
              この日はすべて予約済みです
            </p>
          ) : (
            <>
              {/* Available slots — single column on mobile for easy tapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {availableSlots.map((slot) => {
                  const selected = internalTime === slot.time
                  return (
                    <button
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
                      <span>{slot.time}〜</span>
                      {selected
                        ? <span className="text-white/80 text-sm">✓ 選択中</span>
                        : <span className="text-[#6b9fd4] text-sm">空き</span>
                      }
                    </button>
                  )
                })}
              </div>

              {/* Booked slots — compact, secondary */}
              {bookedSlots.length > 0 && (
                <div>
                  <p className="text-xs text-[#94a3b8] mb-2">予約済み</p>
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
