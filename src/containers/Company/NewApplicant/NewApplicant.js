import React, { Component } from "react";

import Spinner from "../../../components/UI/Spinner/Spinner";
import "./NewApplicant.css";

class NewApplicant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      errorMsg: "",
      firstName: "",
      lastName: "",
      email: "",
      selectedJobId: ""
    };

    this.createHandler = this.createHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.jobs.length > 0) {
      return;
    }

    this.setState(
      {
        isLoading: true
      },
      () => {
        const options = {
          headers: {
            Authorization: `Bearer ${this.props.token}`
          }
        };

        fetch("http://localhost:4567/api/company/jobs", options)
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              console.log(data);
              return this.setState({
                isLoading: false,
                isError: true
              });
            }

            console.log(data);
            this.props.putJobsInState(data.jobs);
            this.setState({ isLoading: false });
          })
          .catch(err => {
            console.error(err);
            this.setState({
              isError: true,
              isLoading: false
            });
          });
      }
    );
  }

  createHandler(e) {
    if (this.state.selectedJobId.length === 0) {
      return this.setState({
        errorMsg: "Please select a job"
      });
    }

    this.props.createApplicant(
      this.state.firstName,
      this.state.lastName,
      this.state.email,
      this.state.selectedJobId
    );
    this.props.toggleCreateApplicant();
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>Error loading jobs</p>;
    }

    if (this.props.jobs.length === 0) {
      return (
        <div>
          <p>No jobs yet created for this company.</p>
          <p>Please create at least one job before creating applicants</p>
        </div>
      );
    }

    let errorMsg = "";
    if (this.state.errorMsg.length > 0) {
      errorMsg = <p style={{ color: "red" }}>{this.state.errorMsg}</p>;
    }

    return (
      <div className="createapplicantform">
        <form>
          <label className="formHeader">
            Fill Out New Applicant Form Below
          </label>
          <div className="input">
            <input
              type="text"
              placeholder="Type first name here..."
              name="firstName"
              onChange={this.handleChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Type last name here..."
              name="lastName"
              onChange={this.handleChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Type email here..."
              name="email"
              onChange={this.handleChange}
            />
          </div>
          <div className="input">
            <select
              name="selectedJobId"
              defaultValue=""
              onChange={this.handleChange}
            >
              <option value="" disabled hidden>
                Assign Job
              </option>
              {this.props.jobs.map(x => (
                <option key={x.id} value={x.id}>
                  {x.title}
                </option>
              ))}
            </select>
          </div>
          <div className="btn">
            <a className="individualBtn" onClick={this.createHandler}>
              Create
            </a>
            <a
              className="individualBtn"
              onClick={this.props.toggleCreateApplicant}
            >
              Cancel
            </a>
          </div>
          <br />
          {errorMsg}
        </form>
      </div>
    );
  }
}

export default NewApplicant;