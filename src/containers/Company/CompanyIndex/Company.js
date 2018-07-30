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
      errorMsg: null,
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

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("http://localhost:4567/api/company/remove-applicant", options)
          .then(
            res =>
              res.status === 403 ? Promise.reject("Auth denied") : res.json()
          )
          .then(data => {
            console.log(data);
            if (!data.success) {
              return this.setState({
                isLoading: false,
                isError: true,
                errorMsg: data.msg
              });
            }

            this.refreshApplicantList();
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
    );
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

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("http://localhost:4567/api/company/create-applicant", options)
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

            this.refreshApplicantList();
          })
          .catch(err => {
            console.error(err);
            this.setState({
              isError: true,
              isLoading: false,
              errorMsg: err.message
            });
          });
      }
    );
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
          deleteApplicantsHandler={this.deleteApplicantsHandler.bind(this)}
          refreshApplicantList={this.refreshApplicantList.bind(this)}
          searchedApplicant={this.state.search}
        />
      );
    } else {
      applicantList = <p>No applicants for this company yet.</p>;
    }

    console.log(process.env.SENDGRID_API_KEY);

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
            <div className="CompanyApplicantList">{applicantList}</div>
          </div>
        </Aux>
      </div>
    );
  }
}

export default Company;
