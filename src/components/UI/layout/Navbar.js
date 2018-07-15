import React from "react";
import "./Navbar.css";

const Navbar = props => {
  const logOut = () => {
    localStorage.removeItem("token");
    props.history.push("/");
  };
  return (
    <div className="topnav" id="myTopnav">
      <a href="#home" className="active">
        <h3>DecistionTyme</h3>
      </a>
      <div className="right-nav">
        <a onClick={logOut}>Logout</a>
      </div>
    </div>
  );
};

export default Navbar;
