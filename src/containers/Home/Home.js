import React, { Component } from "react";
import { Link } from "react-router-dom";
import landingtest from "../../img/landingtest.png";
import landinglink from "../../img/landinglink.png";
import landinggroup from "../../img/landinggroup.png";

import "./Home.css";

class Home extends Component {
  onSubmit = () => {
    window.confirm("Thanks for your interest");
  };
  render() {
    return (
      <div>
        <div>
          <h4 className="complogo">
            <strong>DecisionTyme</strong>
          </h4>
          <Link to="/company">
            <strong className="complogin">Company Portal Login</strong>
          </Link>
        </div>
        <div className="home">
          <center>
            <h1 className="landingheader">
              <strong>DecisionTyme</strong>
            </h1>
            <h3>
              <strong>
                The power of hiring smarter and more qualified applicants.
              </strong>
            </h3>
          </center>
        </div>
        <center style={{ paddingTop: "10px" }}>
          <h3
            style={{ margin: "0px 80px", padding: "20px 0px", color: "purple" }}
          >
            <strong>
              Want to make sure that you always have a pipeline of qualified
              applicants to hire when needed?
            </strong>
          </h3>
          <button
            onClick={this.onSubmit}
            style={{
              padding: "20px 40px",
              backgroundColor: "purple",
              color: "white",
              fontWeight: "bold"
            }}
          >
            CLICK HERE TO GET STARTED{" "}
            <span style={{ textDecoration: "underline" }}>FREE</span>
          </button>
        </center>
        <div className="row" style={{ margin: "30px" }}>
          <div
            className="col-md-4"
            style={{ backgroundColor: "lightgray", padding: "20px" }}
          >
            <center className="landingpageblurbs">
              <strong>
                Generate Custom Pre-Screening Tests For All Positions Needing To
                Be Filled
              </strong>
            </center>
            <center>
              <img src={landingtest} alt="test" />
            </center>
          </div>
          <div
            className="col-md-4"
            style={{ backgroundColor: "lightgray", padding: "20px" }}
          >
            <center className="landingpageblurbs">
              <strong>
                Easily Link The All-In-One Aplication Process to Your Website
              </strong>
            </center>
            <center>
              <img src={landinglink} alt="link" />
            </center>
          </div>
          <div
            className="col-md-4"
            style={{ backgroundColor: "lightgray", padding: "20px" }}
          >
            <center className="landingpageblurbs">
              <strong>
                Sit Back And Relax While Qualified Applicants Begin Applying
              </strong>
            </center>
            <center>
              <img src={landinggroup} alt="group" />
            </center>
          </div>
        </div>
        <center>
          <h3>What is the the purpose of DecisionTyme you may ask?</h3>
        </center>
        <div style={{ margin: "0px 60px" }}>
          <strong>
            DecisionTyme is a software with the main focus of helping small to
            medium sized business find and organize better quality applicants.
            Our system makes it easy to store all of your applicants information
            in one convenient location. We know you as a business owner already
            have a lot on your hands so we want to help remove some of that
            stress. We want to make it so easy we are giving the use of the
            software away for free to help you compete with the large
            corporations that pay hundreds of thousands of dollars a year to get
            the same quality applicants.
          </strong>
        </div>
      </div>
    );
  }
}

export default Home;
