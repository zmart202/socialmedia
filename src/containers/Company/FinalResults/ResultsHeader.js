import React from "react";
import { Link } from "react-router-dom";

const resultsHeader = props => {
  // let style = {
  //   border: "solid purple 3px",
  //   padding: "5px",
  //   margin: "5px",
  //   textDecoration: "none",
  //   cursor: "pointer",
  //   color: "purple"
  // };
  return (
    <div className="btn-group mb-4" role="group">
      <Link
        className="btn btn-light"
        style={{ color: "purple" }}
        from={`/company/results/${props.ApplicantId}`}
        to={`/company/application/${props.ApplicantId}`}
      >
        <i className="fas fa-user-circle text-success mr-1" />
        Application
      </Link>
      <Link
        className="btn btn-light"
        style={{ color: "purple" }}
        from={`/company/application/${props.ApplicantId}`}
        to={`/company/results/${props.ApplicantId}`}
      >
        <i className="fas fa-stopwatch text-success mr-1" />
        Test Results
      </Link>
    </div>
  );
};

export default resultsHeader;
