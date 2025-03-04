import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const Navbar = () => {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      checkCurrentStatus();
    }
  }, [token, user]);

  const checkCurrentStatus = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/time-attendance/status/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsCheckedIn(response.data.isCheckedIn || false);
    } catch (error) {
      console.error("❌ Error fetching attendance status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInOut = async () => {
    try {
      const url = isCheckedIn
        ? `${API_BASE_URL}/api/time-attendance/checkout`
        : `${API_BASE_URL}/api/time-attendance/checkin`;

      await axios.post(
        url,
        { userId: user.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsCheckedIn(!isCheckedIn);
    } catch (error) {
      console.error("❌ Error processing attendance:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div className="fixed top-4 right-5 bg-white border border-[#c5c6c7] p-4 rounded-lg flex items-center gap-4">
      {user ? (
        <>
          <span className="text-blue-600 font-bold">{user.email}</span>, welcome back!
          <button
            onClick={handleCheckInOut}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-300 ${
              isCheckedIn ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-300 border border-red-700"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;