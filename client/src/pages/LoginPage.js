import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { TextField, Button, Container, Typography } from "@mui/material";

const LoginPage = () => {
  const { login } = useContext(AuthContext); // ✅ Ensure login is correctly imported
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ Prevents page reload
    if (login) {
      login(email, password);
    } else {
      console.error("❌ Login function is not available in AuthContext.");
    }
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit">Login</Button>
      </form>
    </Container>
  );
};

export default LoginPage;
