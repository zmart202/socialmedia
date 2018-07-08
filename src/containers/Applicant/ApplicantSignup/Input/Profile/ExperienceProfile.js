import React, {Component} from 'react';
// import EducationInput from './EducationInput/EducationInput';

class ExperienceProfile extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        experienceKey: 1,
                        workExperience: [],
                        addExperience: false
                }
        }
        keyValueHandler = () => {
                let num = this.state.experienceKey;
                num += 1;
                this.setState({educationKey: num});
                return this.state.experienceKey;
        }

        submitExperienceHandler = (event) => {
                event.preventDefault();
                let company = this.refs.company.value;
                let industry = this.refs.industry.value;
                let title = this.refs.title.value;
                let summary = this.refs.summary.value;
                let leaving = this.refs.leaving.value;
                let experienceObj = {
                        key: this.keyValueHandler(),
                        company,
                        industry,
                        title,
                        summary,
                        leaving
                }
                this.setState({
                        workExperience: this.state.workExperience.concat(experienceObj)
                });
                this.setState({addExperience: false});
        }

        addExperienceHandler = (event) => {
                event.preventDefault();
                this.setState({addExperience: true});
        }

        cancelExperienceHandler = () => {
                this.setState({addExperience: false});
        }

        deleteExperienceHandler = (exp, event) => {
                event.preventDefault();
                let experience = this.state.workExperience.indexOf(exp);
                let workExperience = this.state.workExperience;
                workExperience.splice(experience, 1);
                this.setState({
                    workExperience
                });
        }
        render () {
                let experienceForm = null;
                if (this.state.addExperience) {
                experienceForm =
                        <div style={{backgroundColor:'#cfcfd1', padding:'10px'}}>
                        <div>
                                <label>Company (required): </label>
                                <input
                                        ref="company"
                                        type="text"
                                        placeholder="Company... (required)"
                                        onChange={this.props.handleChange} />
                        </div>        
                        <br />
                        <div>
                                <label>Type of industry: </label>
                                <input
                                        ref="industry"
                                        type="text"
                                        placeholder="Type of industry.."
                                        onChange={this.props.handleChange} />
                        </div>
                        <br />
                        <div>
                                <label>Your title: </label>
                                <input
                                        ref="title"
                                        type="text"
                                        placeholder="Your title.."
                                        onChange={this.props.handleChange} />
                        </div>        
                        <br />
                        <div>
                                <label>Summary: </label>
                                <textarea
                                        ref="summary"
                                        cols="50"
                                        rows="5"
                                        type="text"
                                        placeholder="Summary of what you did.."
                                        onChange={this.props.handleChange} />
                        </div>
                        <br />
                        <div>
                                <label>Reason for leaving: </label>
                                <textarea
                                        ref="leaving"
                                        cols="50"
                                        rows="5"
                                        type="text"
                                        placeholder="What were the reasons for leaving the job.."
                                        onChange={this.props.handleChange} />
                        </div>
                        <br />
                        <span>
                                <div>
                                        <label htmlFor="start">Start: </label>
                                        <input type="date" id="start" name="trip"
                                        ref="startTime"
                                        defaultValue="YYYY-MM-DD"
                                        onChange={this.props.handleChange}
                                        min="1955-01-01" max="2090-12-31" />
                                </div>

                                <div>
                                        <label htmlFor="end">End: </label>
                                        <input type="date" id="end" name="trip"
                                        ref="endTime"
                                        defaultValue="YYYY-MM-DD"
                                        onChange={this.props.handleChange}
                                        min="1955-01-01" max="2090-12-31" />
                                </div><br />
                        </span>
                                <span><button onClick={this.cancelExperienceHandler}>Cancel</button><button onClick={this.submitExperienceHandler}>Complete</button></span>
                        </div>;
                }
                return (
                        <div style={{backgroundColor: "#cfcfd1", margin: '10px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>
                                <div style={{padding: '10px', textDecoration: 'underline'}}>
                                        <label>Employment History</label>
                                </div>
                                {this.state.workExperience.map((exp) => (
                                        <div style={{backgroundColor: '#cfcfd1', padding: '5px'}} key={exp.key}>
                                        <p><strong>Company: </strong>{exp.company}</p>
                                        <p><strong>Industry: </strong>{exp.industry}</p>
                                        <p><strong>title: </strong>{exp.title}</p>
                                        <p><strong>Summary: </strong>{exp.summary}</p>
                                        <button onClick={this.deleteExperienceHandler.bind(this, exp)}>Delete</button>
                                        </div>
                                ))}
                                {experienceForm}
                                <div style={{padding: '15px'}}>
                                        {this.state.addExperience? null : <button onClick={this.addExperienceHandler.bind(this)}>Add experience</button>}
                                </div>
                        </div>
                )
        }
        
}

export default ExperienceProfile;