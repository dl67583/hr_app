import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout, roles } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>HR Management</Typography>
        {user ? (
          <>
            <Button color="inherit" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            {roles && roles.includes("Superadmin") || roles.includes("HR") ? (
              <Button color="inherit" onClick={() => navigate("/users")}>Users</Button>
            ) : null}
            {roles && roles.includes("Employee") ? (
              <Button color="inherit" onClick={() => navigate("/time-attendance")}>Time Attendance</Button>
            ) : null}
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
