import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/sidebarContext';
// import { useAuth } from '../context/AuthContext'; // Uncomment if using authentication
import axios from 'axios';
import "../styles/Navbar.css";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const { isSidebarOpen } = useSidebar();
  const nav = useNavigate();

  return (
    <div className={`fixed top-0 w-full z-50 flex justify-between items-center bg-[#f0ebe4] ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="flex items-center h-[6vh]">
        <button className="text-black text-lg px-4" onClick={toggleSidebar}>HR App</button>
      </div>
      
      <div className="flex-grow flex justify-end me-[30px] space-x-8 text-black">
        <a href="/" className="hover:text-yellow-500 transition duration-200">Home</a>
        <a href="/contactus" className="hover:text-yellow-500 transition duration-200">Contact Us</a>
        <a href="/faq" className="hover:text-yellow-500 transition duration-200">FAQ</a>
        <a href="/aboutus" className="hover:text-yellow-500 transition duration-200">About Us</a>
      </div>
      
      <div className="flex items-center h-[6vh] pr-5">
        {/* {isAuthenticated ? ( Uncomment if using authentication
          <button>
            <img alt="Default pfp" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/256px-Default_pfp.svg.png" className="h-10 w-10 rounded-full"/>
          </button>
        ) : ( */}
        <button onClick={() => nav('/login')}>
          <img alt="Default pfp" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/256px-Default_pfp.svg.png" className="h-10 w-10 rounded-full"/>
        </button>
        {/* )} */}
      </div>
    </div>
  );
};

export default Navbar;
