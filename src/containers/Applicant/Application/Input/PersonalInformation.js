import React from 'react';

const personalInformation = (props) => {
    return <div style={{backgroundColor: "#cfcfd1", margin: '0px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>
            <div style={{padding: '20px', textDecoration: 'underline'}}>
                <label>Personal Information</label><br />
            </div>
            <div>
                <label><span style={{color: 'red'}}>*</span> First Name: </label>
                <input
                    name="firstName"
                    style={{padding: '5px'}}
                    type="text"
                    placeholder="First Name"
                    onChange={props.handleChange}
                />
            </div>
            <br />
            <div>
                <label><span style={{color: 'red'}}>*</span> Last Name: </label>
                <input
                    name="lastName"
                    style={{padding: '5px'}}
                    type="text"
                    placeholder="Last Name"
                    onChange={props.handleChange}
                />
            </div>
            <br />
            <div>
                <label><span style={{color: 'red'}}>*</span> Address: </label>
                <input
                    name="address"
                    style={{padding: '5px'}}
                    type="text"
                    placeholder="Address"
                    onChange={props.handleChange}
                />
            </div>
            <br />
            <div>
                <label><span style={{color: 'red'}}>*</span> City: </label>
                <input
                    name="city"
                    style={{padding: '5px'}}
                    type="text"
                    placeholder="City"
                    onChange={props.handleChange}
                />
            </div>
            <br />
            <div>
                <label><span style={{color: 'red'}}>*</span> State: </label>
                <input
                    name="state"
                    style={{padding: '5px'}}
                    type="text"
                    placeholder="State"
                    onChange={props.handleChange}
                />
            </div>
            <br />
            <div>
                <label><span style={{color: 'red'}}>*</span> ZIP Code: </label>
                <input
                    name="zipCode"
                    style={{padding: '5px'}}
                    type="text"
                    placeholder="Zipcode"
                    onChange={props.handleChange}
                />
            </div>
            <br />
            <div>
                <label><span style={{color: 'red'}}>*</span> Primary Contact: </label>
                <input
                    name="phone"
                    style={{padding: '5px'}}
                    type="text"
                    placeholder="Phone"
                    onChange={props.handleChange}
                />
            </div>
            <br />
            <div>
                <label><span style={{color: 'red'}}>*</span> Email: </label>
                <input
                    name="email"
                    style={{padding: '5px'}}
                    type="text"
                    placeholder="Email"
                    onChange={props.handleChange}
                />
            </div>
            <br />
    </div>
}

export default personalInformation;