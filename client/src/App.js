import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import RequestsPage from "./pages/Requests";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import LeavesPage from "./pages/LeavesPage";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/leaves" element={<LeavesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
