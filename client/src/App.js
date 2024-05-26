// App.js
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
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Sidebar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/candidates" element={<Candidates />} />
          </Routes>
        </div>
        <div className="space"></div>
        <Footer />

      </BrowserRouter>
    </>
  );
};

export default App;