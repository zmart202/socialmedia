import React, { Component } from "react";
import shortid from "shortid";
import _ from "lodash";
import Toggle from "react-toggle";
import "./Profile.css";
import TextAreaFieldGroup from "../../../../../components/UI/Form/TextAreaFieldGroup";
import TextFieldGroup from "../../../../../components/UI/Form/TextFieldGroup";

// import EducationInput from './EducationInput/EducationInput';

const initialState = {
  school: "",
  study: "",
  degree: "",
  startTime: "",
  endTime: "",
  current: false,
  finishedSchool: false,
  disabled: false,
  description: "",
  educationFormMounted: false
};

class EducationProfile extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleChange = this.handleChange.bind(this);
    this.submitEducationHandler = this.submitEducationHandler.bind(this);
  }

  toggleEducationForm = () => {
    this.setState(prevState => ({
      educationFormMounted: !prevState.educationFormMounted
    }));
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  submitEducationHandler = event => {
    event.preventDefault();
    let educationObj = {
      id: shortid.generate(),
      ..._.omit(this.state, ["educationFormMounted", "disabled"])
    };

    this.props.addEducation(educationObj);
    this.setState(initialState);
  };

  onCheck = event => {
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current
    });
  };

  finishedSchoolHandler = () => {
    this.setState({ finishedSchool: !this.state.finishedSchool });
  };

  render() {
    let educationForm = "";
    let addEducationBtn = "";
    if (this.state.educationFormMounted) {
      educationForm = (
        <div className="profileinput">
          <div className="form-group" style={{ paddingTop: "10px" }}>
            <TextFieldGroup
              name="school"
              type="text"
              placeholder="School (required)"
              onChange={this.handleChange}
              info="Please provide the school's name that you attended"
            />
          </div>
          <div className="form-group">
            <TextFieldGroup
              name="study"
              type="text"
              placeholder="Field Of Study"
              onChange={this.handleChange}
              info="Please provide your field of study while attending this school"
            />
          </div>
          <br />
          <div className="form-group">
            <TextFieldGroup
              name="degree"
              type="text"
              placeholder="Degree or Certificate"
              onChange={this.handleChange}
              info="What kind of degree was obtained"
            />
          </div>
          <div className="form-group">
            <div>
              <TextFieldGroup
                name="startTime"
                type="date"
                value={this.state.startTime}
                onChange={this.handleChange}
                info="What was the date that you began your education at this institution"
              />
            </div>
            <br />
            <div className="form-group">
              <TextFieldGroup
                name="endTime"
                type="date"
                value={this.state.endTime}
                onChange={this.handleChange}
                info="What was the date on which your education from this instituttion ended"
                disabled={this.state.disabled ? "disabled" : ""}
              />
              <div className="form-check md-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="current"
                  value={this.state.current}
                  checked={this.state.current}
                  onChange={this.onCheck}
                  id="current"
                />
                <label htmlFor="current" className="form-check-label">
                  Current School
                </label>
                <TextAreaFieldGroup
                  placeholder="Program Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  info="Tell us about the program you were in"
                />
              </div>
              <br />
              {!this.state.current ? (
                <label className="react-toggle" style={{ padding: "20px 0px" }}>
                  <span style={{ padding: "10px" }}>
                    Did you complete your education?
                  </span>
                  <Toggle
                    defaultChecked={this.state.finishedSchool}
                    onChange={this.finishedSchoolHandler}
                  />
                </label>
              ) : null}
              <br />
            </div>
          </div>
          <span>
            <button type="button" onClick={this.toggleEducationForm}>
              Cancel
            </button>
            <button onClick={this.submitEducationHandler}>Complete</button>
          </span>
        </div>
      );
    } else {
      addEducationBtn = (
        <div style={{ padding: "15px" }}>
          <button onClick={this.toggleEducationForm}>Add Education</button>
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
              {edu.current ? " Now" : edu.endTime}
            </p>
            <p>
              <strong>Description: </strong>
              {edu.description}
            </p>
            {!edu.current ? (
              <p>
                <strong>Education Completed: </strong>
                {edu.finishedSchool ? "Yes" : "No"}
              </p>
            ) : null}
            <button onClick={() => this.props.removeEducation(edu.id)}>
              Delete
            </button>
          </div>
        ))}
        {educationForm}
        {addEducationBtn}
      </div>
    );
  }
}

export default EducationProfile;
