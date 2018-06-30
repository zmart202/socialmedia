import React, { Component } from 'react';
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
        this.testId = props.match.params.companyId;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
    }


    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
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
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        );
    }
}

export default ApplicantSignup;