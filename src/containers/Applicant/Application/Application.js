import React, { Component } from "react";
import _ from "lodash";
import Toggle from "react-toggle";

import ApplicationDetails from "./Input/ApplicationDetails";
import EducationProfile from "./Input/Profile/EducationProfile";
import PersonalInformation from "./Input/PersonalInformation";
import ExperienceProfile from "./Input/Profile/ExperienceProfile";
import Spinner from "../../../components/UI/Spinner/Spinner";

import "./Application.css";
import "./Input/PersonalInformation.css";

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      errorMsg: "",
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
      legal: false
    };

    this.companyId = props.match.params.companyId;
    this.jobId = props.match.params.jobId;
  }

  handleSubmit = event => {
    event.preventDefault();
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        companyId: this.companyId,
        jobId: this.jobId,
        ..._.omit(this.state, [
          "isLoading",
          "isError",
          "errorMsg"
        ])
      })
    };
    fetch("http://localhost:4567/api/applicant/application", options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          return this.setState({
            isError: true,
            errorMsg: data.msg
          });
        }

        this.props.history.push(`/applicant/${data.applicantId}`);
      })
      .catch(err => console.log(err));
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  over18Handler = () =>
    this.setState({ over18: !this.state.over18 });

  legalHandler = () =>
    this.setState({ legal: !this.state.legal });

  addEducation = educationObj =>
    this.setState(prevState => ({
      education: prevState.education.concat(educationObj)
    }));

  removeEducation = id =>
    this.setState(prevState => ({
      education: prevState.education.filter(x => x.id !== id)
    }));

  addExperience = experienceObj =>
    this.setState(prevState => ({
      workExperience: prevState.workExperience.concat(experienceObj)
    }));

  removeExperience = id =>
    this.setState(prevState => ({
      workExperience: prevState.workExperience.filter(x => x.id !== id)
    }));

  render() {
    if (this.state.isError) {
      return <p style={{ color: 'red' }}>{this.state.errorMsg}</p>;
    }

    if (this.state.isLoading) {
      return <Spinner />;
    }

    return (
      <div className="Form">
        <h3 className="applicationheader">Application Form</h3>
        <form>
          <PersonalInformation handleChange={this.handleChange} />
          <EducationProfile
            addEducation={this.addEducation}
            removeEducation={this.removeEducation}
            education={this.state.education}
          />
          <ExperienceProfile
            handleChange={this.handleChange}
            workExperience={this.state.workExperience}
            addExperience={this.addExperience}
            removeExperience={this.removeExperience}
          />
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
