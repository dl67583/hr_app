import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
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

  // ✅ Check if the user is currently checked in
  const checkCurrentStatus = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/time-attendance/status/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Attendance Status Response:", response.data);
      setIsCheckedIn(response.data.isCheckedIn || false);
    } catch (error) {
      console.error("❌ Error fetching attendance status:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check-In / Check-Out function
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

  // ✅ Prevent rendering while loading data
  if (loading) return <CircularProgress />;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          HR Management
        </Typography>
        {user ? (
          <>
            <Button color="inherit" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            {/* ✅ Check-In / Check-Out Button (No Role or Permission Checks) */}
            <Button color="inherit" onClick={handleCheckInOut}>
              {isCheckedIn ? "Check Out" : "Check In"}
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
