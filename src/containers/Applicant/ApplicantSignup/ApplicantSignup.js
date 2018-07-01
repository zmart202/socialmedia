import React, { Component } from 'react';
import _ from 'lodash';

import ApplicationDetails from './Input/ApplicationDetails';
import EducationProfile from './Input/Profile/EducationProfile';
import PersonalInformation from './Input/PersonalInformation';
import ExperienceProfile from './Input/Profile/ExperienceProfile';
import Toggle from 'react-toggle';
import './ApplicantSignup.css';

class ApplicantSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            email: '',
            workExperience: [],
            education: [],
            coverLetter: '',
            over18: false,
            educationFormMounted: false,
            educationKey: 1,
            addEducation: false,
            legal: false
        };

        this.companyId = props.match.params.companyId;
        this.testId = props.match.params.testId;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                companyId: this.companyId,
                testId: this.testId,
                ..._.omit(this.state, ["addEducation", "educationKey", "educationFormMounted"])
            })
        }
        fetch('http://localhost:4567/api/applicant/application', options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.props.history.push(`/applicant/${data.applicantId}`);
        }).catch((err) => console.log(err));
    }


    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
        console.log(value);
    }

    over18Handler = () => {
        this.setState({over18: !this.state.over18});
    }

    legalHandler = () => {
        this.setState({legal: !this.state.legal});
    }

    toggleEducationForm() {
        this.setState({
            educationFormMounted: !this.state.educationFormMounted
        });
    }

    render() {
        return (
            <div className="Form">
                <h3>Application Form</h3>
                <form>
                    <PersonalInformation handleChange={this.handleChange} />
                    <EducationProfile handleChange={this.handleChange} />
                    <ExperienceProfile handleChange={this.handleChange} />
                    <ApplicationDetails handleChange={this.handleChange} />
                    <div style={{backgroundColor: "#cfcfd1", margin: '0px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>
                        <label className="react-toggle" style={{padding: "20px 0px"}}>
                            <span style={{padding: '10px'}}>Are you 18 years or older?</span>
                            <Toggle 
                                defaultChecked={this.state.over18}
                                onChange={this.over18Handler} />
                        </label><br />
                        <label className="react-toggle" style={{padding: "20px 0px"}}>
                            <span style={{padding: '10px'}}>Are you a citizen of the U.S. or do you have a legal right to work in the U.S.?</span>
                            <Toggle 
                                defaultChecked={this.state.legal}
                                onChange={this.legalHandler} />
                        </label><br />
                        <div style={{color: 'red'}}>
                            <label>Once you have finished filling out the application and hit submit below, you will be prompted to take a timed assessment. Please answer all the questions to the best of your ability. Thank you!</label>
                        </div>
                        <div style={{padding: '40px'}}>
                            <button style={{padding: '10px 30px', color: 'purple'}} onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default ApplicantSignup;