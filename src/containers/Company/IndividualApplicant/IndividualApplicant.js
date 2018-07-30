import React, { Component } from "react";
import "./IndividualApplicant.css";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ActionButtons from "../../../components/UI/Buttons/ActionButtons";
import Spinner from "../../../components/UI/Spinner/Spinner";

class IndividualApplicant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      errorMsg: "",
      isEditing: false
    };

    this.token = localStorage.getItem("token");
  }

  editHandler = () => this.setState({ isEditing: true });

  onCancelClick = () => this.setState({ isEditing: false });

  onSaveClick = event => {
    event.preventDefault();

    let applicant = {
      id: this.props.applicant.id,
      firstName: this.refs.editFName.value,
      lastName: this.refs.editLName.value
    };

    if (
      this.refs.editFName.value === this.props.applicant.firstName &&
      this.refs.editLName.value === this.props.applicant.lastName
    ) {
      return this.setState({
        isEditing: false
      });
    }

    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(applicant)
    };

    this.setState({
      isLoading: true
    }, () => {
      fetch("http://localhost:4567/api/company/edit-applicant", options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          return this.setState({
            isLoading: false,
            isError: true,
            errorMsg: data.msg
          });
        }

        this.props.editApplicant(applicant);
        this.setState({
          isEditing: false,
          isLoading: false
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          isError: true,
          isLoading: false,
          errorMsg: err.message
        });
      });
    });
  };

  onDelete = e => {
    e.preventDefault();

    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: this.props.applicant.email,
        id: this.props.applicant.id
      })
    };

    this.setState({
      isLoading: true
    }, () => {
      fetch("http://localhost:4567/api/company/remove-applicant", options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          return this.setState({
            isLoading: false,
            isError: true,
            errorMsg: data.msg
          });
        }

        this.props.deleteApplicant(this.props.applicant);
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          isError: true,
          errorMsg: err.message
        });
        console.error(err)
      });
    });
  };

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
              <div style={{ paddingBottom: "25px" }}>VIEW</div>
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
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>{this.state.errorMsg}</p>;
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
            <div style={{ paddingBottom: "12px" }}>
              {" "}
              {this.props.applicant.firstName}
            </div>
          )}
        </div>
        <div className="align">
          <div className="email">
            <p>{this.props.applicant.email}</p>
          </div>
          <div className="padding">
            {!this.props.applicant.completed ? this.copyURLHandler() : null}
          </div>
          <div className="padding">{this.viewApplicantResults()}</div>
          <div className="padding">
            <ActionButtons
              isEditing={this.state.isEditing}
              onSaveClick={this.onSaveClick}
              onCancel={this.onCancelClick}
              editHandler={this.editHandler}
              deleteHandler={this.onDelete}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default IndividualApplicant;
