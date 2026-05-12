import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


export default function MainLayout() {
  const location = useLocation();
  const hideTopbar = location.pathname === "/profile";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="content-area">
        {!hideTopbar && <Topbar />}

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}