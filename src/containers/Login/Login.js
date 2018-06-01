import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: ""
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token === null) {
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        fetch("https://decisiontime.herokuapp.com/api/company/auth", options)
        .then(res =>
            res.status === 403 ?
                Promise.reject(new Error("Auth denied")) :
                res.json()
        ).then(data => {
            this.props.history.push("/company");
        }).catch(err => console.error(err));
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

        fetch(`https://decisiontime.herokuapp.com/api/company/login`, options)
        .then(res => res.status === 403 ?
            Promise.reject(new Error("403 access denied")) :
            res.json())
        .then(data => {
            localStorage.setItem("token", data.token);
            this.props.history.push("/company");
        }).catch(err => console.error(err));
    }


    render() {
        return (
            <div>
                <header>
                    <ul style={{listStyleType: 'none', display: 'flex'}}>
                        <h1><li><a style={{padding: '20px 40px 20px 40px', color: 'purple', border: 'solid green 5px', borderRadius: '10px', boxShadow: '4px 4px 2px 0px rgba(0,0,0,0.75)'}}>decisionTyme</a></li></h1>
                    </ul>
                </header>
                <form style={{backgroundColor: "#dedfe0", margin: "100px 350px 0px 350px", paddingBottom: "40px", paddingTop: "40px", boxShadow: '3px 3px 2px 0px rgba(0,0,0,0.33)'}}>
                    <h2>Company Login</h2>
                    <div style={{padding: "10px"}}>
                        <input
                            type="text"
                            placeholder="email..."
                            name="email"
                            onChange={this.handleInput} />
                    </div>
                    <div style={{padding: "10px"}}>
                        <input
                            type="password"
                            placeholder="password..."
                            name="password"
                            onChange={this.handleInput} />
                    </div>
                    <div>
                        <button onClick={this.handleSubmit}>Login</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;
