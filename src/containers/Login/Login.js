import React, { Component } from 'react';
import './Login.css';

class Login extends Component {
    render (){
        return (
            <div>
                <form style={{backgroundColor: "gray", margin: "100px 350px 0px 350px", paddingBottom: "40px", paddingTop: "40px"}}>
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
                        <button>Login</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;