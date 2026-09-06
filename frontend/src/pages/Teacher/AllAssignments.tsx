import { useState } from "react"
import { useNavigate } from "react-router-dom"

type DarkProps = { darkMode: boolean }

type Assignment = {
  id: number
  title: string
  class: string
  subject: string
  dueDate: string
  fileName: string
  fileUrl: string
}

const initialAssignments: Assignment[] = [
  { id: 1, title: "Algebra Homework 3", class: "Grade 10", subject: "Mathematics", dueDate: "2024-10-15", fileName: "hw3_algebra.pdf", fileUrl: "#" },
  { id: 2, title: "Essay on Global Warming", class: "Grade 11", subject: "English", dueDate: "2024-10-18", fileName: "global_warming_essay.docx", fileUrl: "#" },
  { id: 3, title: "Physics Lab Report", class: "Grade 12", subject: "Science", dueDate: "2024-10-20", fileName: "physics_lab_02.pdf", fileUrl: "#" },
  { id: 4, title: "History Timeline", class: "Grade 9", subject: "History", dueDate: "2024-10-14", fileName: "timeline_instructions.pdf", fileUrl: "#" },
]

export default function AllAssignments({ darkMode: d }: DarkProps) {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [search, setSearch] = useState("")

  const bg = d ? "#0f0f1a" : "#f1f5f9"
  const card = d ? "#1c1c30" : "#ffffff"
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx = d ? "#e2e8f0" : "#0f172a"
  const mt = d ? "#64748b" : "#94a3b8"
  const inp = d ? "#13132a" : "#f8fafc"

  const filtered = assignments.filter(a => {
    return (
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.class.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
    )
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
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tx }}>All Assignments</h1>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: mt }}>{assignments.length} assignments uploaded</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/assignments/add")}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#a855f7,#ec4899)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 18px", cursor: "pointer" }}
        >
          <i className="ti ti-upload" style={{ fontSize: 16 }} />
          Upload Assignment
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: mt, fontSize: 16 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, class, subject…"
            style={{ ...inputStyle, paddingLeft: 36, background: card }}
          />
        </div>
      </div>

      {/* List view of assignments */}
      <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 14, overflow: "hidden" }}>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 2fr 1fr 80px",
          padding: "10px 20px",
          borderBottom: `0.5px solid ${brd}`,
          background: d ? "rgba(255,255,255,0.03)" : "#f8fafc",
        }}>
          {["Assignment", "Class", "File", "Due Date", ""].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: mt, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: mt, fontSize: 13 }}>No assignments found</div>
        ) : (
          filtered.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 2fr 1fr 80px",
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: i < filtered.length - 1 ? `0.5px solid ${brd}` : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = d ? "rgba(255,255,255,0.025)" : "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Assignment Title & Subject */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(168,85,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-file-text" style={{ fontSize: 18, color: "#a855f7" }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tx, lineHeight: 1.2 }}>{a.title}</h3>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: mt }}>{a.subject}</p>
                </div>
              </div>

              {/* Class */}
              <span style={{ fontSize: 13, color: tx, fontWeight: 500 }}>{a.class}</span>

              {/* File Info */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: inp, borderRadius: 8, padding: "6px 10px", border: `1px solid ${brd}`, width: "fit-content", maxWidth: "100%" }}>
                <i className="ti ti-file-type-pdf" style={{ fontSize: 16, color: "#ef4444", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: tx, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.fileName}
                </span>
                <a
                  href={a.fileUrl}
                  download
                  style={{ color: "#a855f7", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", marginLeft: 8 }}
                  title="Download File"
                >
                  <i className="ti ti-download" style={{ fontSize: 15 }} />
                </a>
              </div>

              {/* Due Date */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ti ti-calendar" style={{ fontSize: 14, color: mt }} />
                <span style={{ fontSize: 12, color: tx }}>{a.dueDate}</span>
              </div>

              {/* Actions */}
              <button
                style={{
                  background: "transparent", border: "none",
                  color: "#ef4444", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", textAlign: "right"
                }}
                onClick={() => setAssignments(prev => prev.filter(item => item.id !== a.id))}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

