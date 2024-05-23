import React from 'react';
import { useState, useEffect } from 'react';

const Navbar = () => {

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

  return (
    <nav className={scroll ? "navbar scrolled" : "navbar"}>
      <div className="navbar-container container d-flex justify-content-between">
        <input type="checkbox" name="" id="" />
        <div className="hamburger-lines">
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </div>
        <ul className="menu-items d-flex align-items-end">
          <li><a href="/users">Users</a></li>
          <li><a href="/departments">Departments</a></li>
          <li><a href="/attendance">Attendance</a></li>
          <li><a href="/candidates">Candidates</a></li>
          <li><a href="/requests">Requests</a></li>
        </ul>
        <h1 className="logo">Navbar</h1>
      </div>
    </nav>
  );
};

export default Navbar;
