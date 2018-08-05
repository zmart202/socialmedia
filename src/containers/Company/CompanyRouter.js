import React, { Component } from "react";
import { Router } from "react-router";
import { Route } from "react-router-dom";

import CompanyLogin from "./CompanyLogin/CompanyLogin";
import Company from "./CompanyIndex/Company";
import CompanyNav from "./CompanyNav/CompanyNav";
import Jobs from "./Jobs";
import Messaging from "./Messaging/Messaging";
import ApplicantProfile from "./ApplicantProfile/ApplicantProfile";

import Navbar from "../.././components/UI/layout/Navbar";

class CompanyRouter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: localStorage.getItem("isLoggedIn")
		};
	}

	login = () => {
		this.setState({ isLoggedIn: "true" });
		localStorage.setItem("isLoggedIn", "true");
	};

	logout = () => {
		this.setState({ isLoggedIn: "false" });
		localStorage.removeItem("token");
		localStorage.setItem("isLoggedIn", "false");
	};

	render() {
		const { history } = this.props;
		const { isLoggedIn } = this.state;

		return (
			<Router history={ history }>
				{
					isLoggedIn === "true" ?
						(
							<div>
								<Navbar history={ history } logout={ this.logout } />
								<CompanyNav />
								<Route exact path="/company" component={ Company } />
								<Route path="/company/jobs" component={ Jobs } />
								<Route path="/company/messaging" component={ Messaging } />
								<Route path="/company/applicant/:applicantId" component={ ApplicantProfile } />
							</div>
						) :
						(
							<div>
								<Route
									path="/company"
									render={ props => <CompanyLogin { ...props } login={ this.login } /> }
								/>
							</div>
						)
				}
			</Router>
		);
	}
}

export default CompanyRouter;
