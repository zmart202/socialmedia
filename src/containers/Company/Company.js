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
            isAuth: false,
            applicants: [
                {
                    key: 0,
                    lname: "Martin",
                    fname: "Zachary",
                    email: "zmartin@umassd.edu",
                    password: "abcdefgh",
                    question1: 'caterers are our partners',
                    question2: 'customers come first',
                    secondsElapsed: 125,
                    completed: true
                },
                {
                    key: 1,
                    lname: "Gates",
                    fname: "Bill",
                    email: "bgates@umassd.edu",
                    password: "afjdkljd",
                    question1: 'we should confirm caterers info',
                    question2: 'make sure the customer is always happy',
                    secondsElapsed: 250,
                    completed: true
                }
            ],
            keyId: 2,
            viewing: false,
            viewableApplicant: {
                    key: 0,
                    lname: "Martin",
                    fname: "Zachary",
                    email: "zmartin@umassd.edu",
                    password: "abcdefgh",
                    question1: 'caterers are our partners',
                    question2: 'customers come first',
                    secondsElapsed: 125,
                    completed: false
            },
            search: ''
        };
    }

    componentDidMount() {
        if (localStorage.getItem("token") === null) {
            this.setState({ isLoading: false });
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        };

        fetch("http://localhost:4567/company", options)
        .then(res => {
            this.setState({ isLoading: false });
            if (res.status === 200) {
                this.setState({ isAuth: true });
            }
        }).catch(err => console.error(err));
    }

    deleteApplicantsHandler = (applicant) => {
        console.log(applicant)
        let array = [...this.state.applicants];
        let index = array.indexOf(applicant)
        array.splice(index, 1);
        this.setState({applicants: array});
    }

    generateKeyId = () => {
        let Id = this.state.keyId;
        Id += 1;
        this.setState({keyId: Id});
        return Id;
    }


    generatePasswordHandler = () => {
        var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    createApplicant = (lname, fname, email) => {
        this.state.applicants.unshift({
            key: this.generateKeyId(),
            lname,
            fname,
            email,
            password: this.generatePasswordHandler(),
            completed: false
        });
        this.setState({ applicants: this.state.applicants});
    }

    viewHandler = (applicant) => {
        this.setState({viewing: true});
        this.setState({viewableApplicant: applicant});
        return this.state.viewableApplicant
    }

    viewCancelHandler = () => {
        this.setState({viewing: false});
    }

    updateSearch = (event) => {
        this.setState({search: event.target.value.substr(0, 20)});
    }

    render() {
        return(
            <Aux>
                <header style={{textAlign: 'right', padding: '20px 40px 20px 40px', color: 'purple', cursor: 'pointer'}}><Link from='/company' to='/'>Logout</Link></header>
                <Modal show={this.state.viewing} modalClosed={this.viewCancelHandler}>
                    <FinalResults 
                        applicant={this.state.viewableApplicant} 
                        modalClosed={this.viewCancelHandler} />
                </Modal>
                <div style={{backgroundColor: '#d8d8d8', margin: '100px 210px 0px 210px', padding: '20px 0px', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                    <h1 style={{color: 'purple'}}>All Potential Applicants</h1>
                    <h4 style={{color: 'purple'}}>Create New Applicant</h4>
                    <NewApplicant createApplicant={this.createApplicant.bind(this)} />
                    <div style={{borderTopStyle: 'solid', margin: '20px 60px', borderColor: 'purple'}}>
                    <h4 style={{color: 'purple'}}>Search Bar</h4>
                    <input type="text"
                        value={this.state.search}
                        onChange={this.updateSearch.bind(this)}
                        placeholder="Search by last name.." />
                    </div>
                    <ApplicantList 
                        applicants={this.state.applicants}
                        deleteApplicantsHandler={this.deleteApplicantsHandler.bind(this)}
                        viewable={this.viewHandler.bind(this)}
                        searchedApplicant={this.state.search} />
                </div>
            </Aux>
        );
    }
}

export default Company;
