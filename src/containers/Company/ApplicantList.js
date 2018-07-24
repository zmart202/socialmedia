import _ from "lodash";
import React, { Component } from "react";
import IndividualApplicant from "./IndividualApplicant/IndividualApplicant";

class ApplicantList extends Component {
  renderItems = () => {
    let filteredApplicant = this.props.applicants.filter(applicant => {
      return (
        applicant.lastName
          .toLowerCase()
          .indexOf(this.props.searchedApplicant.toLowerCase()) !== -1
      );
    });
    const props = _.omit(this.props, "applicants");

    const sorted = filteredApplicant
      .slice()
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

    return sorted.map(applicant => (
      <IndividualApplicant
        applicant={applicant}
        deleteApplicant={props.deleteApplicant}
        editApplicant={props.editApplicant}
        key={applicant.id}
        {...props}
      />
    ));
  };

  render() {
    return <div>{this.renderItems()}</div>;
  }
}

export default ApplicantList;
