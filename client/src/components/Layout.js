import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Navbar */}
      <Navbar />

      {/* Page Content (adjusts margin based on sidebar state) */}
      <div
        className={`flex-1 transition-all ${
          isSidebarCollapsed ? "ml-24" : "ml-72"
        } mt-[6%]`}
      >
        <div className="p-5">
          <Outlet /> {/* Renders the current route's component */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
