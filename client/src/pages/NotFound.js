import { useNavigate } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
    </Container>
  );
};

export default NotFound;
