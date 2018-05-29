import React, { Component } from 'react';
//import _ from 'lodash';
import Aux from '../../hoc/Aux/Aux';
import NewApplicant from './NewApplicant';
import ApplicantList from './ApplicantList';
import Modal from '../../components/UI/Modal/Modal';
import FinalResults from '../Applicant/FinalResults/FinalResults';
import { Link } from 'react-router-dom';

class Company extends Component{
  constructor(props){
      super(props);
      this.state = {
          isLoading: true,
          applicants: [],
          viewing: false,
          viewableApplicant: null
      };
  }

    componentDidMount() {
        this.refreshApplicantList();
    }

    refreshApplicantList = () => {
        const token = localStorage.getItem("token");
        if (token === null) {
            this.props.history.push("/company-login");
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        fetch("http://localhost:4567/company/applicants", options)
        .then(res =>
            res.status === 200 ?
                res.json() :
                Promise.reject("Auth denied")
        ).then(data => {
            this.setState({
                isLoading: false,
                applicants: data,
                viewableApplicant: data[0]
            })
        }).catch(err => console.error(err));
    }

    deleteApplicantsHandler = (applicant) => {
        const token = localStorage.getItem("token");
        if (token === null) {
            this.props.history.push("/company-login");
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email: applicant.email,
                id: applicant.id
            })
        };

        fetch("http://localhost:4567/company/remove-applicant", options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            this.refreshApplicantList();
        }).catch(err => console.error(err));
    }

    generateKeyId = () => {
        let Id = this.state.keyId;
        Id += 1;
        this.setState({keyId: Id});
        return Id;
    }


    generateTokenHandler = () => {
        var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    createApplicant = (lname, fname, email) => {
        const token = localStorage.getItem("token");
        if (token === null) {
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email,
                firstName: fname,
                lastName: lname,
                token: this.generateTokenHandler()
            })
        };

        fetch("http://localhost:4567/company/create-applicant", options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            this.refreshApplicantList();
        }).catch(err => console.error(err));
    }

    viewHandler = (applicant) => {
        this.setState({viewing: true});
        this.setState({viewableApplicant: applicant});
        return this.state.viewableApplicant
    }

    viewCancelHandler = () => {
        this.setState({viewing: false});
    }

    logOut = () => {
        localStorage.removeItem("token");
        this.props.history.push("/company-login");
    }

    render() {
        if (this.state.isLoading) {
            return (
                <p>Loading...</p>
            );
        }

        let modal = "";
        if (this.state.viewing) {
            modal = (
              <Modal show={this.state.viewing} modalClosed={this.viewCancelHandler}>
                  <FinalResults
                      applicant={this.state.viewableApplicant}
                      modalClosed={this.viewCancelHandler} />
              </Modal>
            );
        }

        return (
          <Aux>
              <header style={{textAlign: 'right', padding: '20px 40px 20px 40px', color: 'blue', cursor: 'pointer'}}><a onClick={this.logOut.bind(this)}>Logout</a></header>
              {modal}
              <div style={{backgroundColor: '#d8d8d8', margin: '100px 200px 0px 200px', padding: '20px 0px', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                  <h1>All Potential Applicants</h1>
                  <NewApplicant createApplicant={this.createApplicant.bind(this)} />
                  <ApplicantList
                      applicants={this.state.applicants}
                      deleteApplicantsHandler={this.deleteApplicantsHandler.bind(this)}
                      viewable={this.viewHandler.bind(this)}
                      refreshApplicantList={this.refreshApplicantList.bind(this)} />
              </div>
          </Aux>
        );
    }
}

export default Company;
