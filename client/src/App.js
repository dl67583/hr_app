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
import Meetings from "./routes/Meetings";
import Requests from "./routes/Requests";
import Candidates from "./routes/Candidates";
import ContactUs from "./routes/ContactUs";
import AboutUs from "./routes/AboutUs";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div style={{ paddingTop: 64 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />

          </Routes>
        </div>
        <div className="space"></div>
        <Footer />

      </BrowserRouter>
    </>
  );
};

export default App;