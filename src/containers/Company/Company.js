import React, { Component } from 'react';
import NewApplicant from './NewApplicant';
import ApplicantList from './ApplicantList';

class Company extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            isAuth: false,
            applicants: [
                {
                    key: 1,
                    lname: "Martin",
                    fname: "Zachary",
                    email: "zmartin@umassd.edu",
                    password: "abcdefgh",
                    status: false
                },
                {
                    key: 2,
                    lname: "Gates",
                    fname: "Bill",
                    email: "bgates@umassd.edu",
                    password: "afjdkljd",
                    status: true
                }
            ]
        }
    }

    componentDidMount() {
        if (localStorage.getItem("token") === null) {
            this.setState({ isLoading: false });
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        };

        fetch("http://localhost:4567/company", options)
        .then(res => {
            this.setState({ isLoading: false });
            if (res.status === 200) {
                this.setState({ isAuth: true });
            }
        }).catch(err => console.error(err));
    }

    render() {
        if (this.state.isLoading) {
            return (
                <p>Loading...</p>
            );
        }

        if (!this.state.isAuth) {
            return (
                <p>You are not authorized to view this page</p>
            );
        }

        return (
            <div>
                <h1>All Potential Applicants</h1>
                <NewApplicant />
                <ApplicantList applicants={this.state.applicants} />
            </div>
        );
    }
}

export default Company;
