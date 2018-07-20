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
          Hey {props.applicant.firstName}! Thanks for showing interest in
          becoming a(n) POSITION_NAME at COMPANY_NAME. We think you have the
          potential to be a great fit at our company. Before we can take this
          any further, we would like you to respond to a few questions. Once
          clicking "START TEST NOW" a timer will go off and you will be timed to
          see how long it takes you to respond to all of the questions. Please
          answer all of the questions to the best of your ability before
          submitting the test.
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
