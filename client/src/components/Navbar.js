import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/sidebarContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios'; // Import axios
import "../styles/Navbar.css";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const { isSidebarOpen } = useSidebar();
  const [scroll, setScroll] = useState(false);
  const nav = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      logout();
      nav('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className={`nav d-flex justify-content-between ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <button className="nav-menu col-2 d-flex align-items-center justify-content-center" onClick={toggleSidebar}>HR App</button>
      <div className="nav-container col-10 d-flex align-items-center justify-content-end">
        <div className="ms-5">
          <div className='d-flex links'>
            <a href="/">Home</a>
            <a href="/contactus">Contact Us</a>
            <a href="/faq">FAQ</a>
            <a href="/aboutus">About Us</a>
          </div>
        </div>
      </div>
      <div className="circle me-5">
        {isAuthenticated ? (
          <button onClick={handleLogout}>
            <img alt="Default pfp" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/256px-Default_pfp.svg.png" />
          </button>
        ) : (
          <button onClick={() => nav('/login')}>
            <img alt="Default pfp" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/256px-Default_pfp.svg.png" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
