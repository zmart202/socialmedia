import React, { Component } from "react";
import "./IndividualApplicant.css";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ActionButtons from "../../../components/UI/Buttons/ActionButtons";

class IndividualApplicant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isError: false,
      isEditing: false
    };
  }

  editHandler = () => {
    this.setState({ isEditing: true });
  };

  onCancelClick = () => {
    this.setState({ isEditing: false });
  };

  onSaveClick(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        id: this.props.applicant.id,
        firstName: this.refs.editFName.value,
        lastName: this.refs.editLName.value
      })
    };

    fetch("http://localhost:4567/api/company/edit-applicant", options)
      .then(
        res => (res.status === 403 ? Promise.reject("Auth denied") : res.json())
      )
      .then(data => {
        console.log(data);
        if (!data.success) {
          return this.setState({
            isError: true
          });
        }
        
        this.props.refreshApplicantList();
        this.setState({ isEditing: false });
      })
      .catch(err => console.error(err));
  }

  completionHandler = () => {
    if (this.props.applicant.completed) {
      return <p style={{ color: "green" }}>COMPLETE</p>;
    } else {
      return <p style={{ color: "red" }}>INCOMPLETE</p>;
    }
  };

  viewApplicantResults = () => {
    return (
      <div>
        {this.props.applicant.completed ? (
          <strong>
            <Link
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline"
              }}
              to={`/company/results/${this.props.applicant.id}`}
            >
              <div style={{ paddingBottom: "5px" }}>VIEW</div>
            </Link>
          </strong>
        ) : null}
      </div>
    );
  };

  copyURLHandler = () => {
    let URL = `http://localhost:3000/applicant/${this.props.applicant.id}`;
    return (
      <CopyToClipboard text={URL}>
        <button>Click to Copy URL</button>
      </CopyToClipboard>
    );
  };

  render() {
    if (this.state.isError) {
      return <p>Error editing applicant</p>
    }

    return (
      <div className="Applicant">
        <div className="padding" style={{ color: "green" }}>
          <strong>{this.completionHandler()}</strong>
        </div>
        <div className="name">
          {this.state.isEditing ? (
            <div>
              <input
                type="text"
                defaultValue={this.props.applicant.lastName}
                ref="editLName"
              />
              <br />
            </div>
          ) : (
            this.props.applicant.lastName
          )},
          {this.state.isEditing ? (
            <input
              type="text"
              defaultValue={this.props.applicant.firstName}
              ref="editFName"
            />
          ) : (
            " " + this.props.applicant.firstName
          )}
        </div>
        <div className="align">
          <div className="email">
            <p>{this.props.applicant.email}</p>
          </div>
          <div className="padding">
            {!this.props.applicant.completed ? this.copyURLHandler() : null}
          </div>
          {/* <div>{this.props.applicant.completed ?<strong><a style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}} onClick={this.props.results}>VIEW</a></strong>: null}</div> */}
          <div className="padding">{this.viewApplicantResults()}</div>
          <div className="padding">
            <ActionButtons
              isEditing={this.state.isEditing}
              onSaveClick={this.onSaveClick.bind(this)}
              onCancel={this.onCancelClick.bind(this)}
              editHandler={this.editHandler.bind(this)}
              deleteHandler={this.props.delete}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default IndividualApplicant;
