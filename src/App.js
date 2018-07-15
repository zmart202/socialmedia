import React, { Component } from "react";
import { Route } from "react-router-dom";
import Login from "./containers/Login/Login";
import "./App.css";
import Company from "./containers/Company/CompanyIndex/Company";
import Applicant from "./containers/Applicant/Applicant";
import TestFinished from "./containers/Applicant/TestFinished/TestFinished";
import FinalResults from "./containers/Company/FinalResults/FinalResults";
import Jobs from "./containers/Company/Jobs";
import TestEditor from "./containers/Company/TestEditor/TestEditor";
import JobDescript from "./containers/Applicant/JobDescript/JobDescript";
import Application from "./containers/Applicant/Application/Application";
import SubmittedApplication from "./containers/Company/FinalResults/SubmittedApplication/SubmittedApplication";
import Navbar from "./components/UI/layout/Navbar";
// import Footer from "./components/UI/layout/Footer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Route path="/" exact component={Login} />
        <Route path="/applicant/:id" component={Applicant} />
        <Route path="/company" exact component={Company} />
        <Route path="/company/jobs" exact component={Jobs} />
        <Route path="/company/test-editor" exact component={TestEditor} />
        <Route path="/company/results/:ApplicantId" component={FinalResults} />
        <Route
          path="/company/application/:ApplicantId"
          component={SubmittedApplication}
        />
        <Route path="/test-finished" component={TestFinished} />
        <Route
          path="/job-description/:companyId/:jobId"
          component={JobDescript}
        />
        <Route path="/application/:companyId/:jobId" component={Application} />
        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;
