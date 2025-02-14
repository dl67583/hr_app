import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setToken(null);
    setRoles([]);
    setPermissions([]);
    navigate("/login");
  }, [navigate]);

  const login = async (email, password) => {
    try {
      console.log("🔍 Sending login request...");
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      console.log("✅ Login successful. Token received:", data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);

      const decoded = jwtDecode(data.accessToken);
      setUser(decoded);
      fetchUserRolesAndPermissions(decoded.id);

      navigate("/dashboard");
    } catch (error) {
      console.error("🔥 Login failed:", error.response?.data || error.message);
    }
  };

  const fetchUserRolesAndPermissions = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users/${userId}/roles-permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error("❌ Error fetching user roles and permissions:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, roles, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
