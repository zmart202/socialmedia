import React, { Component } from 'react';

class IndividualApplicant extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false
        }
    }

    renderActionsSection = () => {
        if (this.state.isEditing) {
            return (
                <td>
                    <button>SAVE</button>
                    <button onClick={this.onCancelClick.bind(this)}>CANCEL</button>
                </td>
            );
        }
        return (
            <td>
                <button onClick={this.editHandler.bind(this)}>EDIT</button>
                <button>DELETE</button>
            </td>
        );
    }

    editHandler = () => {
        this.setState({ isEditing: true});
    }

    onCancelClick = () => {
        this.setState({isEditing: false});
    }

    render() {
        return(
            <tr style={{fontSize: "11px"}}>
                <td>{this.props.applicant.lname}</td>
                <td>{this.props.applicant.fname}</td>
                <td>{this.props.applicant.email}</td>
                <td>{this.props.applicant.password}</td>
                <td>{this.props.applicant.status}</td>
                <td>{this.props.applicant.status}</td>
                {this.renderActionsSection()}
            </tr>
        );
    }
}

export default IndividualApplicant;