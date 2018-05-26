import React from 'react';
import { Link } from 'react-router-dom';

const applicantLoginForm = (props) => {
    return (
        <div>
            <header style={{textAlign: 'right', padding: '20px', color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}><a onClick={props.loginChange}>Company Login</a></header>
            <form style={{backgroundColor: "#dedfe0", margin: "100px 350px 0px 350px", paddingBottom: "40px", paddingTop: "40px", boxShadow: '3px 3px 2px 0px rgba(0,0,0,0.33)'}}>
                <h4>Applicant Login</h4>
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
                        <Link from='/' to='/applicant' ><button>Login</button></Link>
                    </div>
                </form>
            </div>
    );
}

export default applicantLoginForm;