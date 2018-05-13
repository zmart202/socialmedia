import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './containers/Login/Login'
import './App.css';
import Company from './containers/Company/Company';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" exact component={Login} />
        <Route path="/company" component={Company} />      
      </div>
    );
  }
}

export default App;
