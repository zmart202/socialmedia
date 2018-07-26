import React, { Component } from "react";
import { omit } from "ramda";
import shortid from "shortid";
import Toggle from "react-toggle";
import "./Profile.css";

// import EducationInput from './EducationInput/EducationInput';

const initialState = {
  school: "",
  study: "",
  degree: "",
  startTime: "",
  endTime: "",
  finishedSchool: false,
  educationFormMounted: false
};

class EducationProfile extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  saveEducationHandler = () => {
    this.props.addEducation({
      id: shortid.generate(),
      ...omit(["educationFormMounted"], this.state)
    });
    this.setState(initialState);
  };

  finishedSchoolHandler = () =>
    this.setState(prevState => ({
      finishedSchool: !prevState.finishedSchool
    }));

  toggleEducationForm = () =>
    this.setState(prevState => ({
      educationFormMounted: !prevState.educationFormMounted 
    }));

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  render() {
    let educationForm = null;
    if (this.state.educationFormMounted) {
      educationForm = (
        <div className="profileinput">
          <div className="form-group" style={{ paddingTop: "10px" }}>
            <input
              name="school"
              className="form-control form-control-lg"
              type="text"
              placeholder="School (required)"
              onChange={this.handleChange}
            />
            <small className="form-text text-muted">
              Please provide the school's name that you attended
            </small>
          </div>
          <div className="form-group">
            <input
              name="study"
              className="form-control form-control-lg"
              type="text"
              placeholder="Field of study"
              onChange={this.handleChange}
            />
            <small className="form-text text-muted">
              Please provide the field of study
            </small>
          </div>
          <br />
          <div className="form-group">
            <input
              name="degree"
              className="form-control form-control-lg"
              type="text"
              placeholder="Degree"
              onChange={this.handleChange}
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
                  onChange={this.handleChange}
                  defaultValue="yyyy-MM-dd"
                  name="startTime"
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
                  onChange={this.handleChange}
                  defaultValue="yyyy-MM-dd"
                  name="endTime"
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
            <button type="button" onClick={this.toggleEducationForm}>Cancel</button>
            <button type="button" onClick={this.saveEducationHandler}>Complete</button>
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
          <div className="completed" key={edu.id}>
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
              {edu.finishedSchool ? "Yes" : "No"}
            </p>
            <button onClick={() => this.props.removeEducation(edu.id)}>
              Delete
            </button>
          </div>
        ))}
        {educationForm}
        <div style={{ padding: "15px" }}>
          {this.state.educationFormMounted ? null : (
            <button type="button" onClick={this.toggleEducationForm}>
              Add education
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default EducationProfile;
