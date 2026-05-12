import { useEffect, useState } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Interruptions from "./pages/Interruptions";
import Reports from "./pages/Reports";
import Bills from "./pages/Bills";
import Notifications from "./pages/Notifications";
import Recommendations from "./pages/Recommendations";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import ManageInterruptions from "./pages/ManageInterruptions";
import ManageReports from "./pages/ManageReports";
import ManageBills from "./pages/ManageBills";
import ManageUsers from "./pages/ManageUsers";
import ActivityLogs from "./pages/ActivityLogs";
import ManageAnnouncements from "./pages/ManageAnnouncements";


import UserSidebar from "./components/UserSidebar";
import AdminSidebar from "./components/AdminSidebar";


export default function App() {
  useEffect(() => {

  fetch("http://127.0.0.1:8000/api/generate-due-alerts")
    .catch(() => console.log("Failed to generate due alerts"));

}, []);
  const [page, setPage] = useState("landing");

  // temporary role switch for testing
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user")) || null
);

  if (page === "landing") {
    return <Landing setPage={setPage} />;
  }

  if (page === "login") {
    return (
      <Login
        setPage={setPage}
        setRole={setRole}
        setUser={setUser} 
      />
    );
  }

  if (page === "register") {
    return <Register />;
  }

  return (
    <div className="layout">
      {role === "admin" ? (
        <AdminSidebar setPage={setPage} />
      ) : (
        <UserSidebar setPage={setPage} />
      )}

      <main className="main-content">
       
       <Topbar user={user} />

        {/* USER PAGES */}
        {role === "user" && page === "dashboard" && <Dashboard />}
        {role === "user" && page === "interruptions" && <Interruptions />}
        {role === "user" && page === "reports" && <Reports />}
        {role === "user" && page === "bills" && <Bills />}
        {role === "user" && page === "notifications" && <Notifications />}
        {role === "user" && page === "recommendations" && <Recommendations />}
        {role === "user" && page === "announcements" && <Announcements />}
        {role === "user" && page === "profile" && <Profile />}

        {/* ADMIN PAGES */}
        {role === "admin" && page === "adminDashboard" && <AdminDashboard />}
        {role === "admin" && page === "adminDashboard" && <AdminDashboard />}
        {role === "admin" && page === "manageInterruptions" && <ManageInterruptions />}
        {role === "admin" && page === "manageReports" && <ManageReports />}
        {role === "admin" && page === "manageBills" && <ManageBills />}
        {role === "admin" && page === "manageUsers" && <ManageUsers />}
        {role === "admin" && page === "activityLogs" && <ActivityLogs />}
        {role === "admin" && page === "manageAnnouncements" && <ManageAnnouncements />}
              </main>
    </div>
  );
}
