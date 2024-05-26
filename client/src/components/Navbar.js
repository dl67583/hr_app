import React from 'react';
import { useState, useEffect } from 'react';

const Navbar = () => {

  // const [scroll, setScroll] = useState(false);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScroll(window.scrollY > 60);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  

  return (
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

    </>
  );
};

export default Navbar;
