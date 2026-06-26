import { useState } from "react"

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
  date: number
  periods: Period[]
}

const PURPLE = "#a855f7"
const PINK = "#ec4899"
const CYAN = "#06b6d4"
const GREEN = "#10b981"
const AMBER = "#f59e0b"
const RED = "#ef4444"

const weekData: DayData[] = [
  {
    name: "Mon", date: 23,
    periods: [
      { subject: "Mathematics", class: "JSS 1", teacher: "Mr. Adeyemi", start: 0, duration: 1, color: PURPLE, bg: "rgba(168,85,247,0.1)" },
      { subject: "English", class: "JSS 2", teacher: "Mrs. Okafor", start: 2, duration: 1, color: CYAN, bg: "rgba(6,182,212,0.1)" },
      { subject: "Social Studies", class: "SSS 1", teacher: "Mr. Bello", start: 4, duration: 1, color: AMBER, bg: "rgba(245,158,11,0.1)" },
    ],
  },
  {
    name: "Tue", date: 24,
    periods: [
      { subject: "Science", class: "JSS 3", teacher: "Mr. Chukwu", start: 1, duration: 1, color: GREEN, bg: "rgba(16,185,129,0.1)" },
      { subject: "Civic Education", class: "SSS 2", teacher: "Mrs. Eze", start: 3, duration: 1, color: PINK, bg: "rgba(236,72,153,0.1)" },
      { subject: "Physical Ed", class: "JSS 1", teacher: "Mr. Lawal", start: 5, duration: 1, color: RED, bg: "rgba(239,68,68,0.1)" },
    ],
  },
  {
    name: "Wed", date: 25,
    periods: [
      { subject: "English", class: "SSS 3", teacher: "Mrs. Okafor", start: 0, duration: 1, color: CYAN, bg: "rgba(6,182,212,0.1)" },
      { subject: "Mathematics", class: "SSS 2", teacher: "Mr. Adeyemi", start: 2, duration: 1, color: PURPLE, bg: "rgba(168,85,247,0.1)" },
      { subject: "Science", class: "JSS 2", teacher: "Mr. Chukwu", start: 4, duration: 1, color: GREEN, bg: "rgba(16,185,129,0.1)" },
    ],
  },
  {
    name: "Thu", date: 26,
    periods: [
      { subject: "Social Studies", class: "JSS 1", teacher: "Mr. Bello", start: 1, duration: 1, color: AMBER, bg: "rgba(245,158,11,0.1)" },
      { subject: "Mathematics", class: "JSS 3", teacher: "Mr. Adeyemi", start: 3, duration: 1, color: PURPLE, bg: "rgba(168,85,247,0.1)" },
      { subject: "English", class: "SSS 1", teacher: "Mrs. Okafor", start: 5, duration: 1, color: CYAN, bg: "rgba(6,182,212,0.1)" },
    ],
  },
  {
    name: "Fri", date: 27,
    periods: [
      { subject: "Science", class: "SSS 1", teacher: "Mr. Chukwu", start: 0, duration: 1, color: GREEN, bg: "rgba(16,185,129,0.1)" },
      { subject: "Civic Education", class: "SSS 3", teacher: "Mrs. Eze", start: 2, duration: 1, color: PINK, bg: "rgba(236,72,153,0.1)" },
      { subject: "Physical Ed", class: "SSS 2", teacher: "Mr. Lawal", start: 4, duration: 1, color: RED, bg: "rgba(239,68,68,0.1)" },
    ],
  },
]

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"]

const subjects = [
  { name: "Mathematics", color: PURPLE, slots: 4 },
  { name: "English", color: CYAN, slots: 4 },
  { name: "Science", color: GREEN, slots: 3 },
  { name: "Social Studies", color: AMBER, slots: 3 },
  { name: "Civic Education", color: PINK, slots: 2 },
  { name: "Physical Ed", color: RED, slots: 2 },
]

const calDays = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, null, null, null, null, null, null],
]

const SLOT_HEIGHT = 72 // px per hour slot

type TimeTableProps = {
  darkMode: boolean
}

export default function TimeTable({ darkMode }: TimeTableProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedDay, setSelectedDay] = useState(26)

  const bg = darkMode ? "#0f0f1a" : "#f1f5f9"
  const card = darkMode ? "#1c1c30" : "#ffffff"
  const brd = darkMode ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx = darkMode ? "#e2e8f0" : "#0f172a"
  const mt = darkMode ? "#64748b" : "#64748b"
  const sub = darkMode ? "#334155" : "#f8fafc"
  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc"

  const filters = ["All", "JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"]

  const filterPeriods = (periods: Period[]) => {
    if (activeFilter === "All") return periods
    return periods.filter((p) => p.class === activeFilter)
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
            <span style={{ fontSize: 13, fontWeight: 600, color: tx }}>June 2026</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["ti-chevron-left", "ti-chevron-right"].map((ic) => (
                <button
                  key={ic}
                  style={{
                    width: 26, height: 26, borderRadius: 6,
                    border: `0.5px solid ${brd}`,
                    background: "transparent",
                    color: mt, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <i className={`ti ${ic}`} style={{ fontSize: 13 }} aria-hidden="true" />
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
          {calDays.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {week.map((day, di) => {
                const isToday = day === 26
                const isSelected = day === selectedDay
                const isWeekDay = [23, 24, 25, 26, 27].includes(day ?? 0)
                return (
                  <div
                    key={di}
                    onClick={() => day && setSelectedDay(day)}
                    style={{
                      height: 28,
                      borderRadius: 6,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: day ? "pointer" : "default",
                      background: isToday
                        ? PURPLE
                        : isSelected && !isToday
                        ? "rgba(168,85,247,0.15)"
                        : isWeekDay
                        ? "rgba(168,85,247,0.07)"
                        : "transparent",
                      color: isToday
                        ? "#fff"
                        : isSelected
                        ? PURPLE
                        : day
                        ? tx
                        : "transparent",
                      fontWeight: isToday ? 600 : 400,
                    }}
                  >
                    {day ?? ""}
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
              const isJSS = f.startsWith("JSS")
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
          {subjects.map((s) => (
            <div
              key={s.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0",
                borderTop: `0.5px solid ${brd}`,
              }}
            >
              <span
                style={{
                  width: 9, height: 9, borderRadius: "50%",
                  background: s.color, flexShrink: 0,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 12, color: tx, flex: 1 }}>{s.name}</span>
              <span style={{ fontSize: 11, color: mt }}>{s.slots} slots/wk</span>
            </div>
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
            Time Table — Week of Jun 23, 2026
          </h2>
          {["Prev", "Today", "Next"].map((label) => (
            <button
              key={label}
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
              {label === "Prev" && <i className="ti ti-chevron-left" style={{ fontSize: 12 }} aria-hidden="true" />}
              {label}
              {label === "Next" && <i className="ti ti-chevron-right" style={{ fontSize: 12 }} aria-hidden="true" />}
            </button>
          ))}
          <button
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
              gridTemplateColumns: "60px repeat(5, 1fr)",
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
            {weekData.map((day) => {
              const isToday = day.date === 26
              return (
                <div
                  key={day.name}
                  style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    background: darkMode ? "rgba(255,255,255,0.03)" : sub,
                    borderBottom: `0.5px solid ${brd}`,
                    borderRight: `0.5px solid ${brd}`,
                  }}
                >
                  <div style={{ fontSize: 10, color: mt, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {day.name}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      marginTop: 4,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: isToday ? PURPLE : "transparent",
                      color: isToday ? "#fff" : tx,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "4px auto 0",
                      fontSize: isToday ? 13 : 20,
                    }}
                  >
                    {day.date}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time slots + period cells */}
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)" }}>
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
            {weekData.map((day) => (
              <div
                key={day.name}
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

                {/* "Now" indicator on Thursday (today) */}
                {day.date === 26 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 3 * SLOT_HEIGHT + 20,
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
                {filterPeriods(day.periods).map((p, pi) => (
                  <div
                    key={pi}
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
                      {timeSlots[p.start]} – {timeSlots[p.start + p.duration]}
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
            26 periods scheduled this week across 6 classes · First Term · 2024 / 2025
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
    </main>
  )
}