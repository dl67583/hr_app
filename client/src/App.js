import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute"; 
import NotFound from "./pages/NotFound"; 
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import Navbar from "./components/Navbar"; 
import DepartmentsPage from "./pages/DepartentsPage";
import RequestsPage from "./pages/Requests";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
