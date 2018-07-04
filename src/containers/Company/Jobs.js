import React, {Component} from 'react';

import CreateJob from './CreateJob';
import EditJob from './EditJob';
import Spinner from '../../components/UI/Spinner/Spinner';

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            companyName: "",
            jobs: [],
            viewingJobId: null,
            createJobMounted: false,
            editJobMounted: false
        }

        this.token = localStorage.getItem("token");

        this.setViewingJobId = this.setViewingJobId.bind(this);
        this.createJobInState = this.createJobInState.bind(this);
        this.editJobInState = this.editJobInState.bind(this);
        this.toggleCreateJob = this.toggleCreateJob.bind(this);
        this.toggleEditJob = this.toggleEditJob.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log("Lemme see that token...", this.token);
        if (this.token === null) {
            return this.props.history.push("/");
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        };

        fetch("http://localhost:4567/api/job/jobs", options)
        .then(res => res.json())
        .then(data => {
            console.log("Data from jobs", data);
            if (!data.success) {
                return this.setState({
                    isLoading: false
                });
            }

            this.setState({
                isLoading: false,
                jobs: data.jobs,
                viewingJobId: data.jobs.length > 0 ?
                data.jobs[0].id : null,

                companyName: data.companyName
            })
        })
    }

    setViewingJobId(id) {
        this.setState({
            viewingJobId: id
        });
    }

    createJobInState(job) {
        this.setState(prevState => ({
            jobs: prevState.jobs.concat(job),
            viewingJobId: job.id
        }));
    }

    editJobInState(job) {
        this.setState(prevState => ({
            jobs: prevState.jobs.map(x =>
                x.id === job.id ? {
                    ...x,
                    title: job.title,
                    description: job.description
                } : x
            )
        }));
    }

    toggleCreateJob() {
        this.setState(prevState => ({
            createJobMounted: !prevState.createJobMounted
        }));
    }

    toggleEditJob() {
        this.setState(prevState => ({
            editJobMounted: !prevState.editJobMounted
        }));
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
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

        let navbar = "";
        if (this.state.jobs.length > 0) {
            navbar = this.state.jobs.map(x => {
                const style = x.id === this.state.viewingJobId ?
                {
                    cursor: 'pointer',
                    color: 'green'
                } : {
                    cursor: 'pointer'
                }

                return (
                    <span
                        key={x.id}
                        style={style}
                        onClick={() => this.setViewingJobId(x.id)}
                    >{x.title}</span>
                );
            });
        } else {
            navbar = (
                <p>No jobs yet</p>
            );
        }

        let createJobBtn = "";
        let createJob = "";
        if (this.state.createJobMounted) {
            createJob = (
                <CreateJob
                    toggleCreateJob={this.toggleCreateJob}
                    createJobInState={this.createJobInState}
                    id={this.state.viewingJobId}
                    token={this.token}
                />
            );
        } else {
            createJobBtn = (
                <div>
                    <button type="button"
                        onClick={this.toggleCreateJob}
                    >Add New Job</button>
                </div>
            );
        }

        let editJobBtn = "";
        let editJob = "";
        if (this.state.editJobMounted) {
            editJob = (
                <EditJob
                    toggleEditJob={this.toggleEditJob}
                    editJobInState={this.editJobInState}
                    job={this.state.jobs.find(x => x.id === this.state.viewingJobId)}
                    id={this.state.viewingJobId}
                    token={this.token}
                />
            );
        } else if (this.state.viewingJobId) {
            editJobBtn = (
                <div>
                    <button type="button"
                        onClick={this.toggleEditJob}
                    >Edit Job</button>
                </div>
            );
        }

        let description = "";
        if (this.state.viewingJobId) {
            description = (
                <p>{this.state.jobs.find(x =>
                    x.id === this.state.viewingJobId
                ).description}</p>
            )
        }

        return (
            <div>
                <h1>Jobs for {this.state.companyName}</h1>
                {createJobBtn}
                {createJob}
                {navbar}
                {description}
                {editJobBtn}
                {editJob}
            </div>
        );
    }
}

export default Jobs;
