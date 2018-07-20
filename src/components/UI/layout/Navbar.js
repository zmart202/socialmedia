import React from "react";
import "./Navbar.css";

const Navbar = props => {
  const logOut = () => {
    localStorage.removeItem("token");
    props.history.push("/");
  };

  const goHome = () => {
    props.history.push("/company");
  }

  return (
    <div className="topnav" id="myTopnav">
      <a onClick={goHome} style={{ cursor: 'pointer' }} className="active">
        <h3>DecisionTyme</h3>
      </a>
      <div className="right-nav">
        <a onClick={logOut}>Logout</a>
      </div>
    </div>
  );
};

export default Navbar;
