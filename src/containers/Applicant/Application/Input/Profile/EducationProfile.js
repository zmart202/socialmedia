import React, { Component } from "react";
import Toggle from "react-toggle";
import "./Profile.css";

// import EducationInput from './EducationInput/EducationInput';

class EducationProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      educationKey: 1,
      addEducation: false,
      finishedSchool: false
    };
  }
  keyValueHandler = () => {
    let num = this.state.educationKey;
    num += 1;
    this.setState({ educationKey: num });
    return this.state.educationKey;
  };

  submitEducationHandler = event => {
    event.preventDefault();
    let school = this.refs.school.value;
    let study = this.refs.study.value;
    let degree = this.refs.degree.value;
    let startTime = this.refs.startTime.value;
    let endTime = this.refs.endTime.value;
    let finishedSchool = this.state.finishedSchool;
    let educationObj = {
      key: this.keyValueHandler(),
      school,
      study,
      degree,
      startTime,
      endTime,
      finishedSchool
    };
    this.props.addEducation(educationObj);
    this.setState({ addEducation: false, finishedSchool: false });
  };

  finishedSchoolHandler = () => {
    this.setState({ finishedSchool: !this.state.finishedSchool });
  };

  cancelEducationHandler = () => {
    this.setState({ addEducation: false });
  };

  addEducationHandler = event => {
    event.preventDefault();
    this.setState({ addEducation: true });
  };

  render() {
    let educationForm = null;
    if (this.state.addEducation) {
      educationForm = (
        <div className="profileinput">
          <div className="form-group" style={{ paddingTop: "10px" }}>
            <input
              ref="school"
              className="form-control form-control-lg"
              type="text"
              placeholder="School (required)"
              onChange={this.props.handleChange}
            />
            <small className="form-text text-muted">
              Please provide the school's name that you attended
            </small>
          </div>
          <div className="form-group">
            <input
              ref="study"
              className="form-control form-control-lg"
              type="text"
              placeholder="Field of study"
              onChange={this.props.handleChange}
            />
            <small className="form-text text-muted">
              Please provide the field of study
            </small>
          </div>
          <br />
          <div className="form-group">
            <input
              ref="degree"
              className="form-control form-control-lg"
              type="text"
              placeholder="Degree"
              onChange={this.props.handleChange}
            />
            <small className="form-text text-muted">
              What kind of degree was obtained
            </small>
          </div>
          <div className="form-group">
            <span>
              <div>
                <input
                  type="date"
                  className="form-control form-control-lg"
                  onChange={this.props.handleChange}
                  defaultValue="yyyy-MM-dd"
                  ref="startTime"
                  min="1955-01-01"
                  max="2090-12-31"
                />
                <small className="form-text text-muted">Start Date</small>
              </div>
              <br />

              <div className="form-group">
                <input
                  type="date"
                  className="form-control form-control-lg"
                  onChange={this.props.handleChange}
                  defaultValue="yyyy-MM-dd"
                  ref="endTime"
                  min="1955-01-01"
                  max="2090-12-31"
                />
                <small className="form-text text-muted">End Date</small>
              </div>
            </span>
            <br />
            <label className="react-toggle" style={{ padding: "20px 0px" }}>
              <span style={{ padding: "10px" }}>
                Did you complete your education?
              </span>
              <Toggle
                defaultChecked={this.state.finishedSchool}
                onChange={this.finishedSchoolHandler}
              />
            </label>
            <br />
          </div>
          <span>
            <button onClick={this.cancelEducationHandler}>Cancel</button>
            <button onClick={this.submitEducationHandler}>Complete</button>
          </span>
        </div>
      );
    }
    return (
      <div className="profileinfo">
        <div className="subheader">
          <label>Education</label>
        </div>
        {this.props.education.map(edu => (
          <div className="completed" key={edu.key}>
            <p>
              <strong>School: </strong>
              {edu.school}
            </p>
            <p>
              <strong>Study: </strong>
              {edu.study}
            </p>
            <p>
              <strong>Degree: </strong>
              {edu.degree}
            </p>
            <p>
              <strong>From: </strong>
              {edu.startTime} <strong>To: </strong>
              {edu.endTime}
            </p>
            <p>
              <strong>Education Completed: </strong>
              {this.state.finishedSchool ? "Yes" : "No"}
            </p>
            <button onClick={this.props.removeEducation(edu)}>
              Delete
            </button>
          </div>
        ))}
        {educationForm}
        <div style={{ padding: "15px" }}>
          {this.state.addEducation ? null : (
            <button onClick={this.addEducationHandler.bind(this)}>
              Add education
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default EducationProfile;
