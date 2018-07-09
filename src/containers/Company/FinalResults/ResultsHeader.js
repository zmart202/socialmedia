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
      <div style={{ padding: "20px", textAlign: "left" }}>
        <Link
          to="/company"
          style={{
            textDecoration: "none",
            color: "white",
            padding: "10px",
            cursor: "pointer",
            boxShadow: "2px 2px 1px 0px rgba(0,0,0,0.75)",
            backgroundColor: "purple"
          }}
        >
          BACK
        </Link>
      </div>
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
