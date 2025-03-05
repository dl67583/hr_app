import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import showAlert from "../components/showAlert";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // ✅ Ensure user is set
        if (decoded.id) {
          fetchUserRolesAndPermissions(decoded.id, token);
        }
      } catch (error) {
        console.error("❌ Invalid token. Logging out...");
        logout();
      }
    }
  }, [token]);
  
  // ✅ Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); // ✅ Remove refresh token on logout
    setUser(null);
    setToken(null);
    setRoles([]);
    setPermissions([]);
    navigate("/login"); // Redirect to login upon logout
  }, [navigate]);

  // ✅ Function to refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("⚠️ No refresh token found, logging out.");
        logout();
        return;
      }

      // console.log("🔄 Refreshing access token...");
      const { data } = await axios.post("http://localhost:5000/api/auth/refresh-token", {
        refreshToken,
      });

      // console.log("✅ New access token received:", data.accessToken);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken); // ✅ Update refresh token

      setToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error("❌ Refresh token failed, logging out.");
      logout();
    }
  };

  // ✅ Function to handle login
  const login = async (email, password) => {
    try {
      // console.log("🔍 Sending login request...");
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // console.log("✅ Login successful. Token received:", data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken); // ✅ Save refresh token

      setToken(data.accessToken);

      const decoded = jwtDecode(data.accessToken);
      setUser(decoded);
      fetchUserRolesAndPermissions(decoded.id, data.accessToken);

      navigate("/dashboard");
    } catch (error) {
      console.error("🔥 Login failed:", error.response?.data || error.message);
      showAlert("Error!", `${error.response?.data?.message || error.message}`, "error");
    }
  };

  // ✅ Fetch User Roles and Permissions
  const fetchUserRolesAndPermissions = async (userId, accessToken) => {
    try {
      // console.log("📡 Fetching roles & permissions for user ID:", userId);
  
      if (!userId || !accessToken) {
        console.warn("⚠️ Skipping API call: Missing user ID or token");
        return;
      }
  
      const response = await axios.get(`http://localhost:5000/api/users/permissions`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      console.log("📌 API Response (Roles & Permissions):", response.data);
  
      // ✅ Store fields, scopes, and actions correctly
      setRoles(response.data.roles || []);
      setPermissions({
        resources: response.data.resources || {},
        scopes: new Set(response.data.scopes || []), // Convert to Set for easy lookups
      });
      
      
  
      // console.log("✅ Stored Permissions in AuthContext:", {
      //   fields: response.data.fields,
      //   scopes: response.data.scopes,
      //   actions: response.data.actions,
      // });
    } catch (error) {
      console.error("❌ Error fetching user roles and permissions:", error.response?.data || error.message);
      showAlert("Error!", `${error.response?.data?.message || error.message}`, "error");
      setPermissions({ fields: [], scopes: [], actions: [] }); // Ensure it resets on failure
    }
  };
  

  // ✅ Automatically Refresh Token 5 Minutes Before Expiry
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        if (!permissions.length) {
          fetchUserRolesAndPermissions(decoded.id, token);
        }

        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;

        if (timeLeft <= 0) {
          console.warn("⚠️ Token expired. Logging out...");
          logout();
        } else {
          // ✅ Refresh token 5 minutes before expiry
          const refreshTime = Math.max(timeLeft - 5 * 60 * 1000, 0);
          const timeout = setTimeout(async () => {
            // console.log("🔄 Attempting token refresh before expiry...");
            await refreshAccessToken();
          }, refreshTime);

          return () => clearTimeout(timeout); // Cleanup timeout on unmount
        }
      } catch (error) {
        console.error("❌ Invalid token. Logging out...");
        showAlert("Error!", ` ${error.response?.data?.message || error.message}`, "error");
        logout();
      }
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, roles, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
