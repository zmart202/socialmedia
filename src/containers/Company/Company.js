import React, { Component } from 'react';
import NewApplicant from './NewApplicant';
import ApplicantList from './ApplicantList';

class Company extends Component{
    constructor(props){
        super(props);
        this.state= {
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
    render() {
        return(
            <div>
                <h1>All Potential Applicants</h1>
                <NewApplicant />
                <ApplicantList applicants={this.state.applicants} />
            </div>
        );
    }
}

export default Company;