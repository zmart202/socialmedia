//import _ from 'lodash';
import React, { Component } from 'react';
import ApplicantHeader from './ApplicantHeader';
import IndividualApplicant from './IndividualApplicant';

class ApplicantList extends Component{
render() {
        return(
            <table>
                <ApplicantHeader />
                <tbody>
                        {
                            this.props.applicants.map((applicant) => {
                                return <IndividualApplicant applicant={applicant} key={applicant.key}/>
                            })
                        }
                </tbody>
            </table>
        );
    }
}

export default ApplicantList;