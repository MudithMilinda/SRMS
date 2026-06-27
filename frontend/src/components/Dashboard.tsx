type DashboardProps = {
  darkMode: boolean
}

const classData = [
  { label: "JSS 1", students: 28, pass: 24, color: "#a855f7" },
  { label: "JSS 2", students: 31, pass: 26, color: "#8b5cf6" },
  { label: "JSS 3", students: 25, pass: 19, color: "#7c3aed" },
  { label: "SSS 1", students: 34, pass: 31, color: "#ec4899" },
  { label: "SSS 2", students: 29, pass: 22, color: "#db2777" },
  { label: "SSS 3", students: 22, pass: 18, color: "#be185d" },
]

const statsData = [
  { icon: "ti-users",    label: "Total students", value: "149", sub: "Across all classes", color: "#a855f7", bg: "rgba(168,85,247,0.12)"  },
  { icon: "ti-book",     label: "Total subjects",  value: "12",  sub: "Active this term",   color: "#06b6d4", bg: "rgba(6,182,212,0.12)"   },
  { icon: "ti-school",   label: "Teachers",        value: "18",  sub: "On staff",           color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
  { icon: "ti-building", label: "Classrooms",      value: "6",   sub: "In use",             color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
]

const maxStudents = Math.max(...classData.map(c => c.students))

export default function Dashboard({ darkMode: d }: DashboardProps) {
  const bg    = d ? "#0f0f1a" : "#f1f5f9"
  const card  = d ? "#1c1c30" : "#ffffff"
  const brd   = d ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx    = d ? "#e2e8f0" : "#0f172a"
  const mt    = d ? "#64748b" : "#64748b"
  const barBg = d ? "rgba(255,255,255,0.05)" : "#e2e8f0"

  return (
    <main style={{ flex: 1, background: bg, minHeight: "100vh", padding: "1.25rem", overflowY: "auto" }}>

      {/* Notification */}
      <div style={{
        background: d ? "rgba(168,85,247,0.08)" : "#faf5ff",
        border: `0.5px solid ${d ? "rgba(168,85,247,0.25)" : "#e9d5ff"}`,
        borderRadius: 12, padding: "0.85rem 1rem",
        display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "1.25rem",
      }}>
        <i className="ti ti-bell-ringing" style={{ fontSize: 17, color: "#a855f7", flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 12, color: "#a855f7" }}>Notification</p>
          <p style={{ margin: 0, fontSize: 12, color: mt, lineHeight: 1.6 }}>
            Automated cumulative functionality is now live! Start inputting results to generate
            cumulative scores from the first, second, and third terms.
          </p>
        </div>
      </div>

      {/* 4 stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: "1.25rem" }}>
        {statsData.map(s => (
          <div key={s.label} style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, padding: "1rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 19, color: s.color }} />
            </div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: tx, lineHeight: 1 }}>{s.value}</p>
            <p style={{ margin: "4px 0 2px", fontSize: 12, fontWeight: 600, color: tx }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 11, color: mt }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 2-col: table + bar chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

        {/* Class overview table */}
        <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, padding: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.9rem" }}>
            <i className="ti ti-list-details" style={{ fontSize: 17, color: "#a855f7" }} />
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tx }}>Class overview</h2>
          </div>

          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 50px 50px", gap: 6, paddingBottom: 6, borderBottom: `0.5px solid ${brd}`, marginBottom: 2 }}>
            {["Class", "Pass rate", "Total", "Pass"].map(h => (
              <span key={h} style={{ fontSize: 9, fontWeight: 600, color: mt, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
            ))}
          </div>

          {classData.map(c => {
            const rate = Math.round((c.pass / c.students) * 100)
            return (
              <div key={c.label} style={{ display: "grid", gridTemplateColumns: "44px 1fr 50px 50px", gap: 6, alignItems: "center", padding: "7px 0", borderBottom: `0.5px solid ${brd}` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: tx }}>{c.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, height: 7, borderRadius: 5, background: barBg }}>
                    <div style={{ height: "100%", borderRadius: 5, width: `${rate}%`, background: c.color }} />
                  </div>
                  <span style={{ fontSize: 10, color: mt, minWidth: 26, textAlign: "right" }}>{rate}%</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: tx, textAlign: "center" }}>{c.students}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#10b981", textAlign: "center" }}>{c.pass}</span>
              </div>
            )
          })}
        </div>

        {/* Bar chart */}
        <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 12, padding: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.9rem" }}>
            <i className="ti ti-chart-bar-popular" style={{ fontSize: 17, color: "#ec4899" }} />
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tx }}>Students per class</h2>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 150, padding: "0 4px", marginBottom: 8 }}>
            {classData.map(c => {
              const hp = Math.round((c.students / maxStudents) * 100)
              return (
                <div key={c.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: tx }}>{c.students}</span>
                  <div style={{ width: "100%", height: `${hp}%`, borderRadius: "5px 5px 0 0", background: c.color, minHeight: 6 }} />
                  <span style={{ fontSize: 10, color: mt }}>{c.label}</span>
                </div>
              )
            })}
          </div>

          <div style={{ height: 1, background: brd, marginBottom: 10 }} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px" }}>
            {classData.map(c => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0, display: "inline-block" }} />
                <span style={{ fontSize: 11, color: mt }}>{c.label} — {c.students}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}