import { useState } from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Topbar from "../../components/Topbar"
import StudentAssignments from "./StudentAssignments"
import StudentSubmissions from "./StudentSubmissions"
import StudentResults from "./StudentResults"
import StudentSettings from "./StudentSettings"

function renderStudentPage(pathname: string, darkMode: boolean) {
  switch (pathname) {
    case "/student/dashboard":
      return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h1 style={{ color: darkMode ? "#fff" : "#000", fontSize: 24, marginBottom: "1rem" }}>Welcome to Student Dashboard</h1>
          <p style={{ color: darkMode ? "#ccc" : "#666" }}>Your profile has been created successfully. This is your dashboard area.</p>
        </div>
      )
    case "/student/dashboard/assignments":
      return <StudentAssignments darkMode={darkMode} />
    case "/student/dashboard/submissions":
      return <StudentSubmissions darkMode={darkMode} />
    case "/student/dashboard/results":
      return <StudentResults darkMode={darkMode} />
    case "/student/dashboard/settings":
      return <StudentSettings darkMode={darkMode} />
    default:
      return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h1 style={{ color: darkMode ? "#fff" : "#000", fontSize: 24, marginBottom: "1rem" }}>Welcome to Student Dashboard</h1>
        </div>
      )
  }
}

const pageTitles: Record<string, string> = {
  "/student/dashboard": "Student Dashboard",
  "/student/dashboard/assignments": "Assignments",
  "/student/dashboard/submissions": "Submissions",
  "/student/dashboard/results": "Results",
}

export default function StudentDashboardLayout() {
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const currentPage = pageTitles[location.pathname] ?? "Student Dashboard"

  const studentNavItems = [
    { icon: "ti-file-text", label: "Assignments", path: "/student/dashboard/assignments" },
    { icon: "ti-upload", label: "Submissions", path: "/student/dashboard/submissions" },
    { icon: "ti-chart-bar", label: "Results", path: "/student/dashboard/results" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif", background: darkMode ? "#0f0f1a" : "#f1f5f9" }}>
      <div style={{ flexShrink: 0, height: "100vh", overflowY: "auto", background: "#1a1a2e" }}>
        {/* Reusing existing Sidebar component with student nav items */}
        <Sidebar
          onSignOut={() => navigate("/")}
          items={studentNavItems}
          dashboardPath="/student/dashboard"
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: darkMode ? "#0f0f1a" : "#f1f5f9" }}>
        <Topbar
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          currentPage={currentPage}
          settingsPath="/student/dashboard/settings"
        />
        <div style={{ flex: 1, overflowY: "auto", background: darkMode ? "#0f0f1a" : "#f1f5f9", padding: "2rem" }}>
          {renderStudentPage(location.pathname, darkMode)}
        </div>
      </div>
    </div>
  )
}

