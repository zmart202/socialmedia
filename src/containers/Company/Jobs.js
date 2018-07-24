import React, { Component } from "react";
import _ from "lodash";
import { CopyToClipboard } from "react-copy-to-clipboard";

import CreateJob from "./CreateJob";
import EditJob from "./EditJob";
import DeleteJob from "./DeleteJob";
import TestEditor from "./TestEditor/TestEditor";
import Spinner from "../../components/UI/Spinner/Spinner";
import "./Jobs.css";

class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      companyId: "",
      companyName: "",
      jobs: [],
      viewingJobId: null,
      createJobMounted: false,
      editJobMounted: false
    };

    this.token = localStorage.getItem("token");

    this.setViewingJobId = this.setViewingJobId.bind(this);
    this.createJobInState = this.createJobInState.bind(this);
    this.editJobInState = this.editJobInState.bind(this);
    this.deleteJobInState = this.deleteJobInState.bind(this);
    this.createQuestionInState = this.createQuestionInState.bind(this);
    this.editQuestionInState = this.editQuestionInState.bind(this);
    this.deleteQuestionInState = this.deleteQuestionInState.bind(this);
    this.toggleCreateJob = this.toggleCreateJob.bind(this);
    this.toggleEditJob = this.toggleEditJob.bind(this);
    this.toggleDeleteJob = this.toggleDeleteJob.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.token === null) {
      return;
    }

    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };

    fetch("http://localhost:4567/api/job/jobs", options)
      .then(res => res.json())
      .then(data => {
        console.log("Data from jobs", data);
        if (!data.success) {
          return this.setState({
            isLoading: false,
            isError: true
          });
        }

        this.setState({
          isLoading: false,
          jobs: data.jobs,
          viewingJobId: data.jobs.length > 0 ? data.jobs[0].id : null,

          companyId: data.companyId,
          companyName: data.companyName
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          isLoading: false,
          isError: true
        });
      });
  }

  setViewingJobId(id) {
    this.setState({
      viewingJobId: id
    });
  }

  createJobInState(job) {
    this.setState(prevState => ({
      jobs: prevState.jobs.concat(job),
      viewingJobId: job.id
    }));
  }

  editJobInState(job) {
    this.setState(prevState => ({
      jobs: prevState.jobs.map(
        x =>
          x.id === job.id
            ? {
                ...x,
                title: job.title,
                description: job.description
              }
            : x
      )
    }));
  }

  deleteJobInState(id) {
    this.setState(prevState => {
      let newJobs = prevState.jobs.filter(x => x.id !== id);
      return {
        jobs: newJobs,
        viewingJobId: newJobs.length > 0 ? _.sample(newJobs).id : null
      };
    });
  }

  createQuestionInState(q) {
    this.setState(prevState => ({
      jobs: prevState.jobs.map(
        x =>
          x.id === this.state.viewingJobId
            ? {
                ...x,
                test: x.test.concat(q)
              }
            : x
      )
    }));
  }

  editQuestionInState(q) {
    this.setState(prevState => ({
      jobs: prevState.jobs.map(
        x =>
          x.id === this.state.viewingJobId
            ? {
                ...x,
                test: x.test.map(y => (y.id === q.id ? q : y))
              }
            : x
      )
    }));
  }

  deleteQuestionInState(id) {
    this.setState(prevState => ({
      jobs: prevState.jobs.map(
        x =>
          x.id === this.state.viewingJobId
            ? {
                ...x,
                test: x.test.filter(y => y.id !== id)
              }
            : x
      )
    }));
  }

  toggleCreateJob() {
    this.setState(prevState => ({
      createJobMounted: !prevState.createJobMounted
    }));
  }

  toggleEditJob() {
    this.setState(prevState => ({
      editJobMounted: !prevState.editJobMounted
    }));
  }

  toggleDeleteJob() {
    this.setState(prevState => ({
      deleteJobMounted: !prevState.deleteJobMounted
    }));
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
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
      return <p>Error loading Jobs</p>;
    }

    let navbar = "";
    if (this.state.jobs.length > 0) {
      navbar = this.state.jobs.map(x => {
        const style =
          x.id === this.state.viewingJobId
            ? {
                cursor: "pointer",
                color: "green",
                backgroundColor: "#def9c0",
                paddingLeft: "10px"
              }
            : {
                cursor: "pointer"
              };

        return (
          <div
            key={x.id}
            className="jobs"
            style={style}
            onClick={() => this.setViewingJobId(x.id)}
          >
            {x.title}
            <button
              style={{ float: "right" }}
              type="button"
              onClick={this.toggleEditJob}
            >
              Edit
            </button>
          </div>
        );
      });
    } else {
      navbar = <p>No jobs yet</p>;
    }

    let createJobBtn = "";
    let createJob = "";
    if (this.state.createJobMounted) {
      createJob = (
        <CreateJob
          toggleCreateJob={this.toggleCreateJob}
          createJobInState={this.createJobInState}
          id={this.state.viewingJobId}
          token={this.token}
        />
      );
    } else {
      createJobBtn = (
        <div>
          <button type="button" onClick={this.toggleCreateJob}>
            Add New Job
          </button>
        </div>
      );
    }
    
    let editJob = "";
    if (this.state.editJobMounted) {
      editJob = (
        <EditJob
          toggleEditJob={this.toggleEditJob}
          editJobInState={this.editJobInState}
          job={this.state.jobs.find(x => x.id === this.state.viewingJobId)}
          id={this.state.viewingJobId}
          token={this.token}
        />
      );
    }

    let testEditor = "";
    testEditor = (
      <TestEditor
        token={this.token}
        job={this.state.jobs.find(x => x.id === this.state.viewingJobId)}
        createQuestionInState={this.createQuestionInState}
        editQuestionInState={this.editQuestionInState}
        deleteQuestionInState={this.deleteQuestionInState}
      />
    );

    let deleteJob = "";
    let deleteJobBtn = "";
    if (this.state.deleteJobMounted) {
      deleteJob = (
        <DeleteJob
          id={this.state.viewingJobId}
          title={
            this.state.jobs.find(x => x.id === this.state.viewingJobId).title
          }
          token={this.token}
          toggleDeleteJob={this.toggleDeleteJob}
          deleteJobInState={this.deleteJobInState}
        />
      );
    } else {
      deleteJobBtn = (
        <button type="button" onClick={this.toggleDeleteJob}>
          Delete Job
        </button>
      );
    }

    let description = "";
    let copyLinkBtn = "";
    if (
      this.state.viewingJobId &&
      !this.state.editJobMounted &&
      !this.state.createJobMounted &&
      !this.state.testEditorMounted
    ) {
      description = this.state.jobs.find(x => x.id === this.state.viewingJobId).description;

      let url = `http://localhost:3000/job-description/${
        this.state.companyId
      }/${this.state.viewingJobId}`;
      copyLinkBtn = (
        <CopyToClipboard text={url}>
          <button type="button">Copy Link to Application</button>
        </CopyToClipboard>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="column1">
            <h3>List of Jobs</h3>
            {createJobBtn}
            <div className="jobnavbar">{navbar}</div>
          </div>
          <div className="column2">
            <div className="joblink">
              {copyLinkBtn} | {deleteJobBtn}
            </div>
            <div className="jobdescription">
              {createJob}
              <h5 style={{ textDecoration: "underline" }}>Job Description</h5>
              <p>
                <em>{description}</em>
              </p>
            </div>
            {editJob}
            <div />
            {deleteJob}
            {testEditor}
          </div>
        </div>
      </div>
    );
  }
}

export default Jobs;
