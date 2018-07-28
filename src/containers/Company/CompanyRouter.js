import React, { Component } from "react";
import { Router } from "react-router";
import { Route } from "react-router-dom";

import CompanyLogin from "./CompanyLogin/CompanyLogin";
import Company from "./CompanyIndex/Company";
import CompanyNav from "./CompanyNav/CompanyNav";
import Jobs from "./Jobs";
import Messaging from "./Messaging/Messaging";
import SubmittedApplication from "./FinalResults/SubmittedApplication/SubmittedApplication";
import FinalResults from "./FinalResults/FinalResults";

import Navbar from "../.././components/UI/layout/Navbar";
import Spinner from "../../components/UI/Spinner/Spinner";

class CompanyRouter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			isLoggedIn: false
		};

		this.token = localStorage.getItem("token");
	}

	componentDidMount() {
		if (this.token === null) {
			return this.setState({
				isLoading: false
			});
		}

		const options = {
			headers: {
				"Authorization": `Bearer ${this.token}`
			}
		};

		fetch("http://localhost:4567/api/company/auth", options)
		.then(res => res.json())
		.then(data => {
			console.log(data);
			this.setState({
				isLoading: false,
				isLoggedIn: true
			});
		}).catch(err => {
			console.error(err);
			this.setState({
				isLoading: false
			});
		});
	}

	login = () =>
		this.setState({ isLoggedIn: true });

	logout = () => {
		localStorage.removeItem("token");
		this.setState({ isLoggedIn: false });
	};

	render() {
		const { isLoading, isLoggedIn } = this.state;
		const { history } = this.props;

		if (isLoading) {
			return <Spinner />;
		}

		return (
			<Router history={ history }>
				{
					isLoggedIn ?
						(
							<div>
								<Navbar history={ history } logout={ this.logout } />
								<CompanyNav />
								<Route exact path="/company" component={ Company } />
								<Route path="/company/jobs" component={ Jobs } />
								<Route path="/company/messaging" component={ Messaging } />
								<Route path="/company/results/:ApplicantId" component={ FinalResults } />
								<Route
				          path="/company/application/:ApplicantId"
				          component={SubmittedApplication}
				        />
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