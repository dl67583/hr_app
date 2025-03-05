import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import {
  FaTachometerAlt,
  FaBuilding,
  FaUsers,
  FaUserShield,
  FaClipboardList,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions } = useContext(AuthContext);
  const [logoText, setLogoText] = useState("HR Management");

  useEffect(() => {
    if (!isCollapsed) {
      const timeout = setTimeout(() => setLogoText("HR Management"), 150);
      return () => clearTimeout(timeout);
    } else {
      setLogoText("HR");
    }
  }, [isCollapsed]);

  if (!permissions || !permissions.resources || Object.keys(permissions.resources).length === 0) {
    return (
      <div className="h-[calc(100vh-35px)] bg-white border p-4 fixed left-4 top-4 rounded-lg w-64">
        <p>Loading sidebar...</p>
      </div>
    );
  }

  // console.log("🛠️ Sidebar Permissions Data:", permissions.resources);

  // ✅ Sidebar menu items
  const menuItems = [
    // { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt />, resource: "Dashboard" },
    { name: "Departments", path: "/departments", icon: <FaBuilding />, resource: "Departments" },
    { name: "Users", path: "/users", icon: <FaUsers />, resource: "Users" },
    { name: "Roles", path: "/roles", icon: <FaUserShield />, resource: "Roles" },
    { name: "Requests", path: "/requests", icon: <FaClipboardList />, resource: "Requests" },
    { name: "Leaves", path: "/leaves", icon: <FaClipboardList />, resource: "Leaves" },
  ];

  // ✅ Filter Sidebar Items Based on Permissions
  const filteredMenuItems = menuItems.filter((item) => {
    if (!permissions || !permissions.resources || !permissions.resources[item.resource]) {
        console.warn(`🚨 No permissions found for resource: ${item.resource}`);
        return false;
    }

    const resource = permissions.resources[item.resource];

    // ✅ Ensure resource exists and has "read" action
    if (!resource.actions || !resource.actions.includes("read")) {
        console.warn(`🚨 Missing 'read' permission for: ${item.resource}`);
        return false;
    }

    // ✅ Allow "all" and "department" scoped resources
    if (resource.scope === "all" || resource.scope === "department") {
        return true;
    }

    // ✅ Allow "own" scope for all valid resources
    if (resource.scope === "own") {
        return ["Users", "Leaves", "Requests", "Roles", "Departments", "TimeAttendance"].includes(item.resource);
    }

    return false;
  });

  return (
    <div
      className={`h-[calc(100vh-35px)] bg-white border p-4 fixed left-4 top-4 rounded-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className="flex justify-center items-center mb-6 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Typography variant="h6" className="text-gray-800">{logoText}</Typography>
      </div>

      {filteredMenuItems.map((item, index) => (
        <button
          key={index}
          className={`flex items-center w-full text-left mb-4 p-3 rounded-lg transition-all font-medium ${
            location.pathname === item.path ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          } ${isCollapsed ? "justify-center" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <span className="text-lg">{item.icon}</span>
          {!isCollapsed && <span className="ml-3">{item.name}</span>}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
