import _ from 'lodash';
import React, { Component } from 'react';
import ApplicantHeader from './ApplicantHeader';
import IndividualApplicant from './IndividualApplicant/IndividualApplicant';

class ApplicantList extends Component {
    renderItems = () => {
        let filteredApplicant = this.props.applicants.filter(
            (applicant) => {
                return applicant.lname.toLowerCase().indexOf(this.props.searchedApplicant.toLowerCase()) !== -1;
            }
        );
        const props = _.omit(this.props, 'applicants');

        return filteredApplicant.map((applicant) => 
            (<IndividualApplicant applicant={applicant} 
                                        delete={() => props.deleteApplicantsHandler(applicant)}
                                        results={() => props.viewable(applicant)}
                                        key={applicant.key} 
                                        {...props}  />)
            );
    }

    render() {
            return(
                <div>
                <table>
                    <ApplicantHeader />
                    <tbody style={{textAlign: 'center', align: 'center', width: '100%'}}>
                            {this.renderItems()}
                    </tbody>
                </table>
                </div>
            );
        }
}

export default ApplicantList;