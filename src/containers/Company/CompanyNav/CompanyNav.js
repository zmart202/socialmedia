import React from "react";
import { Link } from "react-router-dom";
import "./CompanyNav.css";

const CompanyNav = () => {
  return (
    <div className="topcompanynav">
      <div>
        <div className="border1">
          <Link to="/company/messaging">Manual</Link>
        </div>
        <div>
          <Link to="/company/jobs">Editor</Link>
        </div>
        <div className="border2">
          <Link to="/company">Applicants</Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyNav;
