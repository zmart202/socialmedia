import React from "react";
import TextFieldGroup from "../../../../components/UI/Form/TextFieldGroup";
import "./PersonalInformation.css";

const personalInformation = props => {
  return (
    <div className="personalinfo">
      <div className="subheader">
        <label>Personal Information</label>
        <br />
      </div>
      <div className="personalinput">
        <TextFieldGroup
          name="firstName"
          placeholder="First Name"
          type="text"
          onChange={props.handleChange}
          info="* Please fill out your first name"
        />
      </div>
      <div className="personalinput">
        <TextFieldGroup
          name="lastName"
          placeholder="Last Name"
          type="text"
          onChange={props.handleChange}
          info="* Please fill out your last name"
        />
      </div>
      <div className="personalinput">
        <TextFieldGroup
          name="address"
          placeholder="Address"
          type="text"
          onChange={props.handleChange}
          info="* Please fill out the address of your current residence (ex. 121 Commonwealth Ave)"
        />
      </div>
      <div className="personalinput">
        <TextFieldGroup
          name="city"
          placeholder="City"
          type="text"
          onChange={props.handleChange}
          info="* Please fill out the city of which your residence is located"
        />
      </div>
      <div className="personalinput">
        <TextFieldGroup
          name="state"
          placeholder="State"
          type="text"
          onChange={props.handleChange}
          info="* Please fill out the state in which your current residence is located"
        />
      </div>
      <div className="personalinput">
        <TextFieldGroup
          name="zipCode"
          placeholder="ZIP Code"
          type="text"
          onChange={props.handleChange}
          info="* Please fill out your current residences ZIP Code"
        />
      </div>
      <div className="personalinput">
        <TextFieldGroup
          name="phone"
          placeholder="Phone"
          type="text"
          onChange={props.handleChange}
          info="* Please fill out the best phone number to reach you at"
        />
      </div>
      <div className="personalinput">
        <TextFieldGroup
          name="email"
          placeholder="Email"
          type="text"
          onChange={props.handleChange}
          info="* Please fill out your primary email"
        />
      </div>
      <br />
    </div>
  );
};

export default personalInformation;
