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

class CompanyRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem("isLoggedIn")
    };
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    if (document.getElementById("driftScript") === null) {
      let script = document.createElement("script");
      script.setAttribute("id", "driftScript");
      script.innerHTML = `
			"use strict";
	
			!function () {
				var t = window.driftt = window.drift = window.driftt || [];
				if (!t.init) {
					if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
					t.invoked = !0, t.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"],
						t.factory = function (e) {
							return function () {
								var n = Array.prototype.slice.call(arguments);
								return n.unshift(e), t.push(n), t;
							};
						}, t.methods.forEach(function (e) {
							t[e] = t.factory(e);
						}), t.load = function (t) {
							var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
							o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
							var i = document.getElementsByTagName("script")[0];
							i.parentNode.insertBefore(o, i);
						};
				}
			}();
			drift.SNIPPET_VERSION = '0.3.1';
			drift.load('9a2y3y5zxw2r');`;

      document.head.appendChild(script);
    }
  }

  login() {
    this.setState({ isLoggedIn: "true" });
    localStorage.setItem("isLoggedIn", "true");
  }

  logout = () => {
    this.setState({ isLoggedIn: "false" });
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
  };

  render() {
    const { history } = this.props;
    const { isLoggedIn } = this.state;

    return (
      <Router history={history}>
        {isLoggedIn === "true" ? (
          <div>
            <Navbar history={history} logout={this.logout} />
            <CompanyNav />
            <Route exact path="/company" component={Company} />
            <Route path="/company/jobs" component={Jobs} />
            <Route path="/company/messaging" component={Messaging} />
            <Route
              path="/company/results/:ApplicantId"
              component={FinalResults}
            />
            <Route
              path="/company/application/:ApplicantId"
              component={SubmittedApplication}
            />
          </div>
        ) : (
          <div>
            <Route
              path="/company"
              render={props => <CompanyLogin {...props} login={this.login} />}
            />
          </div>
        )}
      </Router>
    );
  }
}

export default CompanyRouter;
