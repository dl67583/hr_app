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
  const [search, setSearch] = useState()
  const [login, setLogin] = useState(false)
  const [settings, setSettings] = useState(false)


  const toggleSettings = () => {
    setSettings(!settings)
  }

  return (
    // <nav className={scroll ? "navbar scrolled" : "navbar"}>
    //   <div className="navbar-container container d-flex justify-content-between">
    //     <input type="checkbox" name="" id="" />
    //     <div className="hamburger-lines">
    //       <span className="line line1"></span>
    //       <span className="line line2"></span>
    //       <span className="line line3"></span>
    //     </div>
    //     <ul className="menu-items d-flex align-items-end">
    //       <li><a href="/users">Users</a></li>
    //       <li><a href="/departments">Departments</a></li>
    //       <li><a href="/attendance">Attendance</a></li>
    //       <li><a href="/candidates">Candidates</a></li>
    //       <li><a href="/requests">Requests</a></li>
    //     </ul>
    //     <h1 className="logo">Navbar</h1>
    //   </div>
    // </nav>

    <>
      <div className="nav d-flex justify-content-between">
        <div className="nav-menu col-2 d-flex align-items-center justify-content-center">HR App</div>
        <div className="nav-container col-10 d-flex align-items-center">
          <div className="ms-5">
          </div>
        </div>
      </div>
      <div className="circle me-5">
        <button onClick={() => toggleSettings()}>
          <img alt="Default pfp" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/256px-Default_pfp.svg.png" />
        </button>
      </div>
      {/* <div className="account text-center" style={settings ? { display: "block" } : { display: "none" }}>
        <a href="/dashboard">Account details</a>
        {login ? <a>Sign out</a> : <a>Sign in</a>}
        <a>Dark mode</a>
        <a>Settings</a>
      </div> */}
    </>
  );
};

export default Navbar;
