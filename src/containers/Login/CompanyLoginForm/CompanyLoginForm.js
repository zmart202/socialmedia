import React from 'react';
import { Link } from 'react-router-dom';
import './CompanyLoginForm.css'


const companyLoginForm = (props) => {
    return (
        <div>
            <header>
                <ul style={{textAlign: 'right', listStyleType: 'none'}}>
                    <li><a style={{padding: '20px 40px 20px 40px', color: 'purple', cursor: 'pointer', textDecoration: 'underline'}} onClick={props.loginChange}>Applicant Login</a></li>
                </ul>
                <ul style={{listStyleType: 'none', display: 'flex'}}>
                    <h1><li><a style={{color: 'purple'}}>decision<span style={{backgroundColor: 'purple', padding: '10px', color: 'white', border: 'solid purple 2px', borderRadius: '25px'}}>T</span>yme</a></li></h1>
                </ul>
            </header>
            <form className="Login" style={{backgroundColor: "#dedfe0", margin: "100px 350px 0px 350px", paddingBottom: "40px", paddingTop: "40px", boxShadow: '3px 3px 2px 0px rgba(0,0,0,0.33)'}}>
            <h2 style={{color: 'purple'}}>Company Login</h2>
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
                <div style={{marginTop: '5px'}}>
                    <Link from='/' to='/company' ><a style={{backgroundColor: 'purple', color: 'white', padding: '10px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>Login</a></Link>
                </div>
            </form>
        </div>
    );
}

export default companyLoginForm;