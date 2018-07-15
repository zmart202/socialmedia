import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="topnav" id="myTopnav">
      <a href="#home" className="active">
        <h3>DecistionTyme</h3>
      </a>
      <div className="right-nav">
        <a href="">Logout</a>
      </div>
    </div>
  );
};

export default Navbar;
