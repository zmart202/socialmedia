import _ from 'lodash';
import React, { Component } from 'react';
import ApplicantHeader from './ApplicantHeader';
import IndividualApplicant from './IndividualApplicant';

class ApplicantList extends Component {
    renderItems = () => {
        const props = _.omit(this.props, 'applicants');

        const sorted = this.props.applicants.slice()
            .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

        return sorted.map((applicant) =>
            <IndividualApplicant applicant={applicant}
                                    delete={() => props.deleteApplicantsHandler(applicant)}
                                    results={() => props.viewable(applicant)}
                                    {...props}  />
        );
    }

    render() {
            return(
                <div>
                <table>
                    <ApplicantHeader />
                    <tbody >
                            {this.renderItems()}
                    </tbody>
                </table>
                </div>
            );
        }
}

export default ApplicantList;
