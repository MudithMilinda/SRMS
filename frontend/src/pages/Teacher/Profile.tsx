import React from "react";

type ProfileProps = {
  darkMode: boolean;
};

export default function Profile({ darkMode: d }: ProfileProps) {
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#94a3b8";

  return (
    <main style={{ flex: 1, background: bg, minHeight: "100vh", padding: "2rem", overflowY: "auto" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 1.5rem", fontSize: 24, fontWeight: 700, color: tx }}>User Profile</h1>

        <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, padding: "2rem", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          {/* Avatar Section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
            }}>
              <span style={{ color: "#fff", fontSize: 48, fontWeight: 700 }}>A</span>
            </div>
            <button style={{
              padding: "0.5rem 1rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: "rgba(168,85,247,0.1)", border: "none", color: "#a855f7", cursor: "pointer"
            }}>
              Change Picture
            </button>
          </div>

          {/* User Details */}
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: "0 0 0.25rem", fontSize: 20, fontWeight: 600, color: tx }}>Admin User</h2>
            <p style={{ margin: "0 0 1.5rem", fontSize: 14, color: mt }}>Administrator</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: mt, marginBottom: 4 }}>Email</label>
                <p style={{ margin: 0, fontSize: 14, color: tx }}>admin@school.com</p>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: mt, marginBottom: 4 }}>Phone</label>
                <p style={{ margin: 0, fontSize: 14, color: tx }}>+94 77 123 4567</p>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: mt, marginBottom: 4 }}>Role</label>
                <p style={{ margin: 0, fontSize: 14, color: tx }}>System Administrator</p>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: mt, marginBottom: 4 }}>Joined Date</label>
                <p style={{ margin: 0, fontSize: 14, color: tx }}>January 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

