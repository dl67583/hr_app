import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Users from "./routes/Users";
import UserDetails from "./routes/UserDetails";
import NotFound from "./routes/NotFound";
import Home from "./routes/Home";
import Departments from "./routes/Departments";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Attendance from "./routes/Attendance";
import Requests from "./routes/Requests";
import Candidates from "./routes/Candidates";
import Sidebar from "./components/Sidebar";
import Login from "./routes/Login";
import { SidebarProvider, useSidebar } from './context/sidebarContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext'; // Import AuthContext for authentication
import "./styles/App.css";  // Import the CSS file for the app
import ContactUs from "./routes/ContactUs";
import AboutUs from "./routes/AboutUs";
import FAQ from "./routes/FAQ";
import Dashboard from "./routes/Dashboard";
import AdminDashboard from "./routes/AdminDashboard";

// ProtectedRoute component to wrap routes that require authentication and permissions
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, permissions } = useContext(AuthContext);

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If a required permission is specified, ensure the user has it
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const AppContent = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Navbar />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<ProtectedRoute requiredPermission="read"><Users /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute requiredPermission="read"><Departments /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute requiredPermission="read"><Attendance /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute requiredPermission="read"><Requests /></ProtectedRoute>} />
          <Route path="/candidates" element={<ProtectedRoute requiredPermission="read"><Candidates /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/dashboard" element={<ProtectedRoute requiredPermission="read"><Dashboard /></ProtectedRoute>} />
          <Route path="/admindashboard" element={<ProtectedRoute requiredPermission="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;
