type PeriodDetailsModalProps = {
  darkMode: boolean
  subject: string
  className: string
  teacher: string
  date: string
  time: string
  color: string
  onClose: () => void
  onDelete: () => void
}

export default function PeriodDetailsModal({
  darkMode,
  subject,
  className,
  teacher,
  date,
  time,
  color,
  onClose,
  onDelete,
}: PeriodDetailsModalProps) {
  const card = darkMode ? "#1c1c30" : "#ffffff"
  const border = darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0"
  const text = darkMode ? "#e2e8f0" : "#0f172a"
  const muted = darkMode ? "#94a3b8" : "#64748b"
  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc"

  const details = [
    { icon: "ti-book", label: "Subject", value: subject },
    { icon: "ti-users", label: "Class", value: className },
    { icon: "ti-user", label: "Teacher", value: teacher },
    { icon: "ti-calendar", label: "Date", value: date },
    { icon: "ti-clock", label: "Time", value: time },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="period-details-title"
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
      <div
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "min(420px, 100%)",
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
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${color}22`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="ti ti-calendar-event" style={{ fontSize: 19 }} aria-hidden="true" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 id="period-details-title" style={{ margin: 0, color: text, fontSize: 16, fontWeight: 600 }}>
              Period details
            </h3>
            <p style={{ margin: "2px 0 0", color: muted, fontSize: 12 }}>
              Review this timetable slot.
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

        <div style={{ display: "grid", gap: 8 }}>
          {details.map((item) => (
            <div
              key={item.label}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 88px 1fr",
                alignItems: "center",
                gap: 8,
                border: `0.5px solid ${border}`,
                borderRadius: 8,
                background: inputBg,
                padding: "8px 10px",
              }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 15, color }} aria-hidden="true" />
              <span style={{ fontSize: 12, color: muted }}>{item.label}</span>
              <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
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
            Close
          </button>
          <button
            type="button"
            onClick={onDelete}
            style={{
              height: 34,
              padding: "0 16px",
              borderRadius: 18,
              border: "none",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <i className="ti ti-trash" style={{ fontSize: 14 }} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
