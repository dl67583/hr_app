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
import CardComponent from "../components/CardComponent"; // Adjust path if necessary
import { Grid, Container } from "@mui/material";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [daysOff, setDaysOff] = useState(0);
  const [daysOffSpent, setDaysOffSpent] = useState(0);
  const [sickDays, setSickDays] = useState(0);
  const [birthdaysToday, setBirthdaysToday] = useState([]);
  const [departmentMembersAtWork, setDepartmentMembersAtWork] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      console.log("✅ Fetching dashboard data for user ID:", user.id);
      fetchDashboardData(user.id);
    } else {
      console.warn(
        "⚠️ User ID is undefined, waiting for AuthContext to update..."
      );
    }
  }, [user]);

  const fetchDashboardData = async (userId) => {
    try {
      if (!token) {
        console.warn("⚠️ No token found, skipping API requests.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const userRes = await axios.get(`/api/users/${userId}`, { headers });
      setDaysOff(userRes.data.user.daysOff || 0);
      setSickDays(userRes.data.user.sickDaysTaken || 0);

      const leaveRes = await axios.get(`/api/leaves?userId=${userId}`, {
        headers,
      });
      setDaysOffSpent(leaveRes.data.length || 0);

      const birthdayRes = await axios.get(`/api/users/birthdays/today`, {
        headers,
      });
      setBirthdaysToday(
        Array.isArray(birthdayRes.data) ? birthdayRes.data : []
      );

      const attendanceRes = await axios.get(
        `/api/timeAttendance/atWork?departmentId=${userRes.data.user.departmentId}`,
        { headers }
      );
      setDepartmentMembersAtWork(
        Array.isArray(attendanceRes.data) ? attendanceRes.data : []
      );
    } catch (error) {
      console.error(
        "🔥 Error fetching dashboard data:",
        error.response?.data || error.message
      );
      showAlert(
        "Error!",
        ` ${error.response?.data?.message || error.message}`,
        "error"
      );
    }
  };

  return (
    <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <CardComponent
              icon={<FaCalendarCheck />}
              title="Total Days Off"
              value={daysOff}
            />
          </Grid>
          <Grid item>
            <CardComponent
              icon={<FaBriefcase />}
              title="Days Off Spent"
              value={daysOffSpent}
            />
          </Grid>
          <Grid item>
            <CardComponent
              icon={<FaHospital />}
              title="Sick Leave Days Taken"
              value={sickDays}
            />
          </Grid>
          <Grid item>
            <CardComponent
              icon={<FaBirthdayCake />}
              title="Today's Birthdays"
              list={birthdaysToday}
            />
          </Grid>
          <Grid item>
            <CardComponent
              icon={<FaUsers />}
              title="Department Members at Work"
              list={departmentMembersAtWork}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
