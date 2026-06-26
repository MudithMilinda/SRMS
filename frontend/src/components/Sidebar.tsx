import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type NavItem = {
  icon: string;
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
};

const navItems: NavItem[] = [
  { icon: "ti-layout-grid", label: "Time Table", path: "/dashboard/timetable" },
  {
    icon: "ti-book",
    label: "Subjects",
    children: [
      { label: "All Subjects", path: "/dashboard/subjects" },
      { label: "Add Subjects", path: "/dashboard/subjects" }
    ],
  },
  {
    icon: "ti-users",
    label: "Students",
    children: [
      { label: "All Students", path: "/dashboard/students/all" },
      { label: "Add Student", path: "/dashboard/students/add" },
    ],
  },
  {
    icon: "ti-users",
    label: "Teachers",
    children: [
      { label: "All Teachers", path: "/dashboard/teachers/all" },
      { label: "Add Teacher", path: "/dashboard/teachers/add" },
    ],
  },
  {
    icon: "ti-chart-bar",
    label: "Results",
    children: [
      { label: "Enter Results", path: "/dashboard/results/enter" },
      { label: "View Results", path: "/dashboard/results/view" },
      { label: "Cumulative", path: "/dashboard/results/cumulative" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside style={{
      width: 240,
      minHeight: "100vh",
      background: "#1a1a2e",
      display: "flex",
      flexDirection: "column",
      padding: "0 0 2rem 0",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem 1.5rem",
        gap: 8,
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <i className="ti ti-school" style={{ fontSize: 24, color: "#fff" }} aria-hidden="true" />
        </div>
        <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500, textAlign: "center", lineHeight: 1.4 }}>
          Result Arena College
        </span>
      </div>

      {/* Dashboard link */}
      <div style={{ padding: "1.25rem 0.75rem 0.5rem" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0.6rem 0.85rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: isActive("/dashboard") ? "rgba(168,85,247,0.25)" : "transparent",
            color: isActive("/dashboard") ? "#c084fc" : "#94a3b8",
            fontWeight: isActive("/dashboard") ? 500 : 400,
            fontSize: 14,
            textAlign: "left",
            transition: "background 0.15s",
          }}
        >
          <i className="ti ti-layout-dashboard" style={{ fontSize: 18 }} aria-hidden="true" />
          Dashboards
          {isActive("/dashboard") && (
            <span style={{
              marginLeft: "auto", width: 6, height: 6, borderRadius: "50%",
              background: "#a855f7",
            }} />
          )}
        </button>
      </div>

      {/* Pages section */}
      <div style={{ padding: "0.75rem 0.75rem 0", flex: 1 }}>
        <p style={{
          fontSize: 10, fontWeight: 500, color: "#475569",
          letterSpacing: "0.08em", textTransform: "uppercase",
          margin: "0 0 0.5rem 0.85rem"
        }}>
          Pages
        </p>

        {navItems.map((item) => (
          <div key={item.label}>
            <button
              onClick={() => {
                if (item.path) {
                  // Children nathi — directly navigate
                  navigate(item.path);
                } else {
                  // Children athi — expand/collapse
                  toggle(item.label);
                }
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0.6rem 0.85rem",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: item.path && isActive(item.path)
                  ? "rgba(168,85,247,0.25)"
                  : expanded === item.label
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
                color: item.path && isActive(item.path)
                  ? "#c084fc"
                  : expanded === item.label
                  ? "#e2e8f0"
                  : "#94a3b8",
                fontWeight: item.path && isActive(item.path) ? 500 : 400,
                fontSize: 14,
                textAlign: "left",
                transition: "background 0.15s",
                marginBottom: 2,
              }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 18 }} aria-hidden="true" />
              <span style={{ flex: 1 }}>{item.label}</span>
              {/* Children athi nisa chevron show karanna */}
              {item.children && (
                <i
                  className={`ti ${expanded === item.label ? "ti-chevron-up" : "ti-chevron-down"}`}
                  style={{ fontSize: 14, color: "#475569" }}
                  aria-hidden="true"
                />
              )}
            </button>

            {/* Children list */}
            {expanded === item.label && item.children && (
              <div style={{ paddingLeft: "2.5rem", marginBottom: 4 }}>
                {item.children.map((child) => (
                  <button
                    key={child.label}
                    onClick={() => navigate(child.path)}
                    style={{
                      width: "100%",
                      display: "block",
                      padding: "0.4rem 0.75rem",
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      background: isActive(child.path) ? "rgba(168,85,247,0.2)" : "transparent",
                      color: isActive(child.path) ? "#c084fc" : "#64748b",
                      fontSize: 13,
                      textAlign: "left",
                      transition: "background 0.15s",
                      marginBottom: 1,
                    }}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}