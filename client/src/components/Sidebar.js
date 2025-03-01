import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    { name: "Departments", path: "/departments" },
    { name: "Users", path: "/users" },
    { name: "Roles", path: "/roles" },
    { name: "Requests", path: "/requests" },
    { name: "Leaves", path: "/leaves" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className="block w-full text-left mb-3 hover:bg-gray-700 p-3 rounded-lg transition-all"
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
