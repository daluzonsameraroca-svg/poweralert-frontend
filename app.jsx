import { Routes, Route } from "react-router-dom";

/* PUBLIC */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* LAYOUT */
import MainLayout from "./components/layout/MainLayout";

/* USER */
import Dashboard from "./pages/user/Dashboard";
import Interruptions from "./pages/user/Interruptions";
import Reports from "./pages/user/Reports";
import Bills from "./pages/user/Bills";
import Notifications from "./pages/user/Notifications";
import Recommendations from "./pages/user/Recommendations";
import Announcements from "./pages/user/Announcements";
import Profile from "./pages/user/Profile";
import Settings from "./pages/user/Settings";

/* ADMIN */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageInterruptions from "./pages/admin/ManageInterruptions";
import ManageReports from "./pages/admin/ManageReports";
import ManageBills from "./pages/admin/ManageBills";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ActivityLogs from "./pages/admin/ActivityLogs";

import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* MAIN SYSTEM */}
      <Route element={<MainLayout />}>
        {/* USER */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interruptions" element={<Interruptions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/interruptions" element={<ManageInterruptions />} />
        <Route path="/admin/reports" element={<ManageReports />} />
        <Route path="/admin/bills" element={<ManageBills />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/announcements" element={<ManageAnnouncements />} />
        <Route path="/admin/activity-logs" element={<ActivityLogs />} />
      </Route>
    </Routes>
  );
}