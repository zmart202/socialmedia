import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import hat from 'hat';

import Aux from '../../hoc/Aux/Aux';
import NewApplicant from './NewApplicant';
import ApplicantList from './ApplicantList';
import Spinner from '../../components/UI/Spinner/Spinner';

class Company extends Component{
  constructor(props){
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
                "Authorization": `Bearer ${this.token}`
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
        }).catch(err => {
            this.setState({
                isLoading: false,
                isError: true
            });
            console.error(err)
        });
    }

    putJobsInState(jobs) {
        this.setState({ jobs });
    }

    deleteApplicantsHandler = (applicant) => {
        const token = localStorage.getItem("token");
        if (token === null) {
            this.props.history.push("/company-login");
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email: applicant.email,
                id: applicant.id
            })
        };

        fetch("http://localhost:4567/api/company/remove-applicant", options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            this.refreshApplicantList();
        }).catch(err => console.error(err));
    }

    generateTokenHandler = () => {
        var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    createApplicant(firstName, lastName, email, jobId) {
        const token = localStorage.getItem("token");
        if (token === null) {
            return;
        }

        const id = hat();

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`,
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
        }).catch(err => console.error(err));
    }

    toggleCreateApplicant() {
        this.setState(prevState => ({
            createApplicantMounted: !prevState.createApplicantMounted
        }));
    }

    logOut = () => {
        localStorage.removeItem("token");
        this.props.history.push("/");
    }

    viewCancelHandler = () => {
        this.setState({viewing: false});
    }

    updateSearch = (event) => {
        this.setState({search: event.target.value.substr(0, 20)});
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner />;
        }

        if (this.state.isError) {
            return (
                <p>Error loading applicants</p>
            );
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
                <button type="button"
                    onClick={this.toggleCreateApplicant}
                    style={{ cursor: 'pointer' }}
                ><h4 style={{color: 'purple'}}>Create New Applicant</h4></button>
            );
        }

        return (
            <Aux>
                <header style={{textAlign: 'right', padding: '0px 40px 20px 40px', color: 'purple', cursor: 'pointer', marginTop: '15px'}}><a onClick={this.logOut}>Logout</a></header>
                <div style={{backgroundColor: '#d8d8d8', margin: '0px 0px 0px 0px', padding: '20px 0px', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                    <Link to="/company/jobs">Jobs</Link>
                    <h1 style={{color: 'purple'}}>All Potential Applicants for {this.state.companyName}</h1>
                    {createApplicant}
                    {createApplicantBtn}
                    <div style={{borderTopStyle: 'solid', margin: '20px 60px', borderColor: 'purple'}}>
                        <h4 style={{color: 'purple'}}>Search Bar</h4>
                        <input
                            type="text"
                            style={{padding: '10px'}}
                            value={this.state.search}
                            onChange={this.updateSearch.bind(this)}
                            placeholder="Search by last name.." />
                    </div>
                    <div style={{width:'1100px', margin:'0 auto'}}>
                    <ApplicantList
                        applicants={this.state.applicants}
                        deleteApplicantsHandler={this.deleteApplicantsHandler.bind(this)}
                        refreshApplicantList={this.refreshApplicantList.bind(this)}
                        searchedApplicant={this.state.search} />
                    </div>
                </div>
            </Aux>
        );
    }
}

export default Company;
