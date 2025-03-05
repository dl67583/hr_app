import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import {
  FaBirthdayCake,
  FaBriefcase,
  FaCalendarCheck,
  FaHospital,
} from "react-icons/fa";
import CardComponent from "../components/CardComponent";
import { Grid, Container } from "@mui/material";

const Dashboard = () => {
  const { user, token, permissions } = useContext(AuthContext);
  const [daysOff, setDaysOff] = useState(0);
  const [daysOffSpent, setDaysOffSpent] = useState(0);
  const [sickDays, setSickDays] = useState(0);
  const [birthdaysToday, setBirthdaysToday] = useState([]);

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (user?.id && permissions && token) {
      console.log("✅ Fetching dashboard data for user ID:", user.id);
      fetchDashboardData(user.id);
    } else {
      console.warn("⚠️ User ID, permissions, or token undefined. Waiting for update...");
    }
  }, [user?.id, permissions, token]); // ✅ Runs only when dependencies change

  const fetchDashboardData = async (userId) => {
    if (!token) {
      console.warn("⚠️ No token found, skipping API requests.");
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` }; // ✅ Define headers inside the function
  
    try {
      console.log("🔍 Fetching birthdays...");
      const birthdaysRes = await axios.get(`${API_BASE_URL}/api/dashboard/birthdays/today`, { headers });
  
      if (birthdaysRes.data?.birthdays) {
        setBirthdaysToday(birthdaysRes.data.birthdays);
      } else {
        console.warn("⚠️ No birthdays found in response.");
        setBirthdaysToday([]);
      }
    } catch (error) {
      console.error("🔥 Error fetching birthdays:", error.response?.data || error.message);
    }
  
    try {
      console.log("🔍 Fetching user data...");
      const userRes = await axios.get(`${API_BASE_URL}/api/users/${userId}`, { headers });
  
      if (userRes.data?.user) {
        setDaysOff(userRes.data.user.daysOff || 0);
        setDaysOffSpent(userRes.data.user.daysOffSpent || 0);
        setSickDays(userRes.data.user.sickDaysTaken || 0);
      } else {
        console.warn("⚠️ User data missing from response.");
        setDaysOff(0);
        setDaysOffSpent(0);
        setSickDays(0);
      }
    } catch (error) {
      console.error("🔥 Error fetching user data:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <CardComponent icon={<FaCalendarCheck />} title="Total Days Off" value={daysOff} />
          </Grid>
          <Grid item>
            <CardComponent icon={<FaBriefcase />} title="Days Off Spent" value={daysOffSpent} />
          </Grid>
          <Grid item>
            <CardComponent icon={<FaHospital />} title="Sick Leave Days Taken" value={sickDays} />
          </Grid>
          <Grid item>
            <CardComponent icon={<FaBirthdayCake />} title="Today's Birthdays" list={birthdaysToday} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
