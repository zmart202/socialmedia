import React, {Component} from 'react';

class ApplicationDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedFile: null
        }
    }
    fileSelectHandler = (event) => {
        this.setState({selectedFile: event.target.files[0]});
    }
    render () {
        return <div style={{backgroundColor: "#cfcfd1", margin: '10px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', padding: '20px 0px'}}>
            <div style={{padding: '10px', textDecoration: 'underline'}}>
                <label>Application Details</label><br />
            </div>
            <div style={{padding: '10px'}}>
                <label>Upload Resume: </label>
                <input 
                    type="file"
                    onChange={this.fileSelectHandler} />
            </div>
            <textarea 
                cols="100" 
                rows="5" 
                onChange={this.props.handleChange} 
                name="coverLetter" 
                placeholder="Cover letter"/><br />
            <textarea 
                cols="100" 
                rows="5" 
                onChange={this.props.handleChange} 
                name="coverLetter" 
                placeholder="Please specify your salary requirements"/><br />
        </div>
    }
}

export default ApplicationDetails;