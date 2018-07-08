import React, {Component} from 'react';
import ResultsHeader from '../ResultsHeader';

class SubmittedApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: 'Jackson',
            lastName: 'Lenhart',
            address: '12 Braemore Street',
            city: 'Natick',
            state: 'MA',
            zipCode: '01760',
            phone: '508-999-9191',
            email: 'jacksonlenhart@gmail.com',
            education: [
                {
                    key: 1,
                    school: 'Harvard',
                    study: 'Marketing',
                    degree: 'Bachelor',
                    startTime: '2011-09-07',
                    endTime: '2015-12-10',
                    finishedSchool: true
                }
            ],
            workExperience: [
                {
                    key: 1,
                    company: 'Something farms',
                    industry: 'agriculture',
                    title: 'Cashier',
                    summary: 'I helped ring out customers',
                    leaving: 'I wanted to try something new',
                    startTime: '2013-01-24',
                    endTime: '2017-08-15'
                },
                {
                    key: 2,
                    company: 'Music Instructor',
                    industry: 'Music',
                    title: 'Instructor',
                    summary: 'I teach students how to learn different instruments',
                    leaving: 'I still do this on the side for extra money and because I enjoy it!',
                    startTime: '2016-08-20',
                    endTime: '2018-07-04'
                }
            ],
            coverLetter: 'I will be the best there ever was',
            salaryRequirements: 'I need to make enough money to survive',
            over18: true,
            legal: true
        }
    }
    render() {
        let style = {
            backgroundColor: "#cfcfd1", 
            margin: '0px 300px', 
            boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'
        };

        let isOver18 = this.state.over18 ? "Yes" : "No";

        let isLegal = this.state.legal ? "Yes" : "No";

        let education = this.state.education.map((edu) => {
            return (
                <div key={edu.key} style={{borderTop: 'solid gray 2px'}}>
                    <p><strong>School:</strong> {edu.school}</p>
                    <p><strong>Study:</strong> {edu.study}</p>
                    <p><strong>Degree:</strong> {edu.degree}</p>
                    <p><strong>Start Date:</strong> {edu.startTime}</p>
                    <p><strong>End Date:</strong> {edu.endTime}</p>
                </div>
            )
        });

        let workExperience = this.state.workExperience.map((exp) => {
            return (
                <div key={exp.key} style={{borderTop: 'solid gray 2px'}}>
                    <p><strong>Company Name:</strong> {exp.company}</p>
                    <p><strong>Company Industry:</strong> {exp.industry}</p>
                    <p><strong>Position Title:</strong> {exp.title}</p>
                    <p><strong>Position Summary:</strong> {exp.summary}</p>
                    <p><strong>Reason For Leaving:</strong> {exp.leaving}</p>
                    <p><strong>Start Date:</strong> {exp.startTime}</p>
                    <p><strong>End Date:</strong> {exp.endTime}</p>
                </div>
            )
        })
        return (
            <div>
                <ResultsHeader />
                <h1>Submitted Application</h1>
                <div style={style}>
                    <h3>Personal Information</h3>
                    <p><strong>First Name:</strong> {this.state.firstName}</p>
                    <p><strong>Last Name:</strong> {this.state.lastName}</p>
                    <p><strong>Address:</strong> {this.state.address}</p>
                    <p><strong>City:</strong> {this.state.city}</p>
                    <p><strong>State:</strong> {this.state.state}</p>
                    <p><strong>ZIP Code:</strong> {this.state.zipCode}</p>
                    <p><strong>Primary Contact:</strong> {this.state.phone}</p>
                    <p><strong>Email:</strong> {this.state.email}</p>
                </div>
                <div style={style}>
                    <h3>Education</h3>
                    {education}
                </div>
                <div style={style}>
                    <h3>Employment History</h3>
                    {workExperience}
                </div>
                <div style={style}>
                    <h3>Applicant Details</h3>
                    <p><strong>Cover Letter:</strong> {this.state.coverLetter}</p>
                    <p><strong>Salary Requirements:</strong> {this.state.salaryRequirements}</p>
                    <p><strong>Is The Candidate Over The Age of 18:</strong> {isOver18}</p>
                    <p><strong>Is The Candidate Legally Allowed to Work in This State:</strong> {isLegal}</p>
                </div>
            </div>
        )
    }
}

export default SubmittedApplication;