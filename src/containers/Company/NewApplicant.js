import React, { Component } from 'react';

class NewApplicant extends Component{
    createHandler = (event) => {
        event.preventDefault();
        this.props.createApplicant(this.refs.createLName.value, this.refs.createFName.value, this.refs.createEmail.value);
        this.refs.createLName.value = '';
        this.refs.createFName.value = '';
        this.refs.createEmail.value = '';
    }
    render() {
        return(
            <form onSubmit={this.createHandler.bind(this)} >
                <input type="text" placeholder="Type last name here..." ref="createLName" />
                <input type="text" placeholder="Type first name here..." ref="createFName" />
                <input type="text" placeholder="Type email here..." ref="createEmail" />
                <button>Create</button>
            </form>
        );
    }
}

export default NewApplicant;