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
<<<<<<< HEAD
import Meetings from "./routes/Meetings";
=======
import Candidates from "./routes/Candidates";
>>>>>>> 65a280a53a5e0aebed21f3f24ca6fb6b941df589
const App = () => {
  return (
    <>
     <BrowserRouter>
     <Navbar/>
     <div style={{paddingTop:64}}>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users/>}/>
      <Route path="/departments" element={<Departments />} />
      <Route path="/attendance" element={<Attendance />} />
<<<<<<< HEAD
      <Route path="/meetings" element={<Meetings />} />
=======
      <Route path="/candidates" element={<Candidates/>}/>

>>>>>>> 65a280a53a5e0aebed21f3f24ca6fb6b941df589
      </Routes>
     </div>
     <div className="space"></div>
     <Footer/>
     
      </BrowserRouter>
    </>
  );
};

export default App;