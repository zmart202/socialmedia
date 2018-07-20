import React, { Component } from "react";
import _ from "lodash";

import ApplicationDetails from "./Input/ApplicationDetails";
import EducationProfile from "./Input/Profile/EducationProfile";
import PersonalInformation from "./Input/PersonalInformation";
import ExperienceProfile from "./Input/Profile/ExperienceProfile";
import Toggle from "react-toggle";
import "./Application.css";
import "./Input/PersonalInformation.css";

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      workExperience: [],
      education: [],
      coverLetter: "",
      salaryRequirements: "",
      over18: false,
      legal: false,
      educationFormMounted: false,
      educationKey: 1,
      addEducation: false
    };

    this.companyId = props.match.params.companyId;
    this.jobId = props.match.params.jobId;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state);
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        companyId: this.companyId,
        jobId: this.jobId,
        ..._.omit(this.state, [
          "addEducation",
          "educationKey",
          "educationFormMounted"
        ])
      })
    };
    fetch("http://localhost:4567/api/applicant/application", options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.props.history.push(`/applicant/${data.applicantId}`);
      })
      .catch(err => console.log(err));
  };

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  over18Handler = () => {
    this.setState({ over18: !this.state.over18 });
  };

  legalHandler = () => {
    this.setState({ legal: !this.state.legal });
  };

  toggleEducationForm() {
    this.setState({
      educationFormMounted: !this.state.educationFormMounted
    });
  }

  render() {
    return (
      <div className="Form">
        <h3 className="applicationheader">Application Form</h3>
        <form>
          <PersonalInformation handleChange={this.handleChange} />
          <EducationProfile handleChange={this.handleChange} />
          <ExperienceProfile handleChange={this.handleChange} />
          <ApplicationDetails handleChange={this.handleChange} />
          <div className="personalinfo">
            <div className="bottomform">
              <label className="react-toggle" style={{ padding: "20px 0px" }}>
                <span style={{ padding: "10px" }}>
                  Are you 18 years or older?
                </span>
                <Toggle
                  defaultChecked={this.state.over18}
                  onChange={this.over18Handler}
                />
              </label>
            </div>
            <div className="bottomform">
              <label className="react-toggle" style={{ padding: "20px 0px" }}>
                <span style={{ padding: "10px" }}>
                  Are you a citizen of the U.S. or do you have a legal right to
                  work in the U.S.?
                </span>
                <Toggle
                  defaultChecked={this.state.legal}
                  onChange={this.legalHandler}
                />
              </label>
            </div>
            <div className="bottomform">
              <div style={{ color: "red" }}>
                <label>
                  <strong>
                    Once you have finished filling out the application and hit
                    submit below, you will be prompted to take a timed
                    assessment. Please answer all the questions to the best of
                    your ability. Thank you!
                  </strong>
                </label>
              </div>
            </div>
            <div className="bottomform">
              <button
                style={{ padding: "10px 30px", color: "purple" }}
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Application;
