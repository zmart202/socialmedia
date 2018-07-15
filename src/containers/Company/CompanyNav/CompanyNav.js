import React from "react";
import { Link } from "react-router-dom";
import "./CompanyNav.css";

const CompanyNav = () => {
  return (
    <div className="topcompanynav">
      <div>
        <div>
          <a href="">Manual</a>
        </div>
        <div>
          <Link to="/company/jobs">Editor</Link>
        </div>
        <div>
          <a href="">Applicants</a>
        </div>
      </div>
    </div>
  );
};

export default CompanyNav;
