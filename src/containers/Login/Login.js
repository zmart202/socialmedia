import React, { Component } from 'react';
import './Login.css';
import ApplicantLoginForm from './ApplicantLoginForm/ApplicantLoginForm';
import CompanyLoginForm from './CompanyLoginForm/CompanyLoginForm';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            ApplicantLogin: true
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const options = {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        };

        fetch("http://localhost:4567/login/company", options)
        .then(res => res.status === 403 ?
            Promise.reject(new Error("403 access denied")) :
            res.json())
        .then(data => {
            localStorage.setItem("token", data.token);
            this.props.history.push("/company");
        }).catch(err => console.error(err));
    }

    switchLoginPage = () => {
        let loginPage = this.state.ApplicantLogin;
        this.setState({ApplicantLogin: !loginPage});
    }

    render() {
        let applicantLogin = <ApplicantLoginForm loginChange={this.switchLoginPage} />;
        let companyLogin = <CompanyLoginForm loginChange={this.switchLoginPage} />;
        let renderLogin = this.state.ApplicantLogin ? applicantLogin : companyLogin;
        return (
            <div>
                {renderLogin}
            </div>
        );
    }
}

export default Login;
