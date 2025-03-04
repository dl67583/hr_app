import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import {
  FaTachometerAlt,
  FaBuilding,
  FaUsers,
  FaUserShield,
  FaClipboardList,
} from "react-icons/fa";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const [logoText, setLogoText] = useState("HR Management");

  useEffect(() => {
    if (!isCollapsed) {
      const timeout = setTimeout(() => setLogoText("HR Management"), 150);
      return () => clearTimeout(timeout);
    } else {
      setLogoText("HR");
    }
  }, [isCollapsed]);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Departments", path: "/departments", icon: <FaBuilding /> },
    { name: "Users", path: "/users", icon: <FaUsers /> },
    { name: "Roles", path: "/roles", icon: <FaUserShield /> },
    { name: "Requests", path: "/requests", icon: <FaClipboardList /> },
  ];

  return (
    <div
      className={`h-[calc(100vh-35px)] bg-white border border-[#c5c6c7] p-4 fixed left-4 top-4 rounded-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className="flex justify-center items-center mb-6 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Typography
          variant="h6"
          className="text-gray-800 transition-opacity duration-300"
        >
          {logoText}
        </Typography>
      </div>

      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`flex items-center w-full text-left mb-4 p-3 rounded-lg transition-all ${
            isCollapsed ? "justify-center" : "hover:bg-gray-100"
          } text-gray-600 font-medium`}
          onClick={() => navigate(item.path)}
        >
          <span className="text-gray-500 text-lg">{item.icon}</span>
          {!isCollapsed && <span className="ml-3">{item.name}</span>}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
