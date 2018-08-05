import React from "react";
import "./TestIntro.css";

const TestIntro = props => {
  const style = {
    startBtn: {
      backgroundColor: "#6d6dc4",
      textDecoration: "none",
      color: "white",
      padding: "10px",
      cursor: "pointer",
      boxShadow: "2px 2px 1px 0px rgba(0,0,0,0.75)"
    }
  };

  return (
    <div className="intro">
      <div style={style.inner}>
        <p>
          Hey {props.applicant.firstName}! Thanks for applying through Decision Tyme!
          The following exam has been custom designed by {props.companyName} for the position titled: {props.jobTitle}.
          Once clicking "START TEST NOW" you will be on the clock to
          see how long it takes you to respond to all of the questions. Good luck!!
        </p>
        <p style={{ color: "purple", textAlign: "center" }}>
          <strong>Best of luck!</strong>
        </p>
      </div>
      <div className="btnsupport">
        <a
          onClick={props.startTest}
          className="startbtn"
          style={{ color: "white" }}
        >
          START TEST NOW
        </a>
      </div>
    </div>
  );
};

export default TestIntro;
