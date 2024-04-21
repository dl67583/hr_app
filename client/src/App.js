// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "./routes/Users";
import UserDetails from "./routes/UserDetails";
import NotFound from "./routes/NotFound";
import Home from "./routes/Home";
import Departments from "./routes/Departments";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
      </Routes>
     </div>
     <Footer/>
     
      </BrowserRouter>
    </>
  );
};

export default App;
