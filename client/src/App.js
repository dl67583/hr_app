import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import "./styles/App.css";  // Import the CSS file for the app
import ContactUs from "./routes/ContactUs";
import AboutUs from "./routes/AboutUs";
import FAQ from "./routes/FAQ";

const AppContent = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Navbar />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
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
