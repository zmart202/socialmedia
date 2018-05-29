import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './containers/Login/Login'
import './App.css';
import Company from './containers/Company/Company';
import CompanyLogin from './containers/CompanyLogin/CompanyLogin';
import Applicant from './containers/Applicant/Applicant';
import Finished from './containers/Applicant/Finished/Finished';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" exact component={CompanyLogin} />
        <Route path="/applicant/:token" component={Applicant} />
        <Route path="/company" component={Company} />
        <Route path='/finished' component={Finished}  />
      </div>
    );
  }
}

export default App;
