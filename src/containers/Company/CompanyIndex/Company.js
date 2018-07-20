import React, { Component } from "react";
import hat from "hat";

import Aux from "../../../hoc/Aux/Aux";
import NewApplicant from "../NewApplicant/NewApplicant";
import ApplicantList from "../ApplicantList";
import Spinner from "../../../components/UI/Spinner/Spinner";
import "./Company.css";
import CompanyNav from "../CompanyNav/CompanyNav";
import ApplicantHeader from "../ApplicantHeader/ApplicantHeader";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      applicants: [],
      jobs: [],
      companyName: "",
      search: "",
      createApplicantMounted: false
    };

    this.token = localStorage.getItem("token");

    this.createApplicant = this.createApplicant.bind(this);
    this.toggleCreateApplicant = this.toggleCreateApplicant.bind(this);
    this.putJobsInState = this.putJobsInState.bind(this);
  }

  componentDidMount() {
    this.refreshApplicantList();
  }

  refreshApplicantList = () => {
    if (this.token === null) {
      this.props.history.push("/");
      return;
    }

    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };

    fetch("http://localhost:4567/api/company/applicants", options)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          return this.setState({
            isLoading: false,
            isError: true
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
          isError: true
        });
        console.error(err);
      });
  };

  putJobsInState(jobs) {
    this.setState({ jobs });
  }

  deleteApplicantsHandler = applicant => {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.props.history.push("/company-login");
      return;
    }

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: applicant.email,
        id: applicant.id
      })
    };

    fetch("http://localhost:4567/api/company/remove-applicant", options)
      .then(
        res => (res.status === 403 ? Promise.reject("Auth denied") : res.json())
      )
      .then(data => {
        this.refreshApplicantList();
      })
      .catch(err => console.error(err));
  };

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

  createApplicant(firstName, lastName, email, jobId) {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }

    const id = hat();

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        id,
        email,
        firstName,
        lastName,
        jobId
      })
    };

    fetch("http://localhost:4567/api/company/create-applicant", options)
      .then(res => res.json())
      .then(data => {
        this.refreshApplicantList();
      })
      .catch(err => console.error(err));
  }

  toggleCreateApplicant() {
    this.setState(prevState => ({
      createApplicantMounted: !prevState.createApplicantMounted
    }));
  }

  logOut = () => {
    localStorage.removeItem("token");
    this.props.history.push("/");
  };

  viewCancelHandler = () => {
    this.setState({ viewing: false });
  };

  updateSearch = event => {
    this.setState({ search: event.target.value.substr(0, 20) });
  };

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>Error loading applicants</p>;
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

    return (
      <div className="Company">
        <Aux>
          <div>
            <CompanyNav />
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
                onChange={this.updateSearch.bind(this)}
                placeholder="Type last name here.."
              />
            </div>
            <ApplicantHeader />
            <div className="CompanyApplicantList">
              <ApplicantList
                applicants={this.state.applicants}
                deleteApplicantsHandler={this.deleteApplicantsHandler.bind(
                  this
                )}
                refreshApplicantList={this.refreshApplicantList.bind(this)}
                searchedApplicant={this.state.search}
              />
            </div>
          </div>
        </Aux>
      </div>
    );
  }
}

export default Company;
