import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { FaBirthdayCake, FaBriefcase, FaCalendarCheck, FaHospital, FaUsers } from "react-icons/fa";
import showAlert from "../components/showAlert";
// import "./Dashboard.css";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [daysOff, setDaysOff] = useState(0);
  const [daysOffSpent, setDaysOffSpent] = useState(0);
  const [sickDays, setSickDays] = useState(0);
  const [birthdaysToday, setBirthdaysToday] = useState([]);
  const [departmentMembersAtWork, setDepartmentMembersAtWork] = useState([]);

  useEffect(() => {
    if (user && user.id) { // ✅ Ensure user is loaded
      console.log("✅ Fetching dashboard data for user ID:", user.id);
      fetchDashboardData(user.id);
    } else {
      console.warn("⚠️ User ID is undefined, waiting for AuthContext to update...");
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
  
      const leaveRes = await axios.get(`/api/leaves?userId=${userId}`, { headers });
      setDaysOffSpent(leaveRes.data.length || 0);
  
      // Ensure API response is an array
      const birthdayRes = await axios.get(`/api/users/birthdays/today`, { headers });
      setBirthdaysToday(Array.isArray(birthdayRes.data) ? birthdayRes.data : []);
  
      const attendanceRes = await axios.get(`/api/timeAttendance/atWork?departmentId=${userRes.data.user.departmentId}`, { headers });
      setDepartmentMembersAtWork(Array.isArray(attendanceRes.data) ? attendanceRes.data : []);
    } catch (error) {
      console.error("🔥 Error fetching dashboard data:", error.response?.data || error.message);
      showAlert("Error!",` ${error.response?.data?.message || error.message}`, "error");

    }
  };
  

  return (
    <div className="dashboard">
      <h2>Employee Dashboard</h2>
      <div className="dashboard-grid">
        <Card icon={<FaCalendarCheck />} title="Total Days Off" value={daysOff} />
        <Card icon={<FaBriefcase />} title="Days Off Spent" value={daysOffSpent} />
        <Card icon={<FaHospital />} title="Sick Leave Days Taken" value={sickDays} />
        <Card icon={<FaBirthdayCake />} title="Today's Birthdays" list={birthdaysToday} />
        <Card icon={<FaUsers />} title="Department Members at Work" list={departmentMembersAtWork} />
      </div>
    </div>
  );
};
const Card = ({ icon, title, value, list }) => {
  // Ensure `list` is an array before using `.map`
  const safeList = Array.isArray(list) ? list : [];

  return (
    <div className="dashboard-card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3>{title}</h3>
        {value !== undefined ? (
          <p>{value}</p>
        ) : (
          <ul>
            {safeList.length > 0 ? (
              safeList.map((user) => <li key={user.id}>{user.name} {user.surname}</li>)
            ) : (
              <p>None</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};


export default Dashboard;
