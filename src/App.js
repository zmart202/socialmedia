import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './containers/Login/Login'
import './App.css';
import Company from './containers/Company/Company';
import Applicant from './containers/Applicant/Applicant';
import Finished from './containers/Applicant/Finished/Finished';
import FinalResults from './containers/Company/FinalResults/FinalResults';
import Questionaire from './containers/Company/Questionaire/Questionaire';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" exact component={Login} />
        <Route path="/applicant/:token" component={Applicant} />
        <Route path="/company" exact component={Company} />
        <Route path="/company/:ApplicantId" component={FinalResults} />
        <Route path='/finished' component={Finished}  />
        <Route path='/questionaire' component={Questionaire} />
      </div>
    );
  }
}

export default App;
