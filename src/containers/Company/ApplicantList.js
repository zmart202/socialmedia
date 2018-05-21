import _ from 'lodash';
import React, { Component } from 'react';
import ApplicantHeader from './ApplicantHeader';
import IndividualApplicant from './IndividualApplicant';

class ApplicantList extends Component {
    renderItems = () => {
        const props = _.omit(this.props, 'applicants');

        return this.props.applicants.map((applicant) => 
            (<IndividualApplicant applicant={applicant} 
                                        delete={() => props.deleteApplicantsHandler(applicant)}
                                        key={applicant.key} 
                                        {...props}  />)
            );
    }

    render() {
            return(
                <table>
                    <ApplicantHeader />
                    <tbody >
                            {this.renderItems()}
                    </tbody>
                </table>
            );
        }
}

export default ApplicantList;