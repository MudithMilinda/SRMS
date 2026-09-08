import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAssignments, deleteAssignment, getErrorMessage, type AssignmentType } from "../../api/adminApi"

type DarkProps = { darkMode: boolean }

export default function AllAssignments({ darkMode: d }: DarkProps) {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState<AssignmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const bg = d ? "#0f0f1a" : "#f1f5f9"
  const card = d ? "#1c1c30" : "#ffffff"
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const tx = d ? "#e2e8f0" : "#0f172a"
  const mt = d ? "#64748b" : "#94a3b8"
  const inp = d ? "#13132a" : "#f8fafc"

  // Load assignments from the backend on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments()
        setAssignments(data.assignments)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    fetchAssignments()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this assignment? This will also remove the file from Google Drive.")) return

    setDeletingId(id)
    try {
      await deleteAssignment(id)
      setAssignments((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer")
  }

  const filtered = assignments.filter((a) => {
    const q = search.toLowerCase()
    return (
      a.title.toLowerCase().includes(q) ||
      a.class?.name?.toLowerCase().includes(q) ||
      a.class?.class?.toLowerCase().includes(q)
    )
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })
  }

  const isPdf = (fileName: string) => fileName.toLowerCase().endsWith(".pdf")

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

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: mt, fontSize: 16 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, class…"
            style={{ ...inputStyle, paddingLeft: 36, background: card }}
          />
        </div>
      </div>

      {/* List view of assignments */}
      <div style={{ background: card, border: `0.5px solid ${brd}`, borderRadius: 14, overflow: "hidden" }}>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr 130px",
          padding: "10px 20px",
          borderBottom: `0.5px solid ${brd}`,
          background: d ? "rgba(255,255,255,0.03)" : "#f8fafc",
        }}>
          {["Assignment", "Class", "File", "Duration", "Due Date", ""].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: mt, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: mt, fontSize: 13 }}>Loading assignments...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: mt, fontSize: 13 }}>No assignments found</div>
        ) : (
          filtered.map((a, i) => (
            <div
              key={a._id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr 130px",
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: i < filtered.length - 1 ? `0.5px solid ${brd}` : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = d ? "rgba(255,255,255,0.025)" : "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Assignment Title */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(168,85,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-file-text" style={{ fontSize: 18, color: "#a855f7" }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tx, lineHeight: 1.2 }}>{a.title}</h3>
                </div>
              </div>

              {/* Class */}
              <span style={{ fontSize: 13, color: tx, fontWeight: 500 }}>
                {a.class?.name} {a.class?.class ? `— ${a.class.class}` : ""}
              </span>

              {/* File Info */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: inp, borderRadius: 8, padding: "6px 10px", border: `1px solid ${brd}`, width: "fit-content", maxWidth: "100%" }}>
                <i
                  className={isPdf(a.fileName) ? "ti ti-file-type-pdf" : "ti ti-file-type-doc"}
                  style={{ fontSize: 16, color: isPdf(a.fileName) ? "#ef4444" : "#3b82f6", flexShrink: 0 }}
                />
                <span style={{ fontSize: 12, color: tx, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.fileName}
                </span>
              </div>

              {/* Duration */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ti ti-clock" style={{ fontSize: 14, color: mt }} />
                <span style={{ fontSize: 12, color: tx }}>{a.duration || "-"}</span>
              </div>

              {/* Due Date */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ti ti-calendar" style={{ fontSize: 14, color: mt }} />
                <span style={{ fontSize: 12, color: tx }}>{formatDate(a.dueDate)}</span>
              </div>

              {/* Actions: View + Delete */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14 }}>
                <button
                  onClick={() => handleView(a.fileUrl)}
                  title="View File"
                  style={{
                    background: "transparent", border: "none",
                    color: "#a855f7", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                  }}
                >
                  <i className="ti ti-eye" style={{ fontSize: 15 }} />
                  View
                </button>
                <button
                  disabled={deletingId === a._id}
                  onClick={() => handleDelete(a._id)}
                  style={{
                    background: "transparent", border: "none",
                    color: "#ef4444", fontSize: 12, fontWeight: 600,
                    cursor: deletingId === a._id ? "not-allowed" : "pointer",
                    opacity: deletingId === a._id ? 0.6 : 1,
                  }}
                >
                  {deletingId === a._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}