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

    render() {
        return (
            <div>
<<<<<<< HEAD
                <form style={{backgroundColor: "#dedfe0", margin: "100px 350px 0px 350px", paddingBottom: "40px", paddingTop: "40px", boxShadow: '3px 3px 2px 0px rgba(0,0,0,0.33)'}}>
=======
                <form
                    onSubmit={this.handleSubmit}
                    style={{backgroundColor: "gray", margin: "100px 350px 0px 350px", paddingBottom: "40px", paddingTop: "40px"}}>
>>>>>>> d1e5c78d6b75137b473dabe0fef1e057fb11fa99
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
                        <Link from='/' to='/company' ><button>Login</button></Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;
