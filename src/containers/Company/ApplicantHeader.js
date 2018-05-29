import React, { Component } from 'react';

class ApplicantHeader extends Component{
    render() {
        return(
            <thead>
                <tr>
                    <th style={{padding: "12px 30px"}}>Last Name</th>
                    <th style={{padding: "12px 30px"}}>First Name</th>
                    <th style={{padding: "12px 30px"}}>Email</th>
                    <th style={{padding: "12px 30px"}}>Token</th>
                    <th style={{padding: "12px 30px"}}>Status</th>
                    <th style={{padding: "12px 30px"}}>Results</th>
                    <th style={{padding: "12px 30px"}}>Actions</th>
                </tr>
            </thead>
        );
    }
}

export default ApplicantHeader;
