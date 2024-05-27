import React, { useState, useEffect } from 'react';
import { useSidebar } from '../context/sidebarContext';
import "../styles/Navbar.css";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const { isSidebarOpen } = useSidebar();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [login, setLogin] = useState(false);
  const [settings, setSettings] = useState(false);

  const toggleSettings = () => {
    setSettings(!settings);
  };

  return (
    <div className={`nav d-flex justify-content-between ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <button className="nav-menu col-2 d-flex align-items-center justify-content-center" onClick={toggleSidebar}>HR App</button>
      <div className="nav-container col-10 d-flex align-items-center">
        <div className="ms-5">
        </div>
      </div>
      <div className="circle me-5">
        <button onClick={toggleSettings}>
          <img alt="Default pfp" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/256px-Default_pfp.svg.png" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
