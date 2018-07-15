import React from "react";
import { Link } from "react-router-dom";

const resultsHeader = props => {
  let style = {
    border: "solid purple 3px",
    padding: "5px",
    margin: "5px",
    textDecoration: "none",
    cursor: "pointer",
    color: "purple"
  };
  return (
    <div>
      <nav>
        <Link
          style={style}
          from={`/company/results/${props.ApplicantId}`}
          to={`/company/application/${props.ApplicantId}`}
        >
          Application
        </Link>
        <Link
          style={style}
          from={`/company/application/${props.ApplicantId}`}
          to={`/company/results/${props.ApplicantId}`}
        >
          Test Results
        </Link>
      </nav>
    </div>
  );
};

export default resultsHeader;
