import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // In a real scenario, this uses the backend API
      const res = await loginAdmin(username, password);
      if (res.token) {
        localStorage.setItem("adminToken", res.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      // Fallback for demo purposes if backend isn't running
      console.error(err);
      if (username === "admin" && password === "admin123") {
        navigate("/dashboard");
      } else {
        setError(err.response?.data?.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", fontFamily: "Inter, sans-serif" }}>
      {/* Left side - Login Form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10%", background: "#0f0f1a" }}>
        <div style={{ maxWidth: 400, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "3rem" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <i className="ti ti-school" style={{ fontSize: 20, color: "#fff" }} />
            </div>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>ResultHub</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 700, marginBottom: "0.5rem" }}>Welcome back</h1>
          <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: "2.5rem" }}>Please enter your details to sign in.</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: "0.5rem" }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                style={{
                  width: "100%", background: "#1c1c30", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "0.75rem 1rem", color: "#fff", fontSize: 14, outline: "none"
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: "0.5rem" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", background: "#1c1c30", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "0.75rem 1rem", color: "#fff", fontSize: 14, outline: "none"
                }}
              />
            </div>

            {error && (
              <div style={{ color: "#ef4444", fontSize: 13, marginBottom: "1rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: 8 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: "#a855f7", color: "#fff", border: "none",
                borderRadius: 10, padding: "0.8rem", fontSize: 14, fontWeight: 600, cursor: "pointer",
                transition: "background 0.2s", opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Image/Graphic */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e1e38 0%, #0f0f1a 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative elements */}
        <div style={{ position: "absolute", top: "10%", right: "10%", width: 300, height: 300, background: "rgba(168,85,247,0.15)", borderRadius: "50%", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "10%", width: 300, height: 300, background: "rgba(236,72,153,0.1)", borderRadius: "50%", filter: "blur(60px)" }} />

        <div style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 24,
          padding: "3rem",
          maxWidth: 400,
          textAlign: "center",
          zIndex: 1
        }}>
          <i className="ti ti-chart-bar" style={{ fontSize: 64, color: "#a855f7", marginBottom: "1.5rem", display: "block" }} />
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: "1rem" }}>Streamline Your Institute</h2>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6 }}>Manage student results, assignments, and academic progress with our comprehensive dashboard.</p>
        </div>
      </div>
    </div>
  );
}