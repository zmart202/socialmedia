import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

class Login extends Component {
    render (){
        return (
            <div>
                <form style={{backgroundColor: "#dedfe0", margin: "100px 350px 0px 350px", paddingBottom: "40px", paddingTop: "40px", boxShadow: '3px 3px 2px 0px rgba(0,0,0,0.33)'}}>
                    <div style={{padding: "10px"}}>
                        <input 
                            type="text"
                            placeholder="email..." />
                    </div>
                    <div style={{padding: "10px"}}>
                        <input 
                            type="password"
                            placeholder="password..." />
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