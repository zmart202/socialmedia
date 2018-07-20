import React, { Component } from "react";
import "./Profile.css";
// import EducationInput from './EducationInput/EducationInput';

class ExperienceProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experienceKey: 1,
      workExperience: [],
      addExperience: false
    };
  }
  keyValueHandler = () => {
    let num = this.state.experienceKey;
    num += 1;
    this.setState({ educationKey: num });
    return this.state.experienceKey;
  };

  submitExperienceHandler = event => {
    event.preventDefault();
    let company = this.refs.company.value;
    let industry = this.refs.industry.value;
    let title = this.refs.title.value;
    let summary = this.refs.summary.value;
    let leaving = this.refs.leaving.value;
    let experienceObj = {
      key: this.keyValueHandler(),
      company,
      industry,
      title,
      summary,
      leaving
    };
    this.setState({
      workExperience: this.state.workExperience.concat(experienceObj)
    });
    this.setState({ addExperience: false });
  };

  addExperienceHandler = event => {
    event.preventDefault();
    this.setState({ addExperience: true });
  };

  cancelExperienceHandler = () => {
    this.setState({ addExperience: false });
  };

  deleteExperienceHandler = (exp, event) => {
    event.preventDefault();
    let experience = this.state.workExperience.indexOf(exp);
    let workExperience = this.state.workExperience;
    workExperience.splice(experience, 1);
    this.setState({
      workExperience
    });
  };
  render() {
    let experienceForm = null;
    if (this.state.addExperience) {
      experienceForm = (
        <div className="profileinput">
          <div className="form-group">
            <div style={{ paddingTop: "10px" }}>
              <input
                ref="company"
                className="form-control form-control-lg"
                type="text"
                placeholder="Company (required)"
                onChange={this.props.handleChange}
              />
              <small className="form-text text-muted">
                Please provide the companies name that you worked for
              </small>
            </div>
          </div>
          <div className="form-group">
            <input
              ref="industry"
              className="form-control form-control-lg"
              type="text"
              placeholder="Type of industry"
              onChange={this.props.handleChange}
            />
            <small className="form-text text-muted">
              What category of industry does this company fall under
            </small>
          </div>
          <div className="form-group">
            <input
              ref="title"
              className="form-control form-control-lg"
              type="text"
              placeholder="Your title"
              onChange={this.props.handleChange}
            />
            <small className="form-text text-muted">
              What was your job title
            </small>
          </div>
          <div className="form-group">
            <textarea
              ref="summary"
              className="form-control form-control-lg"
              type="text"
              placeholder="Summary of what you did"
              onChange={this.props.handleChange}
            />
            <small className="form-text text-muted">
              Please provide a summary of what you did in a few sentences
            </small>
          </div>
          <div className="form-group">
            <textarea
              ref="leaving"
              className="form-control form-control-lg"
              type="text"
              placeholder="What were the reasons for leaving the job.."
              onChange={this.props.handleChange}
            />
            <small className="form-text text-muted">
              What was your reason for leaving
            </small>
          </div>
          <span>
            <div className="form-group">
              <input
                type="date"
                id="start"
                name="trip"
                className="form-control form-control-lg"
                ref="startTime"
                defaultValue="YYYY-MM-DD"
                onChange={this.props.handleChange}
                min="1955-01-01"
                max="2090-12-31"
              />
              <small className="form-text text-muted">
                When did you start working for this company
              </small>
            </div>

            <div className="form-group">
              <input
                type="date"
                id="end"
                name="trip"
                className="form-control form-control-lg"
                ref="endTime"
                defaultValue="YYYY-MM-DD"
                onChange={this.props.handleChange}
                min="1955-01-01"
                max="2090-12-31"
              />
              <small className="form-text text-muted">
                When did you stop working for this company
              </small>
            </div>
            <br />
          </span>
          <span>
            <button onClick={this.cancelExperienceHandler}>Cancel</button>
            <button onClick={this.submitExperienceHandler}>Complete</button>
          </span>
        </div>
      );
    }
    return (
      <div className="profileinfo">
        <div className="subheader">
          <label>Employment History</label>
        </div>
        {this.state.workExperience.map(exp => (
          <div className="completed" key={exp.key}>
            <p>
              <strong>Company: </strong>
              {exp.company}
            </p>
            <p>
              <strong>Industry: </strong>
              {exp.industry}
            </p>
            <p>
              <strong>title: </strong>
              {exp.title}
            </p>
            <p>
              <strong>Summary: </strong>
              {exp.summary}
            </p>
            <button onClick={this.deleteExperienceHandler.bind(this, exp)}>
              Delete
            </button>
          </div>
        ))}
        {experienceForm}
        <div style={{ padding: "15px" }}>
          {this.state.addExperience ? null : (
            <button onClick={this.addExperienceHandler.bind(this)}>
              Add experience
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default ExperienceProfile;
