import React from 'react';
import { Link } from 'react-router-dom';


const companyLoginForm = (props) => {
    return (
        <div>
            <header>
                <ul style={{textAlign: 'right', listStyleType: 'none'}}>
                    <li><a style={{padding: '20px 40px 20px 40px', color: 'blue', cursor: 'pointer'}} onClick={props.loginChange}>Applicant Login</a></li>
                </ul>
                <ul style={{listStyleType: 'none', display: 'flex'}}>
                    <h1><li><a style={{padding: '20px 40px 20px 40px', color: 'purple',border: 'solid green 5px', borderRadius: '10px', boxShadow: '4px 4px 2px 0px rgba(0,0,0,0.75)'}}>decisionTyme</a></li></h1>
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
                    <Link from='/' to='/company' ><button>Login</button></Link>
                </div>
            </form>
        </div>
    );
}

export default companyLoginForm;