import { useEffect, useMemo, useState } from "react"
import AddPeriodModal, { type NewPeriodInput } from "../components/AddPeriodModal"
import PeriodDetailsModal from "../components/PeriodDetailsModal"

type Period = {
  subject: string
  class: string
  teacher: string
  start: number // hour offset from 8am (0=8am, 1=9am, etc.)
  duration: number // in hour units
  color: string
  bg: string
}

type DayData = {
  name: string
  periods: Period[]
}

type ScheduledPeriod = Period & {
  id: number
  dateKey: string
}

type DisplayPeriod = Period & {
  id?: number
  sourceKey: string
}

type SelectedPeriod = DisplayPeriod & {
  date: Date
}

const PURPLE = "#a855f7"
const PINK = "#ec4899"
const CYAN = "#06b6d4"
const GREEN = "#10b981"
const AMBER = "#f59e0b"
const RED = "#ef4444"

const weekData: DayData[] = [
  {
    name: "Mon",
    periods: [
      { subject: "Mathematics", class: "JSS 1", teacher: "Mr. Adeyemi", start: 0, duration: 1, color: PURPLE, bg: "rgba(168,85,247,0.1)" },
      { subject: "English", class: "JSS 2", teacher: "Mrs. Okafor", start: 2, duration: 1, color: CYAN, bg: "rgba(6,182,212,0.1)" },
      { subject: "Social Studies", class: "SSS 1", teacher: "Mr. Bello", start: 4, duration: 1, color: AMBER, bg: "rgba(245,158,11,0.1)" },
    ],
  },
  {
    name: "Tue",
    periods: [
      { subject: "Science", class: "JSS 3", teacher: "Mr. Chukwu", start: 1, duration: 1, color: GREEN, bg: "rgba(16,185,129,0.1)" },
      { subject: "Civic Education", class: "SSS 2", teacher: "Mrs. Eze", start: 3, duration: 1, color: PINK, bg: "rgba(236,72,153,0.1)" },
      { subject: "Physical Ed", class: "JSS 1", teacher: "Mr. Lawal", start: 5, duration: 1, color: RED, bg: "rgba(239,68,68,0.1)" },
    ],
  },
  {
    name: "Wed",
    periods: [
      { subject: "English", class: "SSS 3", teacher: "Mrs. Okafor", start: 0, duration: 1, color: CYAN, bg: "rgba(6,182,212,0.1)" },
      { subject: "Mathematics", class: "SSS 2", teacher: "Mr. Adeyemi", start: 2, duration: 1, color: PURPLE, bg: "rgba(168,85,247,0.1)" },
      { subject: "Science", class: "JSS 2", teacher: "Mr. Chukwu", start: 4, duration: 1, color: GREEN, bg: "rgba(16,185,129,0.1)" },
    ],
  },
  {
    name: "Thu",
    periods: [
      { subject: "Social Studies", class: "JSS 1", teacher: "Mr. Bello", start: 1, duration: 1, color: AMBER, bg: "rgba(245,158,11,0.1)" },
      { subject: "Mathematics", class: "JSS 3", teacher: "Mr. Adeyemi", start: 3, duration: 1, color: PURPLE, bg: "rgba(168,85,247,0.1)" },
      { subject: "English", class: "SSS 1", teacher: "Mrs. Okafor", start: 5, duration: 1, color: CYAN, bg: "rgba(6,182,212,0.1)" },
    ],
  },
  {
    name: "Fri",
    periods: [
      { subject: "Science", class: "SSS 1", teacher: "Mr. Chukwu", start: 0, duration: 1, color: GREEN, bg: "rgba(16,185,129,0.1)" },
      { subject: "Civic Education", class: "SSS 3", teacher: "Mrs. Eze", start: 2, duration: 1, color: PINK, bg: "rgba(236,72,153,0.1)" },
      { subject: "Physical Ed", class: "SSS 2", teacher: "Mr. Lawal", start: 4, duration: 1, color: RED, bg: "rgba(239,68,68,0.1)" },
    ],
  },
]

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"]
const START_HOUR = 8

const subjects = [
  { name: "Mathematics", color: PURPLE, slots: 4 },
  { name: "English", color: CYAN, slots: 4 },
  { name: "Science", color: GREEN, slots: 3 },
  { name: "Social Studies", color: AMBER, slots: 3 },
  { name: "Civic Education", color: PINK, slots: 2 },
  { name: "Physical Ed", color: RED, slots: 2 },
]

const weekDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const SLOT_HEIGHT = 72 // px per hour slot

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const dateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const inputDateToDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(date.getDate() + days)
  return next
}

const addMonths = (date: Date, months: number) => {
  const next = new Date(date)
  next.setMonth(date.getMonth() + months, 1)
  return next
}

const getMonday = (date: Date) => {
  const cleanDate = startOfDay(date)
  const day = cleanDate.getDay()
  const diff = day === 0 ? -6 : 1 - day
  return addDays(cleanDate, diff)
}

const formatMonth = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "long", year: "numeric" })

const formatWeekTitle = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })

const formatSelectedDate = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })

const formatDetailsDate = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" })

const periodEndTime = (start: number, duration: number) => {
  const endHour = START_HOUR + start + duration
  const hour12 = endHour > 12 ? endHour - 12 : endHour
  const suffix = endHour >= 12 ? "PM" : "AM"
  return `${hour12}:00 ${suffix}`
}

const buildCalendarWeeks = (monthDate: Date) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1
  const cells: (Date | null)[] = [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7))
}

type TimeTableProps = {
  darkMode: boolean
}

export default function TimeTable({ darkMode }: TimeTableProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [activeSubject, setActiveSubject] = useState("All")
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))
  const [visibleMonth, setVisibleMonth] = useState(() => startOfDay(new Date()))
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addPeriodError, setAddPeriodError] = useState("")
  const [customPeriods, setCustomPeriods] = useState<ScheduledPeriod[]>([])
  const [deletedPeriodKeys, setDeletedPeriodKeys] = useState<string[]>([])
  const [selectedPeriodDetails, setSelectedPeriodDetails] = useState<SelectedPeriod | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const selectedWeekStart = useMemo(() => getMonday(selectedDate), [selectedDate])
  const visibleCalendarWeeks = useMemo(() => buildCalendarWeeks(visibleMonth), [visibleMonth])
  const displayedWeek = useMemo(
    () =>
      weekDayNames.map((name, index) => ({
        name,
        date: addDays(selectedWeekStart, index),
        periods: [
          ...(weekData[index]?.periods ?? []).map((period, periodIndex) => ({
            ...period,
            sourceKey: `seed-${index}-${periodIndex}`,
          })),
          ...customPeriods
            .filter((period) => period.dateKey === dateKey(addDays(selectedWeekStart, index)))
            .map((period) => ({
              ...period,
              sourceKey: `custom-${period.id}`,
            })),
        ].filter((period) => !deletedPeriodKeys.includes(period.sourceKey)),
      })),
    [customPeriods, deletedPeriodKeys, selectedWeekStart],
  )
  const weekEnd = addDays(selectedWeekStart, 6)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const timetableStart = START_HOUR * 60
  const timetableEnd = timetableStart + timeSlots.length * 60
  const nowTop =
    currentMinutes >= timetableStart && currentMinutes <= timetableEnd
      ? ((currentMinutes - timetableStart) / 60) * SLOT_HEIGHT
      : null

  const bg = darkMode ? "#0f0f1a" : "#f1f5f9"
  const card = darkMode ? "#1c1c30" : "#ffffff"
  const brd = darkMode ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx = darkMode ? "#e2e8f0" : "#0f172a"
  const mt = darkMode ? "#64748b" : "#64748b"
  const sub = darkMode ? "#334155" : "#f8fafc"
  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc"

  const filters = ["All", "JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"]
  const classOptions = filters.filter((filter) => filter !== "All")

  const filterPeriods = <T extends Period>(periods: T[]) => {
    return periods.filter((p) => {
      const matchesClass = activeFilter === "All" || p.class === activeFilter
      const matchesSubject = activeSubject === "All" || p.subject === activeSubject
      return matchesClass && matchesSubject
    })
  }

  const selectDate = (date: Date) => {
    const cleanDate = startOfDay(date)
    setSelectedDate(cleanDate)
    setVisibleMonth(cleanDate)
  }

  const getPeriodsForDate = (date: Date) => {
    const day = date.getDay()
    const index = day === 0 ? 6 : day - 1
    return [
      ...(weekData[index]?.periods ?? []).map((period, periodIndex) => ({
        ...period,
        sourceKey: `seed-${index}-${periodIndex}`,
      })),
      ...customPeriods
        .filter((period) => period.dateKey === dateKey(date))
        .map((period) => ({
          ...period,
          sourceKey: `custom-${period.id}`,
        })),
    ].filter((period) => !deletedPeriodKeys.includes(period.sourceKey))
  }

  const handleSavePeriod = (period: NewPeriodInput) => {
    const periodDate = inputDateToDate(period.date)
    const subjectTheme = subjects.find((subject) => subject.name.toLowerCase() === period.subject.toLowerCase())
    const color = subjectTheme?.color ?? PURPLE
    const duration = period.end - period.start
    const hasClassConflict = getPeriodsForDate(periodDate).some(
      (existingPeriod) =>
        existingPeriod.class === period.className &&
        period.start < existingPeriod.start + existingPeriod.duration &&
        existingPeriod.start < period.end,
    )

    if (hasClassConflict) {
      setAddPeriodError("This class already has a period during the selected time.")
      return
    }

    setCustomPeriods((current) => [
      ...current,
      {
        id: Date.now(),
        dateKey: dateKey(periodDate),
        subject: period.subject,
        class: period.className,
        teacher: period.teacher,
        start: period.start,
        duration,
        color,
        bg: subjectTheme ? `${color}1a` : "rgba(168,85,247,0.1)",
      },
    ])
    selectDate(periodDate)
    setAddPeriodError("")
    setIsAddModalOpen(false)
  }

  const handleDeleteSelectedPeriod = () => {
    if (!selectedPeriodDetails) return

    setDeletedPeriodKeys((current) => [...current, selectedPeriodDetails.sourceKey])
    if (selectedPeriodDetails.id) {
      setCustomPeriods((current) => current.filter((period) => period.id !== selectedPeriodDetails.id))
    }
    setSelectedPeriodDetails(null)
  }

  return (
    <main
      style={{
        flex: 1,
        background: bg,
        minHeight: "100vh",
        padding: "1.5rem",
        overflowY: "auto",
        display: "flex",
        gap: 12,
      }}
    >
      {/* LEFT SIDEBAR */}
      <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Mini Calendar */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: tx }}>{formatMonth(visibleMonth)}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { icon: "ti-chevron-left", action: () => setVisibleMonth((date) => addMonths(date, -1)) },
                { icon: "ti-chevron-right", action: () => setVisibleMonth((date) => addMonths(date, 1)) },
              ].map((btn) => (
                <button
                  key={btn.icon}
                  onClick={btn.action}
                  style={{
                    width: 26, height: 26, borderRadius: 6,
                    border: `0.5px solid ${brd}`,
                    background: "transparent",
                    color: mt, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <i className={`ti ${btn.icon}`} style={{ fontSize: 13 }} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d} style={{ fontSize: 10, color: mt, textAlign: "center", fontWeight: 500, padding: "2px 0" }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          {visibleCalendarWeeks.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {week.map((day, di) => {
                const isToday = !!day && sameDay(day, now)
                const isSelected = !!day && sameDay(day, selectedDate)
                const isWeekDay =
                  !!day &&
                  day >= selectedWeekStart &&
                  day <= weekEnd
                return (
                  <div
                    key={di}
                    onClick={() => day && selectDate(day)}
                    style={{
                      height: 28,
                      borderRadius: 6,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: day ? "pointer" : "default",
                      background: isSelected
                        ? PURPLE
                        : isToday
                        ? "rgba(239,68,68,0.16)"
                        : isWeekDay
                        ? "rgba(168,85,247,0.07)"
                        : "transparent",
                      color: isSelected
                        ? "#fff"
                        : isToday
                        ? RED
                        : day
                        ? tx
                        : "transparent",
                      fontWeight: isToday || isSelected ? 600 : 400,
                    }}
                  >
                    {day?.getDate() ?? ""}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Filter by class */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <i className="ti ti-filter" style={{ fontSize: 15, color: PURPLE }} aria-hidden="true" />
            <span style={{ fontSize: 13, fontWeight: 600, color: tx }}>Filter by class</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {filters.map((f) => {
              const isSSS = f.startsWith("SSS")
              const active = activeFilter === f
              return (
                <div
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    border: `0.5px solid ${active ? (isSSS ? "rgba(236,72,153,0.4)" : "rgba(168,85,247,0.4)") : brd}`,
                    background: active
                      ? isSSS
                        ? "rgba(236,72,153,0.12)"
                        : "rgba(168,85,247,0.12)"
                      : inputBg,
                    color: active ? (isSSS ? PINK : PURPLE) : mt,
                    transition: "all 0.15s",
                  }}
                >
                  {f}
                </div>
              )
            })}
          </div>
        </div>

        {/* Subject legend */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <i className="ti ti-palette" style={{ fontSize: 15, color: CYAN }} aria-hidden="true" />
            <span style={{ fontSize: 13, fontWeight: 600, color: tx }}>Subjects</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveSubject("All")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              marginBottom: 4,
              borderRadius: 8,
              border: `0.5px solid ${activeSubject === "All" ? "rgba(168,85,247,0.4)" : brd}`,
              background: activeSubject === "All" ? "rgba(168,85,247,0.12)" : "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <i className="ti ti-layout-grid" style={{ fontSize: 13, color: activeSubject === "All" ? PURPLE : mt }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: activeSubject === "All" ? PURPLE : tx, flex: 1, fontWeight: activeSubject === "All" ? 600 : 400 }}>
              All subjects
            </span>
          </button>
          {subjects.map((s) => (
            <button
              type="button"
              key={s.name}
              onClick={() => setActiveSubject((current) => (current === s.name ? "All" : s.name))}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 8,
                border: `0.5px solid ${activeSubject === s.name ? `${s.color}66` : "transparent"}`,
                borderTop: activeSubject === s.name ? `0.5px solid ${s.color}66` : `0.5px solid ${brd}`,
                background: activeSubject === s.name ? `${s.color}1a` : "transparent",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  width: 9, height: 9, borderRadius: "50%",
                  background: s.color, flexShrink: 0,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 12, color: activeSubject === s.name ? s.color : tx, flex: 1, fontWeight: activeSubject === s.name ? 600 : 400 }}>
                {s.name}
              </span>
              <span style={{ fontSize: 11, color: activeSubject === s.name ? s.color : mt }}>{s.slots} slots/wk</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>

        {/* Top bar */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            padding: "0.85rem 1.1rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <i className="ti ti-layout-grid" style={{ fontSize: 18, color: PURPLE }} aria-hidden="true" />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: tx, flex: 1 }}>
            Time Table - Week of {formatWeekTitle(selectedWeekStart)}
          </h2>
          <div
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              background: "rgba(168,85,247,0.12)",
              color: PURPLE,
              border: "0.5px solid rgba(168,85,247,0.28)",
              whiteSpace: "nowrap",
            }}
          >
            {formatSelectedDate(selectedDate)}
          </div>
          {[
            { label: "Prev", action: () => selectDate(addDays(selectedDate, -7)) },
            {
              label: "Today",
              action: () => {
                selectDate(new Date())
              },
            },
            { label: "Next", action: () => selectDate(addDays(selectedDate, 7)) },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                border: `0.5px solid ${brd}`,
                background: inputBg,
                color: mt,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {btn.label === "Prev" && <i className="ti ti-chevron-left" style={{ fontSize: 12 }} aria-hidden="true" />}
              {btn.label}
              {btn.label === "Next" && <i className="ti ti-chevron-right" style={{ fontSize: 12 }} aria-hidden="true" />}
            </button>
          ))}
          <button
            onClick={() => {
              setAddPeriodError("")
              setIsAddModalOpen(true)
            }}
            style={{
              padding: "5px 16px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" />
            Add period
          </button>
        </div>

        {/* Timetable grid */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Day headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px repeat(7, 1fr)",
            }}
          >
            <div
              style={{
                padding: "10px 8px",
                textAlign: "center",
                background: darkMode ? "rgba(255,255,255,0.03)" : sub,
                borderBottom: `0.5px solid ${brd}`,
                borderRight: `0.5px solid ${brd}`,
              }}
            >
              <span style={{ fontSize: 10, color: mt, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Time
              </span>
            </div>
            {displayedWeek.map((day) => {
              const isToday = sameDay(day.date, now)
              const isSelected = sameDay(day.date, selectedDate)
              return (
                <div
                  key={day.date.toISOString()}
                  style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    background: isSelected
                      ? "rgba(168,85,247,0.08)"
                      : darkMode
                      ? "rgba(255,255,255,0.03)"
                      : sub,
                    borderBottom: `0.5px solid ${brd}`,
                    borderRight: `0.5px solid ${brd}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: isSelected ? PURPLE : mt,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {day.name}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      lineHeight: 1.2,
                      marginTop: 4,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: isSelected ? PURPLE : isToday ? RED : "transparent",
                      color: isSelected || isToday ? "#fff" : tx,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "4px auto 0",
                      fontSize: isSelected || isToday ? 13 : 20,
                      boxShadow: isSelected ? "0 0 0 3px rgba(168,85,247,0.14)" : "none",
                    }}
                  >
                    {day.date.getDate()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time slots + period cells */}
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)" }}>
            {/* Time labels column */}
            <div style={{ borderRight: `0.5px solid ${brd}` }}>
              {timeSlots.map((t) => (
                <div
                  key={t}
                  style={{
                    height: SLOT_HEIGHT,
                    borderBottom: `0.5px solid ${brd}`,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    padding: "6px 8px 0",
                    fontSize: 10,
                    color: mt,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {displayedWeek.map((day) => (
              <div
                key={day.date.toISOString()}
                style={{
                  position: "relative",
                  borderRight: `0.5px solid ${brd}`,
                  height: SLOT_HEIGHT * timeSlots.length,
                }}
              >
                {/* Empty row dividers */}
                {timeSlots.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: i * SLOT_HEIGHT,
                      left: 0, right: 0,
                      height: SLOT_HEIGHT,
                      borderBottom: i < timeSlots.length - 1 ? `0.5px solid ${brd}` : "none",
                    }}
                  />
                ))}

                {/* Live "now" indicator for the real current day */}
                {sameDay(day.date, now) && nowTop !== null && (
                  <div
                    style={{
                      position: "absolute",
                      top: nowTop,
                      left: 0, right: 0,
                      height: 1.5,
                      background: RED,
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: -4, top: -3,
                        width: 8, height: 8,
                        borderRadius: "50%",
                        background: RED,
                      }}
                    />
                  </div>
                )}

                {/* Periods */}
                {filterPeriods(day.periods).map((p) => (
                  <div
                    key={p.sourceKey}
                    onClick={() => setSelectedPeriodDetails({ ...p, date: day.date })}
                    style={{
                      position: "absolute",
                      top: p.start * SLOT_HEIGHT + 4,
                      left: 4, right: 4,
                      height: p.duration * SLOT_HEIGHT - 8,
                      borderRadius: 8,
                      background: p.bg,
                      borderLeft: `3px solid ${p.color}`,
                      padding: "6px 8px",
                      cursor: "pointer",
                      overflow: "hidden",
                      zIndex: 5,
                      transition: "opacity 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: p.color, lineHeight: 1.3 }}>
                      {p.subject}
                    </div>
                    <div style={{ fontSize: 10, color: p.color, opacity: 0.75, marginTop: 2 }}>
                      {p.class} · {p.teacher}
                    </div>
                    <div style={{ fontSize: 10, color: p.color, opacity: 0.6, marginTop: 3 }}>
                      {timeSlots[p.start]} - {timeSlots[p.start + p.duration] ?? periodEndTime(p.start, p.duration)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom status bar */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            padding: "0.85rem 1.1rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <i className="ti ti-info-circle" style={{ fontSize: 16, color: mt }} aria-hidden="true" />
          <span style={{ fontSize: 12, color: mt }}>
            {displayedWeek.reduce((total, day) => total + filterPeriods(day.periods).length, 0)} periods shown this week across 6 classes · First Term · 2024 / 2025
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {[
              { icon: "ti-download", label: "Export" },
              { icon: "ti-printer", label: "Print" },
            ].map((btn) => (
              <button
                key={btn.label}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: `0.5px solid ${brd}`,
                  background: inputBg,
                  color: mt,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <i className={`ti ${btn.icon}`} style={{ fontSize: 13 }} aria-hidden="true" />
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isAddModalOpen && (
        <AddPeriodModal
          darkMode={darkMode}
          initialDate={dateKey(selectedDate)}
          subjectOptions={subjects.map((subject) => subject.name)}
          classOptions={classOptions}
          timeSlots={timeSlots}
          error={addPeriodError}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSavePeriod}
        />
      )}
      {selectedPeriodDetails && (
        <PeriodDetailsModal
          darkMode={darkMode}
          subject={selectedPeriodDetails.subject}
          className={selectedPeriodDetails.class}
          teacher={selectedPeriodDetails.teacher}
          date={formatDetailsDate(selectedPeriodDetails.date)}
          time={`${timeSlots[selectedPeriodDetails.start]} - ${
            timeSlots[selectedPeriodDetails.start + selectedPeriodDetails.duration] ??
            periodEndTime(selectedPeriodDetails.start, selectedPeriodDetails.duration)
          }`}
          color={selectedPeriodDetails.color}
          onClose={() => setSelectedPeriodDetails(null)}
          onDelete={handleDeleteSelectedPeriod}
        />
      )}
    </main>
  )
}
