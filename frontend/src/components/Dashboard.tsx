type DashboardProps = {
  darkMode: boolean
}

const classData = [
  { label: "JSS 1", students: 28, pass: 24, color: "#a855f7" },
  { label: "JSS 2", students: 31, pass: 26, color: "#a855f7" },
  { label: "JSS 3", students: 25, pass: 19, color: "#a855f7" },
  { label: "SSS 1", students: 34, pass: 31, color: "#ec4899" },
  { label: "SSS 2", students: 29, pass: 22, color: "#ec4899" },
  { label: "SSS 3", students: 22, pass: 18, color: "#ec4899" },
]

const stats = [
  {
    icon: "ti-users",
    label: "Total students",
    value: "149",
    sub: "Across all classes",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.1)",
  },
  {
    icon: "ti-book",
    label: "Total subjects",
    value: "12",
    sub: "Active this term",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
  },
  {
    icon: "ti-school",
    label: "Teachers",
    value: "18",
    sub: "On staff",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    icon: "ti-building",
    label: "Classrooms",
    value: "6",
    sub: "In use",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
]

export default function Dashboard({ darkMode }: DashboardProps) {
  const bg = darkMode ? "#0f0f1a" : "#f1f5f9"
  const card = darkMode ? "#1c1c30" : "#ffffff"
  const brd = darkMode ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx = darkMode ? "#e2e8f0" : "#0f172a"
  const mt = darkMode ? "#64748b" : "#64748b"
  const sub = darkMode ? "#334155" : "#f8fafc"
  const barBg = darkMode ? "rgba(255,255,255,0.05)" : "#e2e8f0"

  return (
    <main
      style={{
        flex: 1,
        background: bg,
        minHeight: "100vh",
        padding: "1.5rem",
        overflowY: "auto",
      }}
    >
      {/* Notification */}
      <div
        style={{
          background: darkMode ? "rgba(168,85,247,0.08)" : "#faf5ff",
          border: `0.5px solid ${darkMode ? "rgba(168,85,247,0.25)" : "#e9d5ff"}`,
          borderRadius: 12,
          padding: "0.9rem 1.1rem",
          display: "flex",
          alignItems: "flex-start",
          gap: 11,
          marginBottom: "1.5rem",
        }}
      >
        <i
          className="ti ti-bell-ringing"
          style={{ fontSize: 18, color: "#a855f7", flexShrink: 0, marginTop: 2 }}
          aria-hidden="true"
        />
        <div>
          <p style={{ margin: "0 0 2px", fontWeight: 500, fontSize: 13, color: "#a855f7" }}>
            Notification
          </p>
          <p style={{ margin: 0, fontSize: 13, color: mt, lineHeight: 1.6 }}>
            Automated cumulative functionality is now live! Start inputting results to generate
            cumulative scores from the first, second, and third terms.
          </p>
        </div>
      </div>

      {/* Main stats — 4 cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: card,
              border: `0.5px solid ${brd}`,
              borderRadius: 12,
              padding: "1.1rem 1.1rem 1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.color }} aria-hidden="true" />
              </div>
            </div>
            <p style={{ margin: "0 0 2px", fontSize: 26, fontWeight: 600, color: tx, lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 500, color: tx }}>
              {s.label}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: mt }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Session + Term row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        {/* Current session */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(239,68,68,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="ti ti-calendar" style={{ fontSize: 20, color: "#ef4444" }} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: mt, fontWeight: 400 }}>Current session</p>
            <p style={{ margin: "3px 0 0", fontSize: 16, fontWeight: 600, color: tx }}>2024 / 2025</p>
          </div>
          <button
            style={{
              background: "rgba(168,85,247,0.1)",
              border: "none",
              borderRadius: 20,
              color: "#a855f7",
              fontSize: 12,
              fontWeight: 500,
              padding: "5px 14px",
              cursor: "pointer",
            }}
          >
            Switch
          </button>
        </div>

        {/* Current term */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(239,68,68,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="ti ti-clock" style={{ fontSize: 20, color: "#ef4444" }} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: mt, fontWeight: 400 }}>Current term</p>
            <p style={{ margin: "3px 0 0", fontSize: 16, fontWeight: 600, color: tx }}>First Term</p>
          </div>
          <span
            style={{
              background: "rgba(16,185,129,0.1)",
              color: "#059669",
              fontSize: 11,
              fontWeight: 500,
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            Active
          </span>
        </div>
      </div>

      {/* Bottom: class analytics + quick info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}>
        {/* Class analytics */}
        <div
          style={{
            background: card,
            border: `0.5px solid ${brd}`,
            borderRadius: 12,
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1.1rem",
            }}
          >
            <i className="ti ti-chart-bar" style={{ fontSize: 18, color: "#a855f7" }} aria-hidden="true" />
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: tx }}>Class overview</h2>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: mt,
                background: sub,
                padding: "3px 10px",
                borderRadius: 20,
                border: `0.5px solid ${brd}`,
              }}
            >
              2024 / 2025
            </span>
          </div>

          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr 52px 52px",
              gap: 8,
              marginBottom: 8,
              padding: "0 0 6px",
              borderBottom: `0.5px solid ${brd}`,
            }}
          >
            {["Class", "Pass rate", "Students", "Passed"].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 500, color: mt, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {h}
              </span>
            ))}
          </div>

          {classData.map((cls) => {
            const rate = Math.round((cls.pass / cls.students) * 100)
            return (
              <div
                key={cls.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr 52px 52px",
                  gap: 8,
                  alignItems: "center",
                  padding: "7px 0",
                  borderBottom: `0.5px solid ${brd}`,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: tx }}>{cls.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 6,
                      background: barBg,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 6,
                        width: `${rate}%`,
                        background: cls.color,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: mt, minWidth: 30, textAlign: "right" }}>
                    {rate}%
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: tx, textAlign: "center" }}>
                  {cls.students}
                </span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#10b981", textAlign: "center" }}>
                  {cls.pass}
                </span>
              </div>
            )
          })}
        </div>

        {/* Right panel — institute quick info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Institute info */}
          <div
            style={{
              background: card,
              border: `0.5px solid ${brd}`,
              borderRadius: 12,
              padding: "1.1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i className="ti ti-school" style={{ fontSize: 20, color: "#fff" }} aria-hidden="true" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tx }}>Result Arena College</p>
                <p style={{ margin: "1px 0 0", fontSize: 11, color: mt }}>Est. 2005</p>
              </div>
            </div>

            {[
              { icon: "ti-map-pin", label: "Location", val: "Lagos, Nigeria" },
              { icon: "ti-phone", label: "Contact", val: "+234 812 000 0000" },
              { icon: "ti-mail", label: "Email", val: "info@resultarena.edu" },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "7px 0",
                  borderTop: `0.5px solid ${brd}`,
                }}
              >
                <i className={`ti ${row.icon}`} style={{ fontSize: 15, color: mt, flexShrink: 0 }} aria-hidden="true" />
                <div>
                  <p style={{ margin: 0, fontSize: 10, color: mt }}>{row.label}</p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: tx }}>{row.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Teacher breakdown */}
          <div
            style={{
              background: card,
              border: `0.5px solid ${brd}`,
              borderRadius: 12,
              padding: "1.1rem",
              flex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <i className="ti ti-users-group" style={{ fontSize: 17, color: "#10b981" }} aria-hidden="true" />
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tx }}>Staff breakdown</h3>
            </div>

            {[
              { role: "Principal", count: 1, color: "#a855f7" },
              { role: "Vice principal", count: 1, color: "#ec4899" },
              { role: "Class teachers", count: 6, color: "#06b6d4" },
              { role: "Subject teachers", count: 10, color: "#10b981" },
            ].map((row) => (
              <div
                key={row.role}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderTop: `0.5px solid ${brd}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: row.color,
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 12, color: tx }}>{row.role}</span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: row.color,
                    background: row.color + "18",
                    padding: "2px 10px",
                    borderRadius: 20,
                  }}
                >
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}