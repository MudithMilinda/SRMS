import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/Landingpage"
import DashboardLayout from "./pages/Dashboardlayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/dashboard/timetable" element={<DashboardLayout />} />
        <Route path="/dashboard/subjects" element={<DashboardLayout />} />
        <Route path="/dashboard/students/all" element={<DashboardLayout />} />
        <Route path="/dashboard/students/add" element={<DashboardLayout />} />
        <Route path="/dashboard/teachers/all" element={<DashboardLayout />} />
        <Route path="/dashboard/teachers/add" element={<DashboardLayout />} />
        <Route path="/dashboard/results/enter" element={<DashboardLayout />} />
        <Route path="/dashboard/results/view" element={<DashboardLayout />} />
        <Route path="/dashboard/results/cumulative" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  )
}