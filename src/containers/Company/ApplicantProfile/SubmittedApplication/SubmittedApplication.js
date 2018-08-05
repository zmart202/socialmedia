import React from "react";
import "./SubmittedApplication.css";

const SubmittedApplication = props => {
  let { applicant } = props;

  let isOver18 = applicant.hasOwnProperty("over18") ?
    (applicant.over18 ? "Yes" : "No") : "Unknown";

  let isLegal = applicant.hasOwnProperty("legal") ?
    (applicant.legal ? "Yes" : "No") : "Unknown";

  let education = applicant.hasOwnProperty("education") ?
    (applicant.education.length > 0 ?
      applicant.education.map(edu => (
        <div key={edu.id} style={{ borderTop: "solid gray 2px" }}>
          <p>
            <strong>School:</strong> {edu.school}
          </p>
          <p>
            <strong>Study:</strong> {edu.study}
          </p>
          <p>
            <strong>Degree:</strong> {edu.degree}
          </p>
          <p>
            <strong>Start Date:</strong> {edu.startTime}
          </p>
          <p>
            <strong>End Date:</strong> {edu.endTime}
          </p>
        </div>
      )) : "None") : "Unknown";

  let workExperience = applicant.hasOwnProperty("workExperience") ?
    (applicant.workExperience.length > 0 ?
      applicant.workExperience.map(exp => (
        <div key={exp.id} style={{ borderTop: "solid gray 2px" }}>
          <p>
            <strong>Company Name:</strong> {exp.company}
          </p>
          <p>
            <strong>Company Industry:</strong> {exp.industry}
          </p>
          <p>
            <strong>Position Title:</strong> {exp.title}
          </p>
          <p>
            <strong>Position Summary:</strong> {exp.summary}
          </p>
          <p>
            <strong>Reason For Leaving:</strong> {exp.leaving}
          </p>
          <p>
            <strong>Start Date:</strong> {exp.startTime}
          </p>
          <p>
            <strong>End Date:</strong> {exp.endTime}
          </p>
        </div>
      )) : "None") : "Unknown";

  return (
    <div>
      <div className="resultsheaderapp">
        <h1>Submitted Application</h1>
        <div className="submittedapplication">
          <h3>Personal Information</h3>
          <p>
            <strong>First Name:</strong> {applicant.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {applicant.lastName}
          </p>
          <p>
            <strong>Address:</strong> {applicant.address || "Unknown"}
          </p>
          <p>
            <strong>City:</strong> {applicant.city || "Unknown"}
          </p>
          <p>
            <strong>State:</strong> {applicant.state || "Unknown"}
          </p>
          <p>
            <strong>ZIP Code:</strong> {applicant.zipCode || "Unknown"}
          </p>
          <p>
            <strong>Primary Contact:</strong> {applicant.phone || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {applicant.email}
          </p>
        </div>
        <div className="submittedapplication">
          <h3>Education</h3>
          {education}
        </div>
        <div className="submittedapplication">
          <h3>Employment History</h3>
          {workExperience}
        </div>
        <div className="submittedapplication">
          <h3>Applicant Details</h3>
          <p>
            <strong>Cover Letter:</strong> {applicant.coverLetter || "None"}
          </p>
          <p>
            <strong>Salary Requirements:</strong>{" "}
            {applicant.salaryRequirements || "None"}
          </p>
          <p>
            <strong>Is The Candidate Over The Age of 18:</strong> {isOver18}
          </p>
          <p>
            <strong>
              Is The Candidate Legally Allowed to Work in This State:
            </strong>{" "}
            {isLegal}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmittedApplication;
