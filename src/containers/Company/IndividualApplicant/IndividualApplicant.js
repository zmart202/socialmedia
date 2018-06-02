import React, { Component } from 'react';
import './IndividualApplicant.css'
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
                    <strong><a className="SaveB" style={{padding: '7px', border: 'solid #3f3c87 3px', margin: '2px', color: '#3f3c87', cursor: 'pointer'}} onClick={this.onSaveClick.bind(this)}>SAVE</a></strong>
                    <strong><a className="CancelB" style={{padding: '7px', border: 'solid gray 3px', margin: '2px', color: 'gray', cursor: 'pointer'}} onClick={this.onCancelClick.bind(this)}>CANCEL</a></strong>
                </td>
            );
        }
        return (
            <td>
                <strong><a className="EditB" style={{padding: '7px', border: 'solid #af9121 3px', margin: '2px', color: '#af9121', cursor: 'pointer'}} onClick={this.editHandler.bind(this)}>EDIT</a></strong>
                <strong><a className="DeleteB" style={{padding: '7px', border: 'solid #7c251d 3px', margin: '2px', color: '#7c251d', cursor: 'pointer'}} onClick={this.props.delete}>DELETE</a></strong>
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
            <tr style={{fontSize: "12px"}} className='Applicant'>
                    <td><strong>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.lastName} ref="editLName" /> : this.props.applicant.lastName}</strong></td>
                    <td><strong>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.firstName} ref="editFName" /> : this.props.applicant.firstName}</strong></td>
                    <td><strong>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.email} ref="editEmail" /> : this.props.applicant.email}</strong></td>
                    {/* {this.renderApplicantSection()} */}
                    <td><strong>http://localhost:3000/applicant/{this.props.applicant.token}</strong></td>
                    <td style={{color: 'green'}}><strong>{this.completionHandler()}</strong></td>
                    <td>{this.props.applicant.completed ?<strong><a style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}} onClick={this.props.results}>VIEW</a></strong>: null}</td>
                    {this.renderActionsSection()}
            </tr>
        );
    }
}

export default IndividualApplicant;