import { useEffect, useMemo, useState } from "react"
import AddPeriodModal, { type NewPeriodInput } from "../../components/AddPeriodModal"
import PeriodDetailsModal from "../../components/PeriodDetailsModal"
import {
  getClasses,
  getPeriods,
  createPeriod,
  deletePeriod,
  getErrorMessage,
  type ClassType,
  type PeriodType,
} from "../../api/adminApi"

type DisplayPeriod = {
  periodId: string
  classId: string
  name: string   // class.name
  grade: string  // class.class
  teacher: string
  type: ClassType["type"]
  start: number
  duration: number
  color: string
  bg: string
}

type SelectedPeriod = DisplayPeriod & { date: Date }

const PURPLE = "#a855f7"
const CYAN = "#06b6d4"
const GREEN = "#10b981"
const RED = "#ef4444"

// Color is now driven by class TYPE, not by subject
const TYPE_COLORS: Record<ClassType["type"], string> = {
  Theory: PURPLE,
  Revision: CYAN,
  Practical: GREEN,
}

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"]
const START_HOUR = 8
const weekDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const SLOT_HEIGHT = 72

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

const toDisplayPeriod = (period: PeriodType): DisplayPeriod => {
  const color = TYPE_COLORS[period.class.type] ?? PURPLE
  return {
    periodId: period._id,
    classId: period.class._id,
    name: period.class.name,
    grade: period.class.class,
    teacher: period.class.teacher,
    type: period.class.type,
    start: period.start,
    duration: period.end - period.start,
    color,
    bg: `${color}1a`,
  }
}

type TimeTableProps = {
  darkMode: boolean
}

export default function TimeTable({ darkMode }: TimeTableProps) {
  const [activeGrade, setActiveGrade] = useState("All")
  const [activeType, setActiveType] = useState<"All" | ClassType["type"]>("All")
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))
  const [visibleMonth, setVisibleMonth] = useState(() => startOfDay(new Date()))
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addPeriodError, setAddPeriodError] = useState("")
  const [selectedPeriodDetails, setSelectedPeriodDetails] = useState<SelectedPeriod | null>(null)

  const [classes, setClasses] = useState<ClassType[]>([])
  const [periods, setPeriods] = useState<PeriodType[]>([])
  const [loadingPeriods, setLoadingPeriods] = useState(true)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  // Load classes once - used for the sidebar filter, the type legend and the Add Period dropdown
  useEffect(() => {
    (async () => {
      try {
        const data = await getClasses()
        setClasses(data.classes)
      } catch (err) {
        setPageError(getErrorMessage(err))
      }
    })()
  }, [])

  const selectedWeekStart = useMemo(() => getMonday(selectedDate), [selectedDate])
  const weekEnd = addDays(selectedWeekStart, 6)
  const visibleCalendarWeeks = useMemo(() => buildCalendarWeeks(visibleMonth), [visibleMonth])

  // Refetch periods whenever the displayed week changes
  useEffect(() => {
    (async () => {
      setLoadingPeriods(true)
      try {
        const data = await getPeriods(dateKey(selectedWeekStart), dateKey(weekEnd))
        setPeriods(data.periods)
      } catch (err) {
        setPageError(getErrorMessage(err))
      } finally {
        setLoadingPeriods(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeekStart])

  const displayedWeek = useMemo(
    () =>
      weekDayNames.map((name, index) => {
        const date = addDays(selectedWeekStart, index)
        const dayPeriods = periods
          .filter((p) => {
            if (p.recurring) {
              return p.dayOfWeek === index
            } else {
              return p.date && dateKey(new Date(p.date)) === dateKey(date)
            }
          })
          .map(toDisplayPeriod)
        return { name, date, periods: dayPeriods }
      }),
    [periods, selectedWeekStart],
  )

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

  // Filter options built from real classes in the DB
  const gradeOptions = useMemo(
    () => ["All", ...Array.from(new Set(classes.map((c) => c.name).filter(Boolean))).sort()],
    [classes],
  )

  const typeOptions: ClassType["type"][] = ["Theory", "Revision", "Practical"]

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { Theory: 0, Revision: 0, Practical: 0 }
    displayedWeek.forEach((day) =>
      day.periods.forEach((p) => {
        counts[p.type] = (counts[p.type] ?? 0) + 1
      }),
    )
    return counts
  }, [displayedWeek])

  const filterPeriods = (list: DisplayPeriod[]) =>
    list.filter((p) => {
      const matchesGrade = activeGrade === "All" || p.name === activeGrade
      const matchesType = activeType === "All" || p.type === activeType
      return matchesGrade && matchesType
    })

  const selectDate = (date: Date) => {
    const cleanDate = startOfDay(date)
    setSelectedDate(cleanDate)
    setVisibleMonth(cleanDate)
  }

  const handleSavePeriod = async (period: NewPeriodInput) => {
    try {
      await createPeriod(period)
      setAddPeriodError("")
      setIsAddModalOpen(false)
      if (period.date) {
        selectDate(inputDateToDate(period.date))
      }
      // refetch so the new period shows up immediately
      const data = await getPeriods(dateKey(selectedWeekStart), dateKey(weekEnd))
      setPeriods(data.periods)
    } catch (err) {
      setAddPeriodError(getErrorMessage(err))
    }
  }

  const handleDeleteSelectedPeriod = async () => {
    if (!selectedPeriodDetails) return
    try {
      await deletePeriod(selectedPeriodDetails.periodId)
      setPeriods((current) => current.filter((p) => p._id !== selectedPeriodDetails.periodId))
      setSelectedPeriodDetails(null)
    } catch (err) {
      alert(getErrorMessage(err))
    }
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
        <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, padding: "1rem" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d} style={{ fontSize: 10, color: mt, textAlign: "center", fontWeight: 500, padding: "2px 0" }}>{d}</div>
            ))}
          </div>

          {visibleCalendarWeeks.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {week.map((day, di) => {
                const isToday = !!day && sameDay(day, now)
                const isSelected = !!day && sameDay(day, selectedDate)
                const isWeekDay = !!day && day >= selectedWeekStart && day <= weekEnd
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
                      color: isSelected ? "#fff" : isToday ? RED : day ? tx : "transparent",
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

        {/* Filter by class (grade) - built from real DB classes */}
        <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <i className="ti ti-filter" style={{ fontSize: 15, color: PURPLE }} aria-hidden="true" />
            <span style={{ fontSize: 13, fontWeight: 600, color: tx }}>Filter by class</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {gradeOptions.map((g) => {
              const active = activeGrade === g
              return (
                <div
                  key={g}
                  onClick={() => setActiveGrade(g)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    border: `0.5px solid ${active ? "rgba(168,85,247,0.4)" : brd}`,
                    background: active ? "rgba(168,85,247,0.12)" : inputBg,
                    color: active ? PURPLE : mt,
                    transition: "all 0.15s",
                  }}
                >
                  {g}
                </div>
              )
            })}
          </div>
        </div>

        {/* Type legend/filter - replaces the old subject legend */}
        <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <i className="ti ti-palette" style={{ fontSize: 15, color: CYAN }} aria-hidden="true" />
            <span style={{ fontSize: 13, fontWeight: 600, color: tx }}>Type</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveType("All")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              marginBottom: 4,
              borderRadius: 8,
              border: `0.5px solid ${activeType === "All" ? "rgba(168,85,247,0.4)" : brd}`,
              background: activeType === "All" ? "rgba(168,85,247,0.12)" : "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <i className="ti ti-layout-grid" style={{ fontSize: 13, color: activeType === "All" ? PURPLE : mt }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: activeType === "All" ? PURPLE : tx, flex: 1, fontWeight: activeType === "All" ? 600 : 400 }}>
              All types
            </span>
          </button>
          {typeOptions.map((t) => {
            const color = TYPE_COLORS[t]
            const active = activeType === t
            return (
              <button
                type="button"
                key={t}
                onClick={() => setActiveType((current) => (current === t ? "All" : t))}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: `0.5px solid ${active ? `${color}66` : "transparent"}`,
                  borderTop: active ? `0.5px solid ${color}66` : `0.5px solid ${brd}`,
                  background: active ? `${color}1a` : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
                <span style={{ fontSize: 12, color: active ? color : tx, flex: 1, fontWeight: active ? 600 : 400 }}>{t}</span>
                <span style={{ fontSize: 11, color: active ? color : mt }}>{typeCounts[t] ?? 0} this wk</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>

        {pageError && (
          <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
            {pageError}
          </div>
        )}

        {/* Top bar */}
        <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, padding: "0.85rem 1.1rem", display: "flex", alignItems: "center", gap: 10 }}>
          <i className="ti ti-layout-grid" style={{ fontSize: 18, color: PURPLE }} aria-hidden="true" />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: tx, flex: 1 }}>
            Time Table - Week of {formatWeekTitle(selectedWeekStart)}
          </h2>
          <div style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: "rgba(168,85,247,0.12)", color: PURPLE, border: "0.5px solid rgba(168,85,247,0.28)", whiteSpace: "nowrap" }}>
            {formatSelectedDate(selectedDate)}
          </div>
          {[
            { label: "Prev", action: () => selectDate(addDays(selectedDate, -7)) },
            { label: "Today", action: () => selectDate(new Date()) },
            { label: "Next", action: () => selectDate(addDays(selectedDate, 7)) },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `0.5px solid ${brd}`, background: inputBg, color: mt, display: "flex", alignItems: "center", gap: 4 }}
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
            style={{ padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}
          >
            <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" />
            Add period
          </button>
        </div>

        {/* Timetable grid */}
        <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)" }}>
            <div style={{ padding: "10px 8px", textAlign: "center", background: darkMode ? "rgba(255,255,255,0.03)" : sub, borderBottom: `0.5px solid ${brd}`, borderRight: `0.5px solid ${brd}` }}>
              <span style={{ fontSize: 10, color: mt, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Time</span>
            </div>
            {displayedWeek.map((day) => {
              const isToday = sameDay(day.date, now)
              const isSelected = sameDay(day.date, selectedDate)
              return (
                <div key={day.date.toISOString()} style={{ padding: "10px 8px", textAlign: "center", background: isSelected ? "rgba(168,85,247,0.08)" : darkMode ? "rgba(255,255,255,0.03)" : sub, borderBottom: `0.5px solid ${brd}`, borderRight: `0.5px solid ${brd}` }}>
                  <div style={{ fontSize: 10, color: isSelected ? PURPLE : mt, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {day.name}
                  </div>
                  <div style={{ fontWeight: 600, lineHeight: 1.2, marginTop: 4, width: 30, height: 30, borderRadius: "50%", background: isSelected ? PURPLE : isToday ? RED : "transparent", color: isSelected || isToday ? "#fff" : tx, display: "flex", alignItems: "center", justifyContent: "center", margin: "4px auto 0", fontSize: isSelected || isToday ? 13 : 20, boxShadow: isSelected ? "0 0 0 3px rgba(168,85,247,0.14)" : "none" }}>
                    {day.date.getDate()}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)" }}>
            <div style={{ borderRight: `0.5px solid ${brd}` }}>
              {timeSlots.map((t) => (
                <div key={t} style={{ height: SLOT_HEIGHT, borderBottom: `0.5px solid ${brd}`, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: "6px 8px 0", fontSize: 10, color: mt }}>
                  {t}
                </div>
              ))}
            </div>

            {displayedWeek.map((day) => (
              <div key={day.date.toISOString()} style={{ position: "relative", borderRight: `0.5px solid ${brd}`, height: SLOT_HEIGHT * timeSlots.length }}>
                {timeSlots.map((_, i) => (
                  <div key={i} style={{ position: "absolute", top: i * SLOT_HEIGHT, left: 0, right: 0, height: SLOT_HEIGHT, borderBottom: i < timeSlots.length - 1 ? `0.5px solid ${brd}` : "none" }} />
                ))}

                {sameDay(day.date, now) && nowTop !== null && (
                  <div style={{ position: "absolute", top: nowTop, left: 0, right: 0, height: 1.5, background: RED, zIndex: 10 }}>
                    <div style={{ position: "absolute", left: -4, top: -3, width: 8, height: 8, borderRadius: "50%", background: RED }} />
                  </div>
                )}

                {filterPeriods(day.periods).map((p) => (
                  <div
                    key={p.periodId}
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
                    <div style={{ fontSize: 11, fontWeight: 600, color: p.color, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: p.color, opacity: 0.75, marginTop: 2 }}>{p.type}</div>
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
        <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, padding: "0.85rem 1.1rem", display: "flex", alignItems: "center", gap: 10 }}>
          <i className="ti ti-info-circle" style={{ fontSize: 16, color: mt }} aria-hidden="true" />
          <span style={{ fontSize: 12, color: mt }}>
            {loadingPeriods
              ? "Loading periods..."
              : `${displayedWeek.reduce((total, day) => total + filterPeriods(day.periods).length, 0)} periods shown this week across ${classes.length} classes`}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {[
              { icon: "ti-download", label: "Export" },
              { icon: "ti-printer", label: "Print" },
            ].map((btn) => (
              <button key={btn.label} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer", border: `0.5px solid ${brd}`, background: inputBg, color: mt, display: "flex", alignItems: "center", gap: 4 }}>
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
          classes={classes}
          timeSlots={timeSlots}
          error={addPeriodError}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSavePeriod}
        />
      )}
      {selectedPeriodDetails && (
        <PeriodDetailsModal
          darkMode={darkMode}
          className={selectedPeriodDetails.name}    // Class name row එකට
          type={selectedPeriodDetails.type}         // Teacher row එකට තිබ්බ තැන Type එක දැන්
          date={formatDetailsDate(selectedPeriodDetails.date)}
          time={`${timeSlots[selectedPeriodDetails.start]} - ${timeSlots[selectedPeriodDetails.start + selectedPeriodDetails.duration] ??
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