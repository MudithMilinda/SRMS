import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/Teacher/Landingpage"
import DashboardLayout from "./pages/Teacher/Dashboardlayout"
import AdminLogin from "./pages/Teacher/AdminLogin"
import CreateStudentProfile from "./pages/Students/CreateProfile"
import StudentDashboardLayout from "./pages/Students/StudentDashboardLayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/student/profile/create" element={<CreateStudentProfile />} />
        <Route path="/student/dashboard" element={<StudentDashboardLayout />} />
        <Route path="/student/dashboard/assignments" element={<StudentDashboardLayout />} />
        <Route path="/student/dashboard/submissions" element={<StudentDashboardLayout />} />
        <Route path="/student/dashboard/results" element={<StudentDashboardLayout />} />
        <Route path="/student/dashboard/settings" element={<StudentDashboardLayout />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/dashboard/timetable" element={<DashboardLayout />} />
        <Route path="/dashboard/classes" element={<DashboardLayout />} />
        <Route path="/dashboard/students/all" element={<DashboardLayout />} />
        <Route path="/dashboard/students/add" element={<DashboardLayout />} />
        <Route path="/dashboard/assignments/all" element={<DashboardLayout />} />
        <Route path="/dashboard/assignments/add" element={<DashboardLayout />} />
        <Route path="/dashboard/results/enter" element={<DashboardLayout />} />
        <Route path="/dashboard/results/view" element={<DashboardLayout />} />
        <Route path="/dashboard/profile" element={<DashboardLayout />} />
        <Route path="/dashboard/settings" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  )
}