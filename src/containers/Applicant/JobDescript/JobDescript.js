import React, {Component} from 'react';

class JobDescript extends Component {
    constructor(props){
        super(props);
        this.state ={
            descriptInfo: 'This is where the description information will be kept.',
            requirementInfo: 'This is where the requirement information will be kept.',
            benefitInfo: 'This is where the benefit information will be kept.'
        }
    }
    render () {
        return (
            <div style={{backgroundColor: '#d4d4d6', margin: '0px 200px'}}>
                <h1>Job Description</h1>
                <h3>DESCRIPTION</h3>
                <p>{this.state.descriptInfo}</p>
                <h3>REQUIREMENTS</h3>
                <p>{this.state.requirementInfo}</p>
                <h3>BENEFITS</h3>
                <p>{this.state.benefitInfo}</p>
                <div style={{padding: '10px'}}>
                    <button style={{padding: '10px'}}>Apply for this job</button>
                </div>
            </div>
        )
    }
}

export default JobDescript;