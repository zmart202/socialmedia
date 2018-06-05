import React, { Component } from 'react';
//import _ from 'lodash';
import Aux from '../../hoc/Aux/Aux';
import NewApplicant from './NewApplicant';
import ApplicantList from './ApplicantList';

class Company extends Component{
  constructor(props){
      super(props);
      this.state = {
          isLoading: true,
          applicants: [],
        //  viewing: false,
          viewableApplicant: null,
          search: ""
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

        fetch("http://localhost:4567/api/company/applicants", options)
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

        fetch("http://localhost:4567/api/company/remove-applicant", options)
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

        fetch("http://localhost:4567/api/company/create-applicant", options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            this.refreshApplicantList();
        }).catch(err => console.error(err));
    }

    logOut = () => {
        localStorage.removeItem("token");
        this.props.history.push("/");
    }

    // viewHandler = (applicant) => {
    //     this.setState({viewing: true});
    //     this.setState({viewableApplicant: applicant});
    //     return this.state.viewableApplicant
    // }

    viewCancelHandler = () => {
        this.setState({viewing: false});
    }

    updateSearch = (event) => {
        this.setState({search: event.target.value.substr(0, 20)});
    }

    render() {
        if (this.state.isLoading) {
            return <p>Loading...</p>;
        }

        // let modal = "";
        // if (this.state.viewing) {
        //     modal = (
        //       <Modal show={this.state.viewing} modalClosed={this.viewCancelHandler}>
        //           <FinalResults
        //               applicant={this.state.viewableApplicant}
        //               modalClosed={this.viewCancelHandler} />
        //       </Modal>
        //     );
        // }

        return(
            <Aux>
                    <header style={{textAlign: 'right', padding: '0px 40px 20px 40px', color: 'purple', cursor: 'pointer', marginTop: '15px'}}><a onClick={this.logOut}>Logout</a></header>
                {/* {modal} */}
                <div style={{backgroundColor: '#d8d8d8', margin: '0px 0px 0px 0px', padding: '20px 0px', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                    <h1 style={{color: 'purple'}}>All Potential Applicants</h1>
                    <h4 style={{color: 'purple'}}>Create New Applicant</h4>
                    <NewApplicant createApplicant={this.createApplicant.bind(this)} />
                    <div style={{borderTopStyle: 'solid', margin: '20px 60px', borderColor: 'purple'}}>
                    <h4 style={{color: 'purple'}}>Search Bar</h4>
                    <input
                        type="text"
                        style={{padding: '10px'}}
                        value={this.state.search}
                        onChange={this.updateSearch.bind(this)}
                        placeholder="Search by last name.." />
                    </div>
                    <div style={{width:'1100px', margin:'0 auto'}}>
                    <ApplicantList
                        applicants={this.state.applicants}
                        deleteApplicantsHandler={this.deleteApplicantsHandler.bind(this)}
                        refreshApplicantList={this.refreshApplicantList.bind(this)}
                        //viewable={this.viewHandler.bind(this)}
                        searchedApplicant={this.state.search} />
                    </div>
                </div>
            </Aux>
        );
    }
}

export default Company;
