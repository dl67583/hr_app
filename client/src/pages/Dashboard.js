import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import {
  FaBirthdayCake,
  FaBriefcase,
  FaCalendarCheck,
  FaHospital,
  FaUsers,
} from "react-icons/fa";
import showAlert from "../components/showAlert";
import CardComponent from "../components/CardComponent";
import { Grid, Container } from "@mui/material";

const Dashboard = () => {
  const { user, token, permissions } = useContext(AuthContext);
  const [daysOff, setDaysOff] = useState(0);
  const [daysOffSpent, setDaysOffSpent] = useState(0);
  const [sickDays, setSickDays] = useState(0);
  const [birthdaysToday, setBirthdaysToday] = useState([]);

  useEffect(() => {
    if (user?.id && permissions && token) {
      console.log("✅ Fetching dashboard data for user ID:", user.id);
      fetchDashboardData(user.id);
      console.log("✅ Fetched dashboard data for user ID:", user);

    } else {
      console.warn("⚠️ User ID, permissions, or token undefined, waiting for update...");
    }
  }, [user?.id, permissions, token]); // ✅ Ensures re-fetching happens only when necessary
  
  const API_BASE_URL = "http://localhost:5000";

  const fetchDashboardData = async (userId) => {
    try {
      if (!token) {
        console.warn("⚠️ No token found, skipping API requests.");
        return;
      }
  
      const headers = { Authorization: `Bearer ${token}` };
  
      console.log("🔍 Fetching user data...");
      const userRes = await axios.get(`${API_BASE_URL}/api/users/${userId}`, { headers });
  
      if (userRes.data.user) {
        console.log("✅ User API Response:", userRes.data);
        setDaysOff(userRes.data.user.daysOff || 0);
        setSickDays(userRes.data.user.sickDaysTaken || 0);
      } else {
        console.warn("⚠️ User data missing from response.");
        setDaysOff(0);
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
          {/* <Grid item>
            <CardComponent icon={<FaUsers />} title="Department Members at Work" list={departmentMembersAtWork} />
          </Grid> */}
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
