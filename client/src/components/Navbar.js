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
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState(null);

  useEffect(() => {
    if (token && user) {
      checkCurrentStatus();
    }
  }, [token, user]);

  useEffect(() => {
    // If checked in, start the ticking clock
    let intervalId;

    if (isCheckedIn) {
      intervalId = setInterval(() => {
        setClock(new Date()); // Update the clock every second
      }, 1000);
    } else {
      // Clear the clock when checking out
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId); // Clean up the interval when component unmounts
    };
  }, [isCheckedIn]);

  const checkCurrentStatus = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/time-attendance/status/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsCheckedIn(response.data.isCheckedIn || false);
      if (response.data.checkInTime) {
        setCheckInTime(new Date(response.data.checkInTime));
      }
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

      const response = await axios.post(
        url,
        { userId: user.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsCheckedIn(!isCheckedIn);
      if (!isCheckedIn) {
        // When checked in, set the current time
        setCheckInTime(new Date());
        setClock(new Date()); // Start the clock immediately
      } else {
        setClock(null); // Stop the clock when checked out
      }
    } catch (error) {
      console.error("❌ Error processing attendance:", error);
    }
  };

  if (loading) return <CircularProgress />;

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
            {isCheckedIn && clock && (
              <div className="text-gray-500 text-sm flex items-center gap-2">
                <p>Checked in at: {checkInTime && checkInTime.toLocaleTimeString()}</p>
                <p>Current Time: {clock && clock.toLocaleTimeString()}</p>
              </div>
            )}

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
    </div>
  );
};

export default Navbar;
