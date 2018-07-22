import React, { Component } from "react";

import Spinner from "../../../components/UI/Spinner/Spinner";
import "./JobDescript.css";

class JobDescript extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      companyName: "",
      title: "",
      description: ""
    };

    this.companyId = props.match.params.companyId;
    this.jobId = props.match.params.jobId;

    this.routeToApplication = this.routeToApplication.bind(this);
  }

  componentDidMount() {
    if (!this.companyId || !this.jobId) {
      return this.setState({
        isLoading: false,
        isError: true
      });
    }

    fetch(`http://localhost:4567/api/job/job/${this.companyId}/${this.jobId}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          return this.setState({
            isLoading: false,
            isError: true
          });
        }

        this.setState({
          isLoading: false,
          companyName: data.job.companyName,
          title: data.job.title,
          description: data.job.description
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

  routeToApplication() {
    this.props.history.push(`/application/${this.companyId}/${this.jobId}`);
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return (
        <p>Error: could not fetch Job Description. URL may be malformed</p>
      );
    }

    return (
      <div className="jobdescript">
        <h1>{this.state.companyName}</h1>
        <p>
          Position being applied for - <strong>{this.state.title}</strong>
        </p>
        <h3>DESCRIPTION</h3>
        <p>{this.state.description}</p>
        <div style={{ padding: "10px" }}>
          <button
            type="button"
            className="jobdescriptbtn"
            onClick={this.routeToApplication}
          >
            Apply for this job
          </button>
        </div>
      </div>
    );
  }
}

export default JobDescript;
