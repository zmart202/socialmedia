import React, {Component} from 'react';
import Toggle from 'react-toggle';
// import EducationInput from './EducationInput/EducationInput';

class EducationProfile extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        educationKey: 1,
                        education: [],
                        addEducation: false,
                        finishedSchool: false
                }
        }
        keyValueHandler = () => {
                let num = this.state.educationKey;
                num += 1;
                this.setState({educationKey: num});
                return this.state.educationKey;
        }

        submitEducationHandler = (event) => {
                event.preventDefault();
                let school = this.refs.school.value;
                let study = this.refs.study.value;
                let degree = this.refs.degree.value;
                let startTime = this.refs.startTime.value;
                let endTime = this.refs.endTime.value;
                let finishedSchool = this.state.finishedSchool;
                let educationObj = {
                        key: this.keyValueHandler(),
                        school,
                        study,
                        degree,
                        startTime,
                        endTime,
                        finishedSchool
                }
                this.setState({
                        education: this.state.education.concat(educationObj)
                });
                this.setState({addEducation: false, finishedSchool: false});
        }

        finishedSchoolHandler = () => {
                this.setState({finishedSchool: !this.state.finishedSchool});
        }

        cancelEducationHandler = () => {
                this.setState({addEducation: false});
        }

        addEducationHandler = (event) => {
                event.preventDefault();
                this.setState({addEducation: true});
        }

        deleteEducationHandler = (edu, event) => {
                event.preventDefault();
                let educate = this.state.education.indexOf(edu);
                let education = this.state.education;
                education.splice(educate, 1);
                this.setState({
                    education
                });
        }
        render () {
                let educationForm = null;
                if (this.state.addEducation) {
                educationForm =
                        <div style={{backgroundColor:'#cfcfd1', padding:'10px'}}>
                        <div>
                                <label>School (required): </label>
                                <input
                                        ref="school"
                                        style={{padding: '5px'}}
                                        type="text"
                                        placeholder="School (required)"
                                        onChange={this.props.handleChange} />
                        </div>        
                        <br />
                        <div>
                                <label>Field of study: </label>
                                <input
                                        ref="study"
                                        style={{padding: '5px'}}
                                        type="text"
                                        placeholder="Field of study"
                                        onChange={this.props.handleChange} />
                        </div>
                        <br />
                        <div>
                                <label>Degree: </label>
                                <input
                                        ref="degree"
                                        style={{padding: '5px'}}
                                        type="text"
                                        placeholder="Degree"
                                        onChange={this.props.handleChange} />
                        </div>
                        <br />
                        <div>
                                <span>
                                        <div>
                                                <label htmlFor="start">Start: </label>
                                                <input type="date"
                                                style={{padding: '5px'}}
                                                onChange={this.props.handleChange}
                                                defaultValue="yyyy-MM-dd"
                                                ref="startTime"
                                                min="1955-01-01" max="2090-12-31" />
                                        </div>

                                        <div>
                                                <label htmlFor="end">End: </label>
                                                <input type="date"
                                                style={{padding: '5px'}}
                                                onChange={this.props.handleChange}
                                                defaultValue="yyyy-MM-dd"
                                                ref="endTime"
                                                min="1955-01-01" max="2090-12-31" />
                                        </div>
                                </span><br />
                                <label className="react-toggle" style={{padding: "20px 0px"}}>
                                <span style={{padding: '10px'}}>Did you complete your education?</span>
                                        <Toggle 
                                                defaultChecked={this.state.finishedSchool}
                                                onChange={this.finishedSchoolHandler} />
                                </label><br />
                        </div>
                                <span>
                                        <button onClick={this.cancelEducationHandler}>Cancel</button>
                                        <button onClick={this.submitEducationHandler}>Complete</button>
                                </span>
                        </div>;
                }
                return (
                        <div style={{backgroundColor: "#cfcfd1", margin: '10px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>
                                <div style={{padding: '10px', textDecoration: 'underline'}}>
                                        <label>Education</label>
                                </div>
                                {this.state.education.map((edu) => (
                                        <div style={{backgroundColor: '#cfcfd1', padding: '5px'}} key={edu.key}>
                                        <p><strong>School: </strong>{edu.school}</p>
                                        <p><strong>Study: </strong>{edu.study}</p>
                                        <p><strong>Degree: </strong>{edu.degree}</p>
                                        <p><strong>From: </strong>{edu.startTime} <strong>To: </strong>{edu.endTime}</p>
                                        <button onClick={this.deleteEducationHandler.bind(this, edu)}>Delete</button>
                                        </div>
                                ))}
                                {educationForm}
                                <div style={{padding: '15px'}}>
                                        {this.state.addEducation? null : <button onClick={this.addEducationHandler.bind(this)}>Add education</button>}
                                </div>
                        </div>
                )
        }
        
}

export default EducationProfile;