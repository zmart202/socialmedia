import React, { Component } from "react";

import Spinner from "../../components/UI/Spinner/Spinner";
import TextFieldGroup from "../../components/UI/Form/TextFieldGroup";

class DeleteJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      errorMsg: "",
      titleConfirmation: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    if (this.state.titleConfirmation !== this.props.title) {
      return this.setState({
        errorMsg: "Title you entered does not match"
      });
    }

    const options = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        id: this.props.id
      })
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("http://localhost:4567/api/job/delete-job", options)
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              console.log(data);
              return this.setState({
                isError: true,
                isLoading: false
              });
            }
            console.log(data);
            this.setState(
              {
                isLoading: false
              },
              () => {
                this.props.deleteJobInState(this.props.id);
                this.props.toggleDeleteJob();
              }
            );
          })
          .catch(err => {
            console.error(err);
            this.setState({
              isLoading: false,
              isError: true
            });
          });
      }
    );
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>Error deleting job</p>;
    }

    return (
      <div>
        <label htmlFor="titleConfirmation">
          Enter The Highlighted Job Title:
        </label>
        <TextFieldGroup
          type="text"
          name="titleConfirmation"
          placeholder="Place job title you wish to delete here"
          onChange={this.handleChange}
          info="* There is no undoing deleting a job position"
        />
        <button
          style={{ color: "purple" }}
          className="btn btn-light"
          type="button"
          onClick={this.handleSubmit}
        >
          <i className="fas fa-trash-alt text-success mr-1" />
          Delete
        </button>
        <button
          style={{ color: "purple" }}
          className="btn btn-light"
          type="button"
          onClick={this.props.toggleDeleteJob}
        >
          <i className="fas fa-ban text-success mr-1" />
          Cancel
        </button>
        {this.state.errorMsg}
      </div>
    );
  }
}

export default DeleteJob;
