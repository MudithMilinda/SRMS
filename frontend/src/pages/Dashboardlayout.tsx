import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import Dashboard from "../components/Dashboard"
import Timetable from "./Timetable" 
import SubjectsPage from "./Subjectspage"

const pageTitles: Record<string, string> = {
  "/dashboard":                    "Dashboard",
  "/dashboard/timetable":          "Time Table",
  "/dashboard/subjects":           "Subjects",
  "/dashboard/students/all":       "All Students",
  "/dashboard/students/add":       "Add Student",
  "/dashboard/teachers/all":       "All Teachers",
  "/dashboard/teachers/add":       "Add Teacher",
  "/dashboard/results/enter":      "Enter Results",
  "/dashboard/results/view":       "View Results",
  "/dashboard/results/cumulative": "Cumulative",
}

function renderPage(pathname: string, darkMode: boolean) {
  switch (pathname) {
    case "/dashboard":           return <Dashboard darkMode={darkMode} />
    case "/dashboard/timetable": return <Timetable darkMode={darkMode} />
    case "/dashboard/subjects":           return <SubjectsPage darkMode={darkMode} />
    case "/dashboard/students/all":       return <div style={{padding:32,color:"#94a3b8"}}>All Students — coming soon</div>
    case "/dashboard/students/add":       return <div style={{padding:32,color:"#94a3b8"}}>Add Student — coming soon</div>
    case "/dashboard/teachers/all":       return <div style={{padding:32,color:"#94a3b8"}}>All Teachers — coming soon</div>
    case "/dashboard/teachers/add":       return <div style={{padding:32,color:"#94a3b8"}}>Add Teacher — coming soon</div>
    case "/dashboard/results/enter":      return <div style={{padding:32,color:"#94a3b8"}}>Enter Results — coming soon</div>
    case "/dashboard/results/view":       return <div style={{padding:32,color:"#94a3b8"}}>View Results — coming soon</div>
    case "/dashboard/results/cumulative": return <div style={{padding:32,color:"#94a3b8"}}>Cumulative — coming soon</div>
    default:                              return <Dashboard darkMode={darkMode} />
  }
}

export default function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const currentPage = pageTitles[location.pathname] ?? "Dashboard"

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          currentPage={currentPage}
          onSignOut={() => navigate("/")}
        />
        {renderPage(location.pathname, darkMode)}
      </div>
    </div>
  )
}