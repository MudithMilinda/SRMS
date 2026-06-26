type TopbarProps = {
  darkMode: boolean
  onToggleDark: () => void
  currentPage: string
  onSignOut?: () => void
}

export default function Topbar({ darkMode, onToggleDark, currentPage, onSignOut }: TopbarProps) {
  const border = darkMode ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const bg = darkMode ? "#12122b" : "#ffffff"
  const text = darkMode ? "#e2e8f0" : "#1e293b"
  const muted = darkMode ? "#64748b" : "#94a3b8"

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
    }}>
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

      <h1 style={{ margin: 0, fontSize: 15, fontWeight: 500, color: text, flex: 2, textAlign: "center" }}>
        {currentPage}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, justifyContent: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: muted }}>Night mode</span>
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

        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "transparent", border: "none", cursor: "pointer",
          color: muted, fontSize: 13, padding: "4px 8px", borderRadius: 6,
        }}>
          <i className="ti ti-user-circle" style={{ fontSize: 18 }} aria-hidden="true" />
          Profile
        </button>

        <button
          onClick={onSignOut}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", cursor: "pointer",
            color: muted, fontSize: 13, padding: "4px 8px", borderRadius: 6,
          }}
        >
          <i className="ti ti-logout" style={{ fontSize: 18 }} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </header>
  )
}