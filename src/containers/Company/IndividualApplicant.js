import React, { Component } from 'react';
//import Modal from '../../components/UI/Modal/Modal';
//import FinalResults from '../Applicant/FinalResults/FinalResults';
//import _ from 'lodash';


class IndividualApplicant extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false
        }
    }


    renderApplicantSection = () => {

        if (this.state.isEditing) {
            return (
                <form onSubmit={this.onSaveClick.bind(this)}>
                    <td><input type="text" defaultValue={this.props.applicant.lastName} ref="editLName" /></td>
                    <td><input type="text" defaultValue={this.props.applicant.firstName} ref="editFName" /></td>
                    <td><input type="text" defaultValue={this.props.applicant.email} ref="editEmail" /></td>
                </form>
            );
        } else {

        }
    }


    renderActionsSection = () => {
        if (this.state.isEditing) {
            return (
                <td>
                    <button onClick={this.onSaveClick.bind(this)}>SAVE</button>
                    <button onClick={this.onCancelClick.bind(this)}>CANCEL</button>
                </td>
            );
        }
        return (
            <td>
                <button onClick={this.editHandler.bind(this)}>EDIT</button>
                <button onClick={this.props.delete}>DELETE</button>
            </td>
        );
    }

    editHandler = () => {
        this.setState({ isEditing: true});
    }

    onCancelClick = () => {
        this.setState({isEditing: false});
    }

    onSaveClick(event) {
        event.preventDefault();

        const token = localStorage.getItem("token");
        if (token === null) {
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                id: this.props.applicant.id,
                firstName: this.refs.editFName.value,
                lastName: this.refs.editLName.value,
                email: this.refs.editEmail.value
            })
        };

        fetch("http://localhost:4567/company/edit-applicant", options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            this.props.refreshApplicantList();
            this.setState({ isEditing: false });
        }).catch(err => console.error(err));

        /*this.props.applicant.lname = this.refs.editLName.value;
        this.props.applicant.fname = this.refs.editFName.value;
        this.props.applicant.email = this.refs.editEmail.value;
        this.setState({isEditing: false});*/
    }

    completionHandler = () => {
        if (this.props.applicant.completed) {
            return <p style={{color: 'green'}}>COMPLETE</p>;
        } else {
            return <p style={{color: 'red'}}>INCOMPLETE</p>;
        }
    }

    resultsHandler = () => {
        this.props.viewable;
        this.props.results;
    }


    render() {
        return(
            <tr key={this.props.applicant.id} style={{fontSize: "11px"}}>
                    <td>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.lastName} ref="editLName" /> : this.props.applicant.lastName}</td>
                    <td>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.firstName} ref="editFName" /> : this.props.applicant.firstName}</td>
                    <td>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.email} ref="editEmail" /> : this.props.applicant.email}</td>
                    {/* {this.renderApplicantSection()} */}
                    <td>{this.props.applicant.token}</td>
                    <td style={{color: 'green'}}><strong>{this.completionHandler()}</strong></td>
                    <td>{this.props.applicant.completed ?<strong><a style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}} onClick={this.props.results}>VIEW</a></strong>: null}</td>
                    {this.renderActionsSection()}
            </tr>
        );
    }
}

export default IndividualApplicant;
