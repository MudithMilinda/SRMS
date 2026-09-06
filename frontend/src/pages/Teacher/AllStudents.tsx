import { useState } from "react"
import { useNavigate } from "react-router-dom"

type DarkProps = { darkMode: boolean }

type Student = {
  id: number
  name: string
  class: string
  phone: string
  parentName: string
  parentPhone: string
  status: "Active" | "Inactive"
}

const initialStudents: Student[] = [
  { id: 1, name: "Kamal Perera", class: "Grade 10", phone: "071 123 4567", parentName: "Nimal Perera", parentPhone: "077 111 2222", status: "Active" },
  { id: 2, name: "Sunil Silva", class: "Grade 11", phone: "072 234 5678", parentName: "Saman Silva", parentPhone: "077 333 4444", status: "Active" },
  { id: 3, name: "Nayani Fernando", class: "Grade 10", phone: "075 345 6789", parentName: "Ajith Fernando", parentPhone: "071 555 6666", status: "Active" },
  { id: 4, name: "Ruwan Kumara", class: "Grade 12", phone: "078 456 7890", parentName: "Siri Kumara", parentPhone: "072 777 8888", status: "Inactive" },
  { id: 5, name: "Kasun Jayasuriya", class: "Grade 9", phone: "070 567 8901", parentName: "Anura Jayasuriya", parentPhone: "075 999 0000", status: "Active" },
]

export default function AllStudents({ darkMode: d }: DarkProps) {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState<string>("All")

  const bg = d ? "#0f0f1a" : "#f1f5f9"
  const card = d ? "#1c1c30" : "#ffffff"
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx = d ? "#e2e8f0" : "#0f172a"
  const mt = d ? "#64748b" : "#94a3b8"
  const inp = d ? "#13132a" : "#f8fafc"

  const filtered = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase())
    const matchClass = filterClass === "All" || s.class === filterClass
    return matchSearch && matchClass
  })

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `0.5px solid ${brd}`, background: inp,
    color: tx, fontSize: 13, outline: "none", fontFamily: "inherit",
  } as React.CSSProperties

  return (
    <main style={{ flex: 1, background: bg, minHeight: "100vh", padding: "1.5rem", overflowY: "auto", position: "relative" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tx }}>All Students</h1>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: mt }}>{students.length} students total</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/students/add")}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#a855f7,#ec4899)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 18px", cursor: "pointer" }}
        >
          <i className="ti ti-plus" style={{ fontSize: 16 }} />
          Add student
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: mt, fontSize: 16 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, parent name…"
            style={{ ...inputStyle, paddingLeft: 36, background: card }}
          />
        </div>
        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          style={{
            padding: "8px 16px", borderRadius: 8,
            border: `0.5px solid ${brd}`,
            background: card,
            color: mt,
            fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none"
          }}
        >
          <option value="All">All Classes</option>
          {Array.from(new Set(students.map(s => s.class))).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 14, overflow: "hidden" }}>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr 80px",
          padding: "10px 20px",
          borderBottom: `0.5px solid ${brd}`,
          background: d ? "rgba(255,255,255,0.03)" : "#f8fafc",
        }}>
          {["Student Name", "Class", "Contact", "Parent Info", "Status"].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: mt, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: mt, fontSize: 13 }}>No students found</div>
        ) : (
          filtered.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr 80px",
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: i < filtered.length - 1 ? `0.5px solid ${brd}` : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = d ? "rgba(255,255,255,0.025)" : "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Student */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: d ? "rgba(255,255,255,0.07)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-user" style={{ fontSize: 18, color: mt }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tx }}>{s.name}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 11, color: mt }}>ID: #{1000 + s.id}</p>
                </div>
              </div>

              {/* Class */}
              <span style={{ fontSize: 13, color: tx, fontWeight: 500 }}>{s.class}</span>

              {/* Contact */}
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <i className="ti ti-phone" style={{ fontSize: 15, color: mt }} />
                <span style={{ fontSize: 13, color: tx }}>{s.phone}</span>
              </div>

              {/* Parent Info */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, color: tx }}>{s.parentName}</span>
                <span style={{ fontSize: 11, color: mt }}>{s.parentPhone}</span>
              </div>

              {/* Status */}
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: s.status === "Active" ? "#10b981" : mt,
                background: s.status === "Active" ? "rgba(16, 185, 129, 0.1)" : d ? "rgba(255,255,255,0.07)" : "#e2e8f0",
                padding: "4px 12px", borderRadius: 20,
                display: "inline-block",
                textAlign: "center"
              }}>
                {s.status}
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

