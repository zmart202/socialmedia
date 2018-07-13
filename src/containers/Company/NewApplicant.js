import React, { Component } from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';

class NewApplicant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            firstName: "",
            lastName: "",
            email: "",
            selectedJobId: ""
        };

        this.createHandler = this.createHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.jobs.length > 0) {
            return;
        }

        this.setState({
            isLoading: true
        }, () => {
            const options = {
                headers: {
                    "Authorization": `Bearer ${this.props.token}`
                }
            };

            fetch("http://localhost:4567/api/company/jobs", options)
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    console.log(data);
                    return this.setState({
                        isLoading: false,
                        isError: true
                    });
                }

                console.log(data);
                this.props.putJobsInState(data.jobs);
                this.setState({ isLoading: false });
            }).catch(err => {
                console.error(err);
                this.setState({
                    isError: true,
                    isLoading: false
                });
            });
        });
    }

    createHandler(e) {
        this.props.createApplicant(this.state.firstName, this.state.lastName, this.state.email, this.state.selectedJobId);
        this.props.toggleCreateApplicant();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner />;
        }

        if (this.state.isError) {
            return (
                <p>Error loading jobs</p>
            );
        }

        const style = {
            field: {
                margin: '5px',
                padding: '10px'
            },
            submit: {
                backgroundColor: 'purple',
                textDecoration: 'none',
                color: 'white',
                padding: '5px',
                cursor: 'pointer',
                boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)',
                marginLeft: '3px',
                fontSize: '10px'
            }
        };

        return (
            <form>
                <input type="text"
                    style={{margin: '5px', padding: '10px'}}
                    placeholder="Type first name here..."
                    name="firstName"
                    onChange={this.handleChange}
                />
                <input type="text"
                    style={{margin: '5px', padding: '10px'}}
                    placeholder="Type last name here..."
                    name="lastName"
                    onChange={this.handleChange}
                />
                <input type="text"
                    style={{margin: '5px', padding: '10px'}}
                    placeholder="Type email here..."
                    name="email"
                    onChange={this.handleChange}
                />
                <select name="selectedJobId" defaultValue="" onChange={this.handleChange}>
                    <option value="" disabled hidden>Assign Job</option>
                    {
                        this.props.jobs.map(x =>
                            <option key={x.id} value={x.id}>{x.title}</option>
                        )
                    }
                </select>
                <a onClick={this.createHandler} style={style.submit}>Create</a>
                <a onClick={this.props.toggleCreateApplicant} style={style.submit}>Cancel</a>
            </form>
        );
    }
}

export default NewApplicant;
