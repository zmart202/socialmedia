import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './containers/Login/Login'
import './App.css';
import Company from './containers/Company/Company';
import Applicant from './containers/Applicant/Applicant';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" exact component={Login} />
        <Route path="/company" component={Company} />
        <Route path="/applicant" component={Applicant} />      
      </div>
    );
  }
}

export default App;
