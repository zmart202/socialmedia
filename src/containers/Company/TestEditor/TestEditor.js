import React, {Component} from 'react';

import QuestionList from './QuestionList/QuestionList';
import CreateQuestion from './CreateQuestion';
import Spinner from '../../../components/UI/Spinner/Spinner';

class TestEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            createQuestionMounted: false
        };

        this.toggleCreateQuestion = this.toggleCreateQuestion.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggleCreateQuestion() {
        this.setState(prevState => ({
            createQuestionMounted: !prevState.createQuestionMounted
        }));
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner />
        }

        if (this.state.isError) {
            return <p>There was an error.</p>
        }

        let questionList = "";
        if (this.props.job.test.length > 0) {
            questionList = (
                <QuestionList
                    test={this.props.job.test}
                    jobId={this.props.job.id}
                    deleteQuestionInState={this.props.deleteQuestionInState}
                    createQuestionInState={this.props.createQuestionInState}
                    editQuestionInState={this.props.editQuestionInState}
                    token={this.props.token}
                />
            );
        }

        let createQuestionBtn = "";
        let createQuestion = "";
        if (!this.state.createQuestionMounted) {
            createQuestionBtn = (
                <button
                    type="button"
                    onClick={this.toggleCreateQuestion}
                >Add New Question</button>
            );
        } else {
            createQuestion = (
                <CreateQuestion
                    test={this.props.job.test}
                    jobId={this.props.job.id}
                    createQuestionInState={this.props.createQuestionInState}
                    toggleCreateQuestion={this.toggleCreateQuestion}
                    token={this.props.token}
                />
            );
        }

        return (
            <div>
                {createQuestionBtn}
                {createQuestion}
                {questionList}
                <button type="button" onClick={this.props.toggleTestEditor}>Cancel</button>
            </div>
        );
    };
};

export default TestEditor;
