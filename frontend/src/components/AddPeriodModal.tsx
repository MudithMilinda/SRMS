import { useEffect, useState, type FormEvent } from "react"
import type { ClassType } from "../api/adminApi"

export type NewPeriodInput = {
  classId: string
  start: number
  end: number
  recurring: boolean
  dayOfWeek?: number // 0=Mon...6=Sun, set when recurring
  date?: string       // set when NOT recurring
}

type AddPeriodModalProps = {
  darkMode: boolean
  initialDate: string
  classes: ClassType[]
  timeSlots: string[]
  error?: string
  onClose: () => void
  onSave: (period: NewPeriodInput) => void
}

const WEEKDAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function toMondayBasedDay(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  const jsDay = new Date(y, m - 1, d).getDay()
  return jsDay === 0 ? 6 : jsDay - 1
}

export default function AddPeriodModal({
  darkMode,
  initialDate,
  classes,
  timeSlots,
  error,
  onClose,
  onSave,
}: AddPeriodModalProps) {
  const [classId, setClassId] = useState(classes[0]?._id ?? "")
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(1)
  const [isOneTime, setIsOneTime] = useState(false)
  const [date, setDate] = useState(initialDate)

  useEffect(() => { setDate(initialDate) }, [initialDate])
  useEffect(() => { if (end <= start) setEnd(start + 1) }, [end, start])

  const selectedClass = classes.find((c) => c._id === classId)
  const impliedWeekday = WEEKDAY_LABELS[toMondayBasedDay(initialDate)]

  const card = darkMode ? "#1c1c30" : "#ffffff"
  const border = darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0"
  const text = darkMode ? "#e2e8f0" : "#0f172a"
  const muted = darkMode ? "#94a3b8" : "#64748b"
  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc"

  const inputStyle = {
    width: "100%", height: 38, borderRadius: 8, border: `0.5px solid ${border}`,
    background: inputBg, color: text, padding: "0 10px", fontSize: 13,
    outline: "none", boxSizing: "border-box" as const,
  }

  const labelStyle = { display: "grid", gap: 6, fontSize: 12, fontWeight: 500, color: muted }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!classId) return

    if (isOneTime) {
      if (!date) return
      onSave({ classId, start, end, recurring: false, date })
    } else {
      onSave({ classId, start, end, recurring: true, dayOfWeek: toMondayBasedDay(initialDate) })
    }
  }

  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby="add-period-title"
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,23,42,0.62)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onMouseDown={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        style={{ width: "min(440px, 100%)", background: card, border: `0.5px solid ${border}`, borderRadius: 12, boxShadow: "0 24px 80px rgba(0,0,0,0.35)", padding: 18, display: "grid", gap: 14 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(168,85,247,0.14)", color: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="ti ti-calendar-plus" style={{ fontSize: 18 }} aria-hidden="true" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 id="add-period-title" style={{ margin: 0, color: text, fontSize: 16, fontWeight: 600 }}>Add period</h3>
            <p style={{ margin: "2px 0 0", color: muted, fontSize: 12 }}>
              {isOneTime ? "One-time extra class for a specific date." : `Repeats weekly every ${impliedWeekday}.`}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: `0.5px solid ${border}`, background: "transparent", color: muted, cursor: "pointer" }}>
            <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
          </button>
        </div>

        <label style={labelStyle}>
          Class
          <select value={classId} onChange={(e) => setClassId(e.target.value)} style={inputStyle} required disabled={classes.length === 0}>
            {classes.length === 0 ? (
              <option value="">No classes available - add one first</option>
            ) : (
              classes.map((c) => (
                <option key={c._id} value={c._id}>{c.name} — {c.class} ({c.type})</option>
              ))
            )}
          </select>
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label style={labelStyle}>
            From
            <select value={start} onChange={(e) => { const v = Number(e.target.value); setStart(v); if (end <= v) setEnd(v + 1) }} style={inputStyle}>
              {timeSlots.slice(0, -1).map((slot, i) => (<option key={slot} value={i}>{slot}</option>))}
            </select>
          </label>
          <label style={labelStyle}>
            To
            <select value={end} onChange={(e) => setEnd(Number(e.target.value))} style={inputStyle}>
              {timeSlots.slice(1).map((slot, i) => {
                const value = i + 1
                return (<option key={slot} value={value} disabled={value <= start}>{slot}</option>)
              })}
            </select>
          </label>
        </div>

        {/* Type comes from the selected class - replaces the old teacher field */}
        <label style={labelStyle}>
          Type
          <input
            value={selectedClass?.type ?? ""}
            readOnly disabled
            style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed" }}
            placeholder="Select a class to see its type"
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: text, cursor: "pointer" }}>
          <input type="checkbox" checked={isOneTime} onChange={(e) => setIsOneTime(e.target.checked)} style={{ width: 15, height: 15, cursor: "pointer" }} />
          Add as a one-time extra class (for a specific date only)
        </label>

        {isOneTime ? (
          <label style={labelStyle}>
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} required />
          </label>
        ) : (
          <p style={{ margin: 0, fontSize: 12, color: muted, background: inputBg, border: `0.5px solid ${border}`, borderRadius: 8, padding: "8px 10px" }}>
            This period will repeat every <strong style={{ color: text }}>{impliedWeekday}</strong>, based on the day currently selected in the calendar.
          </p>
        )}

        {error && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, borderRadius: 8, border: "0.5px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "8px 10px", fontSize: 12, lineHeight: 1.4 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 15, marginTop: 1 }} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 2 }}>
          <button type="button" onClick={onClose} style={{ height: 34, padding: "0 14px", borderRadius: 18, border: `0.5px solid ${border}`, background: inputBg, color: muted, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>Cancel</button>
          <button type="submit" disabled={!classId} style={{ height: 34, padding: "0 16px", borderRadius: 18, border: "none", background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "#fff", cursor: classId ? "pointer" : "not-allowed", opacity: classId ? 1 : 0.6, fontSize: 12, fontWeight: 600 }}>
            Save period
          </button>
        </div>
      </form>
    </div>
  )
}