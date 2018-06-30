import React, {Component} from 'react';
// import EducationInput from './EducationInput/EducationInput';

class EducationProfile extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        educationKey: 1,
                        education: [],
                        addEducation: false
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
                let educationObj = {
                        key: this.keyValueHandler(),
                        school,
                        study,
                        degree
                }
                this.setState({
                        education: this.state.education.concat(educationObj)
                });
                this.setState({addEducation: false});
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
                        <label>Education</label><br /><br />
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
                                                <label for="start">Start: </label>
                                                <input type="date" id="start" name="trip"
                                                style={{padding: '5px'}}
                                                value="YYYY-MM-DD"
                                                min="1955-01-01" max="2090-12-31" />
                                        </div>

                                        <div>
                                                <label for="end">End: </label>
                                                <input type="date" id="end" name="trip"
                                                style={{padding: '5px'}}
                                                value="YYYY-MM-DD"
                                                min="1955-01-01" max="2090-12-31" />
                                        </div>
                                </span><br />
                        </div>
                                <span>
                                        <button onClick={this.cancelEducationHandler}>Cancel</button>
                                        <button onClick={this.submitEducationHandler}>Complete</button>
                                </span>
                        </div>;
                }
                return (
                        <div style={{backgroundColor: "#cfcfd1", margin: '10px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>
                                {this.state.education.map((edu) => (
                                        <div style={{backgroundColor: '#cfcfd1', padding: '5px'}} key={edu.key}>
                                        <p><strong>School: </strong>{edu.school}</p>
                                        <p><strong>Study: </strong>{edu.study}</p>
                                        <p><strong>Degree: </strong>{edu.degree}</p>
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