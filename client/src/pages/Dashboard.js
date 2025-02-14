import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      <Button onClick={() => navigate("/users")}>Manage Users</Button>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Dashboard;
