import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

type TopbarProps = {
  darkMode: boolean
  onToggleDark: () => void
  currentPage: string
  settingsPath?: string
}

export default function Topbar({ darkMode, onToggleDark, currentPage, settingsPath = "/dashboard/settings" }: TopbarProps) {
  const border = darkMode ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const bg = darkMode ? "#12122b" : "#ffffff"
  const text = darkMode ? "#e2e8f0" : "#1e293b"
  const muted = darkMode ? "#64748b" : "#94a3b8"
  const card = darkMode ? "#1c1c30" : "#ffffff"
  const cardBrd = darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"
  const tx = darkMode ? "#e2e8f0" : "#0f172a"

  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header style={{
      height: 60,
      background: bg,
      borderBottom: `0.5px solid ${border}`,
      display: "flex",
      alignItems: "center",
      padding: "0 1.5rem",
      gap: 12,
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 10,
      zIndex: 50,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        <i className="ti ti-layout-dashboard" style={{ fontSize: 14, color: muted }} aria-hidden="true" />
        <span style={{ fontSize: 12, color: muted }}>/</span>
        <span style={{ fontSize: 13, color: muted }}>Dashboard</span>
        {currentPage !== "Dashboard" && (
          <>
            <span style={{ fontSize: 12, color: muted }}>/</span>
            <span style={{ fontSize: 13, color: muted }}>{currentPage}</span>
          </>
        )}
      </div>

      {/* Page title */}
      <h1 style={{ margin: 0, fontSize: 15, fontWeight: 500, color: text, flex: 2, textAlign: "center" }}>
        {currentPage}
      </h1>

      {/* Right section */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, justifyContent: "flex-end" }}>
        {/* Dark mode toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: muted }}>Dark mode</span>
          <button
            onClick={onToggleDark}
            role="switch"
            aria-checked={darkMode}
            style={{
              width: 36, height: 20, borderRadius: 20,
              background: darkMode ? "#a855f7" : "#e2e8f0",
              border: "none", cursor: "pointer", position: "relative",
              transition: "background 0.2s",
              padding: 0,
            }}
          >
            <span style={{
              position: "absolute",
              top: 3, left: darkMode ? 19 : 3,
              width: 14, height: 14, borderRadius: "50%",
              background: "#fff",
              transition: "left 0.2s",
              display: "block",
            }} />
          </button>
        </div>

        {/* Avatar + Dropdown */}
        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "transparent", border: "none", cursor: "pointer",
              padding: "4px 6px", borderRadius: 8,
              transition: "background 0.15s",
            }}
          >
            {/* Avatar circle */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>A</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: text, lineHeight: 1.2 }}>Admin</p>
              <p style={{ margin: 0, fontSize: 11, color: muted, lineHeight: 1.2 }}>Administrator</p>
            </div>
            <i
              className={`ti ${dropOpen ? "ti-chevron-up" : "ti-chevron-down"}`}
              style={{ fontSize: 13, color: muted, marginLeft: 2 }}
            />
          </button>

          {/* Dropdown Menu */}
          {dropOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: card,
              border: `0.5px solid ${cardBrd}`,
              borderRadius: 12,
              padding: "8px",
              minWidth: 180,
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              zIndex: 100,
            }}>
              {/* User info header */}
              <div style={{ padding: "8px 10px 10px", borderBottom: `0.5px solid ${cardBrd}`, marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>A</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tx }}>Admin User</p>
                    <p style={{ margin: 0, fontSize: 11, color: muted }}>admin@school.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              {[
                { icon: "ti-settings", label: "Settings", path: settingsPath },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    setDropOpen(false)
                    navigate(item.path)
                  }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px", borderRadius: 8,
                    border: "none", background: "transparent",
                    color: tx, fontSize: 13, cursor: "pointer",
                    textAlign: "left", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.06)" : "#f1f5f9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <i className={`ti ${item.icon}`} style={{ fontSize: 16, color: muted }} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}