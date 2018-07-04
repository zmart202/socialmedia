import React, {Component} from 'react';

class DeleteTestForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameConfirmation: "",
            isError: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        if (this.state.nameConfirmation !== this.props.name) {
            return this.setState({
                isError: true
            });
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${this.props.token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                id: this.props.id
            })
        };

        fetch("http://localhost:4567/api/company/delete-test", options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.props.deleteTestInState(this.props.id);
            this.props.toggleDeleteForm();
        }).catch(err => {
            console.error(err);
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        let errorMsg = "";
        if (this.state.isError) {
            errorMsg = (
                <p style={{ color: 'red' }}>
                    The name you entered does not match
                </p>
            )
        }

        return (
            <div>
                <h3 style={{ color: 'red '}}>
                    Enter name of test to delete:
                </h3>
                <input
                    type="text"
                    name="nameConfirmation"
                    onChange={this.handleChange}
                />
                <button type="button"
                    style={{ backgroundColor: 'red' }}
                    onClick={this.handleDelete}
                >Delete</button>
                <button type="button"
                    onClick={this.props.toggleDeleteForm}
                >Cancel</button>
                {errorMsg}
            </div>
        );
    }
}

export default DeleteTestForm;
