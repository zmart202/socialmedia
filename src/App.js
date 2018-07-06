import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './containers/Login/Login'
import './App.css';
import Company from './containers/Company/Company';
import Applicant from './containers/Applicant/Applicant';
import Finished from './containers/Applicant/Finished/Finished';
import FinalResults from './containers/Company/FinalResults/FinalResults';
import Jobs from './containers/Company/Jobs';
import TestEditor from './containers/Company/TestEditor/TestEditor';
import JobDescript from './containers/Applicant/JobDescript/JobDescript';
import ApplicantSignup from './containers/Applicant/ApplicantSignup/ApplicantSignup';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" exact component={Login} />
        <Route path="/applicant/:id" component={Applicant} />
        <Route path="/company" exact component={Company} />
        <Route path="/company/jobs" exact component={Jobs} />
        <Route path="/company/test-editor" exact component={TestEditor} />
        <Route path="/company/results/:ApplicantId" component={FinalResults} />
        <Route path='/finished' component={Finished}  />
        <Route path='/job-description' component={JobDescript} />
        <Route path='/app-form/:companyId/:jobId' component={ApplicantSignup} />
      </div>
    );
  }
}

export default App;
