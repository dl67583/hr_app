import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const Navbar = () => {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    if (token && user?.id) {
      checkCurrentStatus();
    }
  }, [user]);

  useEffect(() => {
    let intervalId;

    if (isCheckedIn && checkInTime) {
      intervalId = setInterval(() => {
        const now = new Date();
        const checkInDate = new Date(checkInTime);
        const diff = Math.floor((now - checkInDate) / 1000);

        const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const seconds = String(diff % 60).padStart(2, "0");

        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else {
      clearInterval(intervalId);
      setElapsedTime("");
    }

    return () => clearInterval(intervalId);
  }, [isCheckedIn, checkInTime]);

  const handleCheckInOut = async () => {
    try {
      setLoading(true); // Show empty button text while processing

      const url = isCheckedIn
        ? `${API_BASE_URL}/api/time-attendance/checkout`
        : `${API_BASE_URL}/api/time-attendance/checkin`;

      const response = await axios.post(
        url,
        { userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!isCheckedIn) {
        setIsCheckedIn(true);
        setCheckInTime(new Date().toISOString()); // Store check-in time
      } else {
        setIsCheckedIn(false);
        setCheckInTime(null);
        setElapsedTime("");
      }
    } catch (error) {
      console.error("❌ Error processing attendance:", error);
    } finally {
      setLoading(false);
    }
  };
  const checkCurrentStatus = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/time-attendance/status/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.isCheckedIn) {
        setIsCheckedIn(true);
        setCheckInTime(response.data.checkInTime);
      } else {
        setIsCheckedIn(false);
        setCheckInTime(null);
        setElapsedTime("");
      }
    } catch (error) {
      console.error("❌ Error fetching attendance status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Prevent rendering if user isn't loaded

  return (
    <div className="fixed top-4 right-5 bg-white border border-[#c5c6c7] p-4 rounded-lg flex justify-between items-center w-[90%] max-w-[1200px]">
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-black font-bold">{`Welcome, ${user.email}`}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button
              onClick={handleCheckInOut}
              className={`px-6 py-2 w-[120px] h-[40px] rounded-lg text-white font-semibold transition duration-300 ${
                isCheckedIn === null
                  ? "opacity-0"
                  : isCheckedIn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isCheckedIn === null
                ? "⏳"
                : isCheckedIn
                ? elapsedTime
                : "Check In"}
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
    </div>
  );
};

export default Navbar;
