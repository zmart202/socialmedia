import React, { Component } from "react";
import hat from "hat";

import Spinner from "../../components/UI/Spinner/Spinner";
import TextAreaFieldGroup from "../../components/UI/Form/TextAreaFieldGroup";
import TextFieldGroup from "../../components/UI/Form/TextFieldGroup";

class CreateJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      title: "",
      description: "",
      content: "Type description here..."
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = hat();
    const job = {
      id,
      ...this.state,
      test: []
    };

    const options = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(job)
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("http://localhost:4567/api/job/create-job", options)
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
                this.props.createJobInState(job);
                this.props.toggleCreateJob();
              }
            );
          })
          .catch(err => {
            console.error(err);
            this.setState({
              isError: true,
              isLoading: false
            });
          });
      }
    );
  }

  onBlur(evt) {
    console.log("onBlur event called with event info: ", evt);
  }

  afterPaste(evt) {
    console.log("afterPaste event called with event info: ", evt);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }

    if (this.state.isError) {
      return (
        <div>
          <p>Error creating Job</p>
        </div>
      );
    }

    return (
      <div>
        <div>
          <TextFieldGroup
            type="text"
            name="title"
            onChange={this.handleChange}
            info="What is the title of the position?"
          />
        </div>
        <div>
          <TextAreaFieldGroup
            name="description"
            onChange={this.handleChange}
            info="What are the specifics of the job (ex. Description, Requirements, Benefits, etc)"
          />
        </div>
        <button
          style={{ color: "purple" }}
          className="btn btn-light"
          onClick={this.handleSubmit}
        >
          <i className="fas fa-check text-success mr-1" />
          Save
        </button>
        <button
          style={{ color: "purple" }}
          className="btn btn-light"
          type="button"
          onClick={this.props.toggleCreateJob}
        >
          <i className="fas fa-ban text-success mr-1" />
          Cancel
        </button>
      </div>
    );
  }
}

export default CreateJob;
