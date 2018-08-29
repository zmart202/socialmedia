import React, { Component } from "react";

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
			isEmailing: false,
			emailSuccess: false,
			emailError: false,
			applicant: {},
			pageChoice: "application"
		};

		this.token = localStorage.getItem("token");
		this.applicantId = props.match.params.applicantId
	}

	componentDidMount() {
		const options = {
			headers: {
				"Authorization": `Bearer ${this.token}`
			}
		};

		fetch(
			`/api/company/applicant/${this.applicantId}`,
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
				applicant: data.applicant
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
			/> : <FinalResults
				applicant={this.state.applicant}
			/>;

	sendEmailReminder = () => {
		this.setState({
			isEmailing: true
		}, () => {
			const options = {
				headers: {
					"Authorization": `Bearer ${this.token}`,
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify({
					applicantId: this.state.applicant.id
				})
			};

			fetch("/api/company/email-reminder", options)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (!data.success) {
					return this.setState({
						emailError: true,
						isEmailing: false
					});
				}

				this.setState({
					emailSuccess: true,
					isEmailing: false
				});
			})
			.catch(err => {
				console.error(err);
				this.setState({
					emailError: true,
					isEmailing: false
				});
			});
		});
	};

	renderEmailBtn = () =>
		<button type="button"
			disabled={this.state.isEmailing}
			onClick={this.sendEmailReminder}
		>
			Send Email Reminder
		</button>;

  render() {
    const {
			isError,
			errorMsg,
			isLoading,
			applicant,
			pageChoice,
			emailSuccess,
			emailError
		} = this.state;

    if (isError) {
      return <p>{errorMsg}</p>;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <div>
        <div className="profilenav">
          <ApplicantProfileHeader changePage={this.changePage} />
        </div>
        {applicant.completed ? "" : this.renderEmailBtn()}
				{
					emailSuccess ? (
						<p style={{ color: 'green' }}>Email sent!</p>
					) : (
						emailError ? (
							<p style={{ color: 'red' }}>Failure: could not send email</p>
						) : ""
					)
				}
        {this.renderPageChoice(pageChoice)}
      </div>
    );
  }
}

export default ApplicantProfile;
