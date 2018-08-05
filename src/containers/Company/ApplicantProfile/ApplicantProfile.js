import React, { Component } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import FinalResults from "./FinalResults/FinalResults";
import SubmittedApplication from "./SubmittedApplication/SubmittedApplication";
import ApplicantProfileHeader from "./ApplicantProfileHeader";

import Spinner from "../../../components/UI/Spinner/Spinner";

import "./ApplicantProfile.css";

class ApplicantProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			isError: false,
			errorMsg: "",
			applicant: {},
			job: {},
			pageChoice: "application"
		};

		this.token = localStorage.getItem("token");
		this.applicantId = props.match.params.applicantId;
	}

	componentDidMount() {
		const options = {
			headers: {
				"Authorization": `Bearer ${this.token}`
			}
		};

		fetch(
			`http://localhost:4567/api/company/applicant-profile/${this.applicantId}`,
			options
		).then(res => res.json())
		.then(data => {
			console.log("DATA FROM APPLICANT PROFILE", data);
			if (!data.success) {
				return this.setState({
					isError: true,
					errorMsg: data.msg
				});
			}

			this.setState({
				isLoading: false,
				applicant: data.applicant,
				job: data.job
			});
		}).catch(err => {
			console.error(err);
			this.setState({
				isError: true,
				errorMsg: err.message
			});
		});
	}

	changePage = pageChoice =>
		this.setState({ pageChoice });

	renderPageChoice = choice =>
		choice === "application" ?
			<SubmittedApplication
				applicant={this.state.applicant}
				job={this.state.job}
			/> : <FinalResults
				applicantId={this.applicantId}
			/>;

	createUrlCopier = () => {
		let { applicant, job } = this.state;
    let URL =
			"http://localhost:3000/applicant/" +
			encodeURIComponent(applicant.companyName) + "/" +
			encodeURIComponent(job.title) + "/" +
			applicant.id;

    return (
      <CopyToClipboard text={URL}>
        <button>Click to Copy URL</button>
      </CopyToClipboard>
    );
  };

	render() {
		const {
			isError,
			errorMsg,
			isLoading,
			applicant,
			pageChoice
		} = this.state;

		if (isError) {
			return <p>{errorMsg}</p>
		}

		if (isLoading) {
			return <Spinner />;
		}

		return (
			<div>
				<div className="profilenav">
          <ApplicantProfileHeader
          	applicantId={this.applicantId}
          	changePage={this.changePage}
          />
        </div>
				{
					applicant.completed ?
						"" : this.createUrlCopier()
				}
				{this.renderPageChoice(pageChoice)}
			</div>
		);
	}
}

export default ApplicantProfile;
