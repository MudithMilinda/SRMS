import { useEffect, useState, type FormEvent } from "react"

export type NewPeriodInput = {
  subject: string
  date: string
  start: number
  end: number
  className: string
  teacher: string
}

type AddPeriodModalProps = {
  darkMode: boolean
  initialDate: string
  subjectOptions: string[]
  classOptions: string[]
  timeSlots: string[]
  error?: string
  onClose: () => void
  onSave: (period: NewPeriodInput) => void
}

export default function AddPeriodModal({
  darkMode,
  initialDate,
  subjectOptions,
  classOptions,
  timeSlots,
  error,
  onClose,
  onSave,
}: AddPeriodModalProps) {
  const [subject, setSubject] = useState(subjectOptions[0] ?? "")
  const [date, setDate] = useState(initialDate)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(1)
  const [className, setClassName] = useState(classOptions[0] ?? "")
  const [teacher, setTeacher] = useState("")

  useEffect(() => {
    setDate(initialDate)
  }, [initialDate])

  useEffect(() => {
    if (end <= start) setEnd(start + 1)
  }, [end, start])

  const card = darkMode ? "#1c1c30" : "#ffffff"
  const border = darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0"
  const text = darkMode ? "#e2e8f0" : "#0f172a"
  const muted = darkMode ? "#94a3b8" : "#64748b"
  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc"

  const inputStyle = {
    width: "100%",
    height: 38,
    borderRadius: 8,
    border: `0.5px solid ${border}`,
    background: inputBg,
    color: text,
    padding: "0 10px",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box" as const,
  }

  const labelStyle = {
    display: "grid",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: muted,
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanSubject = subject.trim()
    const cleanTeacher = teacher.trim()
    if (!cleanSubject || !date || !cleanTeacher) return

    onSave({
      subject: cleanSubject,
      date,
      start,
      end,
      className,
      teacher: cleanTeacher,
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-period-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15,23,42,0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onMouseDown={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "min(440px, 100%)",
          background: card,
          border: `0.5px solid ${border}`,
          borderRadius: 12,
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          padding: 18,
          display: "grid",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "rgba(168,85,247,0.14)",
              color: "#a855f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="ti ti-calendar-plus" style={{ fontSize: 18 }} aria-hidden="true" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 id="add-period-title" style={{ margin: 0, color: text, fontSize: 16, fontWeight: 600 }}>
              Add period
            </h3>
            <p style={{ margin: "2px 0 0", color: muted, fontSize: 12 }}>
              Create a class slot for the selected date.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `0.5px solid ${border}`,
              background: "transparent",
              color: muted,
              cursor: "pointer",
            }}
          >
            <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
          </button>
        </div>

        <label style={labelStyle}>
          Subject
          <input
            list="subject-options"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            style={inputStyle}
            placeholder="Subject name"
            required
          />
          <datalist id="subject-options">
            {subjectOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <label style={labelStyle}>
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            From
            <select
              value={start}
              onChange={(event) => {
                const nextStart = Number(event.target.value)
                setStart(nextStart)
                if (end <= nextStart) setEnd(nextStart + 1)
              }}
              style={inputStyle}
            >
              {timeSlots.slice(0, -1).map((slot, index) => (
                <option key={slot} value={index}>
                  {slot}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            To
            <select
              value={end}
              onChange={(event) => setEnd(Number(event.target.value))}
              style={inputStyle}
            >
              {timeSlots.slice(1).map((slot, index) => {
                const value = index + 1
                return (
                  <option key={slot} value={value} disabled={value <= start}>
                    {slot}
                  </option>
                )
              })}
            </select>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label style={labelStyle}>
            Class
            <select
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              style={inputStyle}
            >
              {classOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Teacher
            <input
              value={teacher}
              onChange={(event) => setTeacher(event.target.value)}
              style={inputStyle}
              placeholder="Teacher name"
              required
            />
          </label>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              borderRadius: 8,
              border: "0.5px solid rgba(239,68,68,0.35)",
              background: "rgba(239,68,68,0.1)",
              color: "#ef4444",
              padding: "8px 10px",
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            <i className="ti ti-alert-circle" style={{ fontSize: 15, marginTop: 1 }} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 2 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 34,
              padding: "0 14px",
              borderRadius: 18,
              border: `0.5px solid ${border}`,
              background: inputBg,
              color: muted,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              height: 34,
              padding: "0 16px",
              borderRadius: 18,
              border: "none",
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Save period
          </button>
        </div>
      </form>
    </div>
  )
}
