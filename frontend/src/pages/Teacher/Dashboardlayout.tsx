import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Topbar from "../../components/Topbar"
import Dashboard from "../../components/Dashboard"
import Timetable from "./Timetable"
import ClassesPage from "./Classespage"
import AddStudent from "./AddStudent"
import AllStudents from "./AllStudents"
import AllAssignments from "./AllAssignments"
import AddAssignment from "./AddAssignment"
import EnterResults from "./EnterResults"
import ViewResults from "./ViewResults"
import Profile from "./Profile"
import Settings from "./Settings"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/timetable": "Time Table",
  "/dashboard/classes": "Classes",
  "/dashboard/students/all": "All Students",
  "/dashboard/students/add": "Add Student",
  "/dashboard/assignments/all": "All Assignments",
  "/dashboard/assignments/add": "Add Assignment",
  "/dashboard/results/enter": "Enter Results",
  "/dashboard/results/view": "View Results",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
}

function renderPage(pathname: string, darkMode: boolean) {
  switch (pathname) {
    case "/dashboard": return <Dashboard darkMode={darkMode} />
    case "/dashboard/timetable": return <Timetable darkMode={darkMode} />
    case "/dashboard/classes": return <ClassesPage darkMode={darkMode} />
    case "/dashboard/students/all": return <AllStudents darkMode={darkMode} />
    case "/dashboard/students/add": return <AddStudent darkMode={darkMode} />
    case "/dashboard/assignments/all": return <AllAssignments darkMode={darkMode} />
    case "/dashboard/assignments/add": return <AddAssignment darkMode={darkMode} />
    case "/dashboard/results/enter": return <EnterResults darkMode={darkMode} />
    case "/dashboard/results/view": return <ViewResults darkMode={darkMode} />
    case "/dashboard/profile": return <Profile darkMode={darkMode} />
    case "/dashboard/settings": return <Settings darkMode={darkMode} />
    default: return <Dashboard darkMode={darkMode} />
  }
}

export default function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  const currentPage = pageTitles[location.pathname] ?? "Dashboard"

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif", background: darkMode ? "#0f0f1a" : "#f1f5f9" }}>
      <div style={{ flexShrink: 0, height: "100vh", overflowY: "auto", background: "#1a1a2e" }}>
        <Sidebar onSignOut={() => {
          localStorage.removeItem("adminToken");
          navigate("/admin");
        }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: darkMode ? "#0f0f1a" : "#f1f5f9" }}>
        <Topbar
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          currentPage={currentPage}
        />
        <div style={{ flex: 1, overflowY: "auto", background: darkMode ? "#0f0f1a" : "#f1f5f9" }}>
          {renderPage(location.pathname, darkMode)}
        </div>
      </div>
    </div>
  )
}