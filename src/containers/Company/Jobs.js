import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CreateJob from './CreateJob';
import EditJob from './EditJob';
import DeleteJob from './DeleteJob';
import TestEditor from './TestEditor/TestEditor';
import Spinner from '../../components/UI/Spinner/Spinner';

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false,
            companyId: "",
            companyName: "",
            jobs: [],
            viewingJobId: null,
            createJobMounted: false,
            editJobMounted: false,
            testEditorMounted: false
        }

        this.token = localStorage.getItem("token");

        this.setViewingJobId = this.setViewingJobId.bind(this);
        this.createJobInState = this.createJobInState.bind(this);
        this.editJobInState = this.editJobInState.bind(this);
        this.deleteJobInState = this.deleteJobInState.bind(this);
        this.createQuestionInState = this.createQuestionInState.bind(this);
        this.editQuestionInState = this.editQuestionInState.bind(this);
        this.deleteQuestionInState = this.deleteQuestionInState.bind(this);
        this.toggleTestEditor = this.toggleTestEditor.bind(this);
        this.toggleCreateJob = this.toggleCreateJob.bind(this);
        this.toggleEditJob = this.toggleEditJob.bind(this);
        this.toggleDeleteJob = this.toggleDeleteJob.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
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
                    isLoading: false,
                    isError: true
                });
            }

            this.setState({
                isLoading: false,
                jobs: data.jobs,
                viewingJobId: data.jobs.length > 0 ?
                data.jobs[0].id : null,

                companyId: data.companyId,
                companyName: data.companyName
            });
        }).catch(err => {
            console.error(err);
            this.setState({
                isLoading: false,
                isError: true
            });
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

    deleteJobInState(id) {
        this.setState(prevState => {
            let newJobs = prevState.jobs.filter(x => x.id !== id);
            return {
                jobs: newJobs,
                viewingJobId: newJobs.length > 0 ?
                _.sample(newJobs).id : null
            };
        });
    }

    createQuestionInState(q) {
        this.setState(prevState => ({
            jobs: prevState.jobs.map(x =>
                x.id === this.state.viewingJobId ?
                {
                    ...x,
                    test: x.test.concat(q)
                } : x
            )
        }));
    }

    editQuestionInState(q) {
        this.setState(prevState => ({
            jobs: prevState.jobs.map(x =>
                x.id === this.state.viewingJobId ?
                {
                    ...x,
                    test: x.test.map(y =>
                        y.id === q.id ? q : y
                    )
                } : x
            )
        }));
    }

    deleteQuestionInState(id) {
        this.setState(prevState => ({
            jobs: prevState.jobs.map(x =>
                x.id === this.state.viewingJobId ?
                {
                    ...x,
                    test: x.test.filter(y => y.id !== id)
                } : x
            )
        }));
    }

    toggleTestEditor() {
        this.setState(prevState => ({
            testEditorMounted: !prevState.testEditorMounted
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

    toggleDeleteJob() {
        this.setState(prevState => ({
            deleteJobMounted: !prevState.deleteJobMounted
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

        if (this.state.isError) {
            return (
                <p>Error loading Jobs</p>
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

        let testEditor = "";
        if (this.state.testEditorMounted) {
            testEditor = (
                <TestEditor
                    token={this.token}
                    job={this.state.jobs.find(x => x.id === this.state.viewingJobId)}
                    createQuestionInState={this.createQuestionInState}
                    editQuestionInState={this.editQuestionInState}
                    deleteQuestionInState={this.deleteQuestionInState}
                />
            );
        }

        let deleteJob = "";
        let deleteJobBtn = "";
        if (this.state.deleteJobMounted) {
            deleteJob = (
                <DeleteJob
                    id={this.state.viewingJobId}
                    title={this.state.jobs.find(x => x.id === this.state.viewingJobId).title}
                    token={this.token}
                    toggleDeleteJob={this.toggleDeleteJob}
                    deleteJobInState={this.deleteJobInState}
                />
            );
        } else {
            deleteJobBtn = (
                <button type="button"
                    onClick={this.toggleDeleteJob}
                >Delete Job</button>
            );
        }

        let description = "";
        let copyLinkBtn = "";
        if (this.state.viewingJobId && !this.state.editJobMounted && !this.state.createJobMounted && !this.state.testEditorMounted) {
            description = (
                <p>{this.state.jobs.find(x =>
                    x.id === this.state.viewingJobId
                ).description}</p>
            );

            let url = `http://localhost:3000/job-description/${this.state.companyId}/${this.state.viewingJobId}`
            copyLinkBtn = (
                <CopyToClipboard text={url}>
                    <button type="button">Copy Link to Application</button>
                </CopyToClipboard>
            )
        }

        return (
            <div>
                <div style={{padding: '20px', textAlign: 'left'}}>
                    <Link to='/company' style={{textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', backgroundColor: 'purple'}}>BACK</Link>
                </div>
                <h1>Jobs for {this.state.companyName}</h1>
                {createJobBtn}
                {createJob}
                {navbar}
                {description}
                {copyLinkBtn}
                {editJobBtn}
                {editJob}
                {deleteJobBtn}
                {deleteJob}
                <div>
                    <button type="button"
                        onClick={this.toggleTestEditor}
                    >Toggle Test Editor</button>
                </div>
                {testEditor}
            </div>
        );
    }
}

export default Jobs;
