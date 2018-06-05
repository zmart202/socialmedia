import React, { Component } from 'react';

class NewApplicant extends Component {
    constructor () {
        super();
        this.createHandler = this.createHandler.bind(this);
    }
    createHandler = (event) => {
        event.preventDefault();
        this.props.createApplicant(this.refs.createLName.value, this.refs.createFName.value, this.refs.createEmail.value);
        this.refs.createLName.value = '';
        this.refs.createFName.value = '';
        this.refs.createEmail.value = '';
    }

    render() {
        return(
            <form>
                <input style={{margin: '5px', padding: '10px'}} type="text" placeholder="Type first name here..." ref="createFName" />
                <input style={{margin: '5px', padding: '10px'}} type="text" placeholder="Type last name here..." ref="createLName" />
                <input style={{margin: '5px', padding: '10px'}} type="text" placeholder="Type email here..." ref="createEmail" />
                <a onClick={this.createHandler} style={{ backgroundColor: 'purple', textDecoration: 'none', color: 'white', padding: '5px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', marginLeft: '3px', fontSize: '10px'}}>Create</a>
            </form>
        );
    }
}

export default NewApplicant;
