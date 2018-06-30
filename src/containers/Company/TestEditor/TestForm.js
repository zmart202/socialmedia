import React, { Component } from 'react';

class TestForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        const options = {
            headers: {
                "Authorization": `Bearer ${this.props.token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                name: this.state.name
            })
        };

        fetch("http://localhost:4567/api/company/create-test", options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.props.refreshTestData(data.createdTestId);
            this.props.toggleTestForm();
        }).catch(err => console.error(err));
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        onChange={this.handleChange}
                        placeholder="name"
                    />
                    <button type="button"
                        onClick={this.handleSubmit}
                    >Submit</button>
                    <button type="button"
                        onClick={this.props.toggleTestForm}
                    >Cancel</button>
                </div>
            </div>
        );
    }
}

export default TestForm;
