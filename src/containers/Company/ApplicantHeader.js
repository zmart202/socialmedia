import React, { Component } from 'react';

class ApplicantHeader extends Component{
    render() {
        return(
            <thead>
                <tr style={{color: 'purple'}}>
                    <th style={{padding: "12px 30px", textDecoration: 'underline'}}>Last Name</th>
                    <th style={{padding: "12px 30px", textDecoration: 'underline'}}>First Name</th>
                    <th style={{padding: "12px 30px", textDecoration: 'underline'}}>Email</th>
                    <th style={{padding: "12px 30px", textDecoration: 'underline'}}>Password</th>
                    <th style={{padding: "12px 30px", textDecoration: 'underline'}}>Status</th>
                    <th style={{padding: "12px 30px", textDecoration: 'underline'}}>Results</th>
                    <th style={{padding: "12px 30px", textDecoration: 'underline'}}>Actions</th>
                </tr>
            </thead>
        );
    }
}

export default ApplicantHeader;