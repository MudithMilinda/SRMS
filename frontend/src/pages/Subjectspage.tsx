import { useState } from "react"

type DarkProps = { darkMode: boolean }

type Subject = {
  id: number
  name: string
  teacher: string
  studentCount: number
  class: string
  type: "Theory" | "Revision" | "Practical"
  status: "Active" | "Inactive"
}

const initialSubjects: Subject[] = [
  { id: 1,  name: "Mathematics",       teacher: "Mr. Adebayo",  studentCount: 28, class: "JSS 1", type: "Theory",    status: "Active"   },
  { id: 2,  name: "English Language",  teacher: "Mrs. Okonkwo", studentCount: 31, class: "JSS 2", type: "Theory",    status: "Active"   },
  { id: 3,  name: "Basic Science",     teacher: "Mr. Eze",      studentCount: 25, class: "JSS 3", type: "Practical", status: "Active"   },
  { id: 4,  name: "Social Studies",    teacher: "Mrs. Bello",   studentCount: 34, class: "SSS 1", type: "Theory",    status: "Inactive" },
  { id: 5,  name: "Physics",           teacher: "Mr. Lawal",    studentCount: 29, class: "SSS 2", type: "Theory",    status: "Active"   },
  { id: 6,  name: "Chemistry",         teacher: "Mrs. Nwosu",   studentCount: 22, class: "SSS 3", type: "Practical", status: "Active"   },
  { id: 7,  name: "Biology",           teacher: "Mr. Fatai",    studentCount: 30, class: "SSS 1", type: "Practical", status: "Active"   },
  { id: 8,  name: "Literature",        teacher: "Mrs. Chukwu",  studentCount: 27, class: "SSS 2", type: "Revision",  status: "Inactive" },
  { id: 9,  name: "Agric. Science",    teacher: "Mr. Musa",     studentCount: 24, class: "JSS 2", type: "Revision",  status: "Active"   },
  { id: 10, name: "Civic Education",   teacher: "Mrs. Adeleke", studentCount: 31, class: "JSS 3", type: "Theory",    status: "Active"   },
  { id: 11, name: "Further Maths",     teacher: "Mr. Ogunleye", studentCount: 18, class: "SSS 3", type: "Revision",  status: "Active"   },
  { id: 12, name: "Computer Science",  teacher: "Mrs. Amaka",   studentCount: 26, class: "SSS 2", type: "Practical", status: "Active"   },
]

const typeColor: Record<string, { text: string; bg: string }> = {
  Theory:    { text: "#a855f7", bg: "rgba(168,85,247,0.1)"  },
  Revision:  { text: "#06b6d4", bg: "rgba(6,182,212,0.1)"   },
  Practical: { text: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
}

const emptyForm = {
  name: "", teacher: "", studentCount: "", class: "",
  type: "Theory" as Subject["type"], status: "Active" as Subject["status"],
}

export default function SubjectsPage({ darkMode: d }: DarkProps) {
  const [subjects, setSubjects]     = useState<Subject[]>(initialSubjects)
  const [search, setSearch]         = useState("")
  const [showModal, setShowModal]   = useState(false)
  const [editItem, setEditItem]     = useState<Subject | null>(null)
  const [form, setForm]             = useState(emptyForm)
  const [filterType, setFilterType] = useState<string>("All")

  const bg   = d ? "#0f0f1a" : "#f1f5f9"
  const card = d ? "#1c1c30" : "#ffffff"
  const brd  = d ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx   = d ? "#e2e8f0" : "#0f172a"
  const mt   = d ? "#64748b" : "#94a3b8"
  const inp  = d ? "#13132a" : "#f8fafc"
  const ovl  = d ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)"

  const filtered = subjects.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.teacher.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === "All" || s.type === filterType
    return matchSearch && matchType
  })

  const openAdd = () => {
    setEditItem(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (s: Subject) => {
    setEditItem(s)
    setForm({
      name: s.name, teacher: s.teacher,
      studentCount: String(s.studentCount),
      class: s.class, type: s.type, status: s.status,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editItem) {
      setSubjects(prev => prev.map(s =>
        s.id === editItem.id
          ? { ...s, ...form, studentCount: Number(form.studentCount) || 0 }
          : s
      ))
    } else {
      const newId = Math.max(...subjects.map(s => s.id)) + 1
      setSubjects(prev => [...prev, {
        id: newId, ...form, studentCount: Number(form.studentCount) || 0,
      }])
    }
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    setSubjects(prev => prev.filter(s => s.id !== id))
    setShowModal(false)
  }

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `0.5px solid ${brd}`, background: inp,
    color: tx, fontSize: 13, outline: "none", fontFamily: "inherit",
  } as React.CSSProperties

  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: mt,
    marginBottom: 5, display: "block",
  } as React.CSSProperties

  return (
    <main style={{ flex: 1, background: bg, minHeight: "100vh", padding: "1.5rem", overflowY: "auto", position: "relative" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tx }}>Subjects</h1>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: mt }}>{subjects.length} subjects total</p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#a855f7,#ec4899)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 18px", cursor: "pointer" }}
        >
          <i className="ti ti-plus" style={{ fontSize: 16 }} />
          Add subject
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: mt, fontSize: 16 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by subject, teacher, class…"
            style={{ ...inputStyle, paddingLeft: 36, background: card }}
          />
        </div>
        {["All", "Theory", "Revision", "Practical"].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            style={{
              padding: "8px 16px", borderRadius: 8,
              border: `0.5px solid ${filterType === t ? "#a855f7" : brd}`,
              background: filterType === t ? "rgba(168,85,247,0.12)" : card,
              color: filterType === t ? "#a855f7" : mt,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 14, overflow: "hidden" }}>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1.6fr 110px 105px 60px",
          padding: "10px 20px",
          borderBottom: `0.5px solid ${brd}`,
          background: d ? "rgba(255,255,255,0.03)" : "#f8fafc",
        }}>
          {["Subject", "Teacher", "Student count", "Type", ""].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: mt, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: mt, fontSize: 13 }}>No subjects found</div>
        ) : (
          filtered.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1.6fr 110px 105px 60px",
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: i < filtered.length - 1 ? `0.5px solid ${brd}` : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = d ? "rgba(255,255,255,0.025)" : "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Subject */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: typeColor[s.type].bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-book-2" style={{ fontSize: 18, color: typeColor[s.type].text }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tx }}>{s.name}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 11, color: mt }}>{s.class}</p>
                </div>
              </div>

              {/* Teacher */}
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: d ? "rgba(255,255,255,0.07)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-user" style={{ fontSize: 14, color: mt }} />
                </div>
                <span style={{ fontSize: 13, color: tx }}>{s.teacher}</span>
              </div>

              {/* Student count */}
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <i className="ti ti-users" style={{ fontSize: 15, color: mt }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: tx }}>{s.studentCount}</span>
                <span style={{ fontSize: 11, color: mt }}>students</span>
              </div>

              {/* Type */}
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: typeColor[s.type].text,
                background: typeColor[s.type].bg,
                padding: "4px 12px", borderRadius: 20,
                display: "inline-block",
              }}>
                {s.type}
              </span>

              {/* Edit */}
              <button
                onClick={() => openEdit(s)}
                style={{ background: "transparent", border: "none", color: "#a855f7", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0" }}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: "fixed", inset: 0, background: ovl, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 16, padding: "1.75rem", width: 420, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: tx }}>{editItem ? "Edit subject" : "Add subject"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: mt, fontSize: 20, cursor: "pointer" }}>
                <i className="ti ti-x" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Subject name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mathematics" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Teacher</label>
                <input value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} placeholder="e.g. Mr. Adebayo" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Student count</label>
                  <input value={form.studentCount} onChange={e => setForm(f => ({ ...f, studentCount: e.target.value }))} placeholder="e.g. 28" type="number" min="0" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Class</label>
                  <select value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Select class</option>
                    {["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Subject["type"] }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option>Theory</option>
                    <option>Revision</option>
                    <option>Practical</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Subject["status"] }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: "1.5rem", justifyContent: "flex-end" }}>
              {editItem && (
                <button onClick={() => handleDelete(editItem.id)} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Delete
                </button>
              )}
              <button onClick={() => setShowModal(false)} style={{ padding: "9px 16px", borderRadius: 9, border: `0.5px solid ${brd}`, background: "transparent", color: mt, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {editItem ? "Save changes" : "Add subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}