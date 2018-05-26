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
                    <td><input type="text" defaultValue={this.props.applicant.lname} ref="editLName" /></td>
                    <td><input type="text" defaultValue={this.props.applicant.fname} ref="editFName" /></td>
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
        this.props.applicant.lname = this.refs.editLName.value;
        this.props.applicant.fname = this.refs.editFName.value;
        this.props.applicant.email = this.refs.editEmail.value;
        this.setState({isEditing: false});
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
            <tr style={{fontSize: "11px"}}>
                    <td>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.lname} ref="editLName" /> : this.props.applicant.lname}</td>
                    <td>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.fname} ref="editFName" /> : this.props.applicant.fname}</td>
                    <td>{this.state.isEditing ? <input type="text" defaultValue={this.props.applicant.email} ref="editEmail" /> : this.props.applicant.email}</td>
                    {/* {this.renderApplicantSection()} */}
                    <td>{this.props.applicant.password}</td>
                    <td style={{color: 'green'}}><strong>{this.completionHandler()}</strong></td>
                    <td>{this.props.applicant.completed ?<strong><a style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}} onClick={this.props.results}>VIEW</a></strong>: null}</td>
                    {this.renderActionsSection()}
            </tr>
        );
    }
}

export default IndividualApplicant;