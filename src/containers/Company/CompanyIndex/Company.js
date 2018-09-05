import React, { Component } from "react";

import NewApplicant from "../NewApplicant/NewApplicant";
import ApplicantList from "../ApplicantList";
import Spinner from "../../../components/UI/Spinner/Spinner";
import "./Company.css";
import ApplicantHeader from "../ApplicantHeader/ApplicantHeader";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      errorMsg: null,
      applicants: [],
      jobs: [],
      companyName: "",
      search: "",
      createApplicantMounted: false
    };

    this.token = localStorage.getItem("token");
  }

  componentDidMount() {
    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };

    fetch("/api/company/applicants", options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          return this.setState({
            isLoading: false,
            isError: true,
            errorMsg: data.msg
          });
        }
        this.setState({
          isLoading: false,
          applicants: data.applicants,
          companyName: data.companyName
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          isError: true,
          errorMsg: err.message
        });
        console.error(err);
      });
  }

  generateTokenHandler = () => {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  putJobsInState = jobs => this.setState({ jobs });

  deleteApplicant = applicant =>
    this.setState(prevState => ({
      isLoading: false,
      applicants: prevState.applicants.filter(x => x.id !== applicant.id)
    }));

  createApplicant = applicant =>
    this.setState(prevState => ({
      isLoading: false,
      applicants: [applicant].concat(prevState.applicants),
      createApplicantMounted: false
    }));

  editApplicant = applicant =>
    this.setState(prevState => ({
      applicants: prevState.applicants.map(
        x =>
          x.id === applicant.id
            ? {
                ...x,
                firstName: applicant.firstName,
                lastName: applicant.lastName
              }
            : x
      )
    }));

  toggleCreateApplicant = () =>
    this.setState(prevState => ({
      createApplicantMounted: !prevState.createApplicantMounted
    }));

  updateSearch = event =>
    this.setState({ search: event.target.value.substr(0, 20) });

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>{this.state.errorMsg}</p>;
    }

    let createApplicantBtn = "";
    let createApplicant = "";
    if (this.state.createApplicantMounted) {
      createApplicant = (
        <NewApplicant
          token={this.token}
          createApplicant={this.createApplicant}
          toggleCreateApplicant={this.toggleCreateApplicant}
          putJobsInState={this.putJobsInState}
          jobs={this.state.jobs}
        />
      );
    } else {
      createApplicantBtn = (
        <button
          className="createBtn"
          type="button"
          onClick={this.toggleCreateApplicant}
        >
          Create New Applicant
        </button>
      );
    }

    let applicantList = "";
    if (this.state.applicants.length > 0) {
      applicantList = (
        <ApplicantList
          applicants={this.state.applicants}
          deleteApplicant={this.deleteApplicant}
          editApplicant={this.editApplicant}
          searchedApplicant={this.state.search}
        />
      );
    } else {
      applicantList = <p>No applicants for this company yet.</p>;
    }

    return (
      <div className="Company">
        <div>
          <div className="CompanyName">
            <h1>{this.state.companyName}</h1>
          </div>
          {createApplicant}
          {createApplicantBtn}
          <div className="applicantList">
            <strong>Search Applicant by Last Name</strong>
            <br />
            <input
              type="text"
              value={this.state.search}
              onChange={this.updateSearch}
              placeholder="Type last name here.."
            />
          </div>
          <ApplicantHeader />
          <div className="CompanyApplicantList">{applicantList}</div>
        </div>
      </div>
    );
  }
}

export default Company;
