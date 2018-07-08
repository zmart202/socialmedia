import React, {Component} from 'react';
import hat from 'hat';

import Spinner from '../../components/UI/Spinner/Spinner';

class CreateJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            title: "",
            description: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const id = hat();
        const job = {
            id,
            ...this.state,
            test: []
        };

        const options = {
            headers: {
                "Authorization": `Bearer ${this.props.token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(job)
        };

        this.setState({
            isLoading: true
        }, () => {
            fetch("http://localhost:4567/api/job/create-job", options)
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    console.log(data);
                    return this.setState({
                        isError: true,
                        isLoading: false
                    });
                }

                console.log(data);
                this.setState({
                    isLoading: false
                }, () => {
                    this.props.createJobInState(job);
                    this.props.toggleCreateJob();
                });
            }).catch(err => {
                console.error(err);
                this.setState({
                    isError: true,
                    isLoading: false
                });
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Spinner />
                </div>
            );
        }

        if (this.state.isError) {
            return (
                <div>
                    <p>Error creating Job</p>
                </div>
            );
        }

        return (
            <div>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" onChange={this.handleChange}/>
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" onChange={this.handleChange}/>
                </div>
                <button onClick={this.handleSubmit}>Save</button>
                <button type="button" onClick={this.props.toggleCreateJob}>Cancel</button>
            </div>
        );
    }
}

export default CreateJob;
