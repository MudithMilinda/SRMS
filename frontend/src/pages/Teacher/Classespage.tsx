import { useState, useEffect } from "react"
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getErrorMessage,
  type ClassType,
} from "../../api/adminApi"

type DarkProps = { darkMode: boolean }

const typeColor: Record<string, { text: string; bg: string }> = {
  Theory: { text: "#a855f7", bg: "rgba(168,85,247,0.1)" },
  Revision: { text: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  Practical: { text: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
}

const emptyForm = {
  name: "",
  type: "Theory" as ClassType["type"], status: "Active" as ClassType["status"],
}

export default function ClassesPage({ darkMode: d }: DarkProps) {
  const [classes, setClassTypes] = useState<ClassType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<ClassType | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filterType, setFilterType] = useState<string>("All")
  const [saving, setSaving] = useState(false)

  const bg = d ? "#0f0f1a" : "#f1f5f9"
  const card = d ? "#1c1c30" : "#ffffff"
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx = d ? "#e2e8f0" : "#0f172a"
  const mt = d ? "#64748b" : "#94a3b8"
  const inp = d ? "#13132a" : "#f8fafc"
  const ovl = d ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)"

  const fetchClasses = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getClasses()
      setClassTypes(data.classes)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const filtered = classes.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === "All" || s.type === filterType
    return matchSearch && matchType
  })

  const openAdd = () => {
    setEditItem(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (s: ClassType) => {
    setEditItem(s)
    setForm({
      name: s.name, type: s.type, status: s.status,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    setError("")
    try {
      if (editItem) {
        const data = await updateClass(editItem._id, form)
        setClassTypes(prev => prev.map(c => (c._id === editItem._id ? data.class : c)))
      } else {
        const data = await createClass(form)
        setClassTypes(prev => [data.class, ...prev])
      }
      setShowModal(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setSaving(true)
    setError("")
    try {
      await deleteClass(id)
      setClassTypes(prev => prev.filter(c => c._id !== id))
      setShowModal(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
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
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tx }}>Classes</h1>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: mt }}>{classes.length} classes total</p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#a855f7,#ec4899)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 18px", cursor: "pointer" }}
        >
          <i className="ti ti-plus" style={{ fontSize: 16 }} />
          Add class
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
          {error}
        </div>
      )}

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: mt, fontSize: 16 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name…"
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

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 105px 60px",
          padding: "10px 20px",
          borderBottom: `0.5px solid ${brd}`,
          background: d ? "rgba(255,255,255,0.03)" : "#f8fafc",
        }}>
          {["Name", "Type", ""].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: mt, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: mt, fontSize: 13 }}>Loading classes…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: mt, fontSize: 13 }}>No classes found</div>
        ) : (
          filtered.map((s, i) => (
            <div
              key={s._id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 105px 60px",
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: i < filtered.length - 1 ? `0.5px solid ${brd}` : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = d ? "rgba(255,255,255,0.025)" : "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: typeColor[s.type].bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-book-2" style={{ fontSize: 18, color: typeColor[s.type].text }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tx }}>{s.name}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 11, color: mt }}>{s.status}</p>
                </div>
              </div>

              <span style={{
                fontSize: 11, fontWeight: 600,
                color: typeColor[s.type].text,
                background: typeColor[s.type].bg,
                padding: "4px 12px", borderRadius: 20,
                display: "inline-block",
              }}>
                {s.type}
              </span>

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
          onClick={() => !saving && setShowModal(false)}
          style={{ position: "fixed", inset: 0, background: ovl, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 16, padding: "1.75rem", width: 420, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: tx }}>{editItem ? "Edit class" : "Add class"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: mt, fontSize: 20, cursor: "pointer" }}>
                <i className="ti ti-x" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Class name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mathematics" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ClassType["type"] }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option>Theory</option>
                    <option>Revision</option>
                    <option>Practical</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ClassType["status"] }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: "1.5rem", justifyContent: "flex-end" }}>
              {editItem && (
                <button disabled={saving} onClick={() => handleDelete(editItem._id)} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
                  Delete
                </button>
              )}
              <button disabled={saving} onClick={() => setShowModal(false)} style={{ padding: "9px 16px", borderRadius: 9, border: `0.5px solid ${brd}`, background: "transparent", color: mt, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button disabled={saving} onClick={handleSave} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : editItem ? "Save changes" : "Add class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}