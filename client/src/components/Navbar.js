import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
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
          <li><a href="/meetings">Meetings</a></li>
        </ul>
        <h1 className="logo">Navbar</h1>
      </div>
    </nav>
  );
};

export default Navbar;
