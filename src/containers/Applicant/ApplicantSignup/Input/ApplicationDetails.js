import React from 'react';

const applicationDetails = (props) => {
    return <div style={{backgroundColor: "#cfcfd1", margin: '10px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', padding: '20px 0px'}}>
        <div style={{padding: '10px'}}>
            <label>Application Details</label><br />
        </div>
        <textarea 
            cols="100" 
            rows="5" 
            onChange={props.handleChange} 
            name="coverLetter" 
            placeholder="Cover letter"/><br />
        <textarea 
            cols="100" 
            rows="5" 
            onChange={props.handleChange} 
            name="coverLetter" 
            placeholder="Please specify your salary requirements"/><br />
    </div>
}

export default applicationDetails;