import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import QuestionList from './QuestionList/QuestionList';
import QuestionForm from './QuestionForm';

class TestEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false,
            tests: [],
            editingTestId: null,
            questions: [],
            questionFormMounted: false
        };

        this.token = localStorage.getItem("token");

        this.toggleQuestionForm = this.toggleQuestionForm.bind(this);
        this.refreshTestData = this.refreshTestData.bind(this);
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

        fetch("http://localhost:4567/api/company/tests/", options)
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                return this.setState({
                    isError: true,
                    isLoading: false
                });
            }

            this.setState({
                isLoading: false,
                tests: data.tests,
                editingTestId: data.tests[0].id
            });
        }).catch(err => console.error(err));
    }

    refreshTestData = () => {
        if (this.token === null) {
            return this.props.history.push("/");
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        };

        fetch("http://localhost:4567/api/company/tests/", options)
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                return this.setState({
                    isError: true
                });
            }

            this.setState({
                tests: data.tests
            });
        }).catch(err => console.error(err));
    }



    toggleQuestionForm = () => {
        this.setState(prevState => ({
            questionFormMounted: !prevState.questionFormMounted
        }));
    }

    render() {
        if (this.state.isLoading) {
            return <p>Loading...</p>
        }

        let test = this.state.tests.find(x =>
            x.id === this.state.editingTestId
        );

        let addQuestionBtn = "";
        if (!this.state.questionFormMounted) {
            addQuestionBtn = (
                <button
                    type="button"
                    onClick={this.toggleQuestionForm}
                >Add New Question</button>
            );
        }

        let questionForm = "";
        if (this.state.questionFormMounted) {
            questionForm = (
                <QuestionForm
                    testId={test.id}
                    toggleQuestionForm={this.toggleQuestionForm}
                    refreshTestData={this.refreshTestData}
                    token={this.token}
                />
            );
        }

        return (
            <div>
                <div style={{padding: '20px', textAlign: 'left'}}>
                    <Link to='/company' style={{textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', backgroundColor: 'purple'}}>BACK</Link>
                </div>
                <h1>{test.name}</h1>
                {addQuestionBtn}
                {questionForm}
                <QuestionList
                    questions={test.questions}
                    testId={test.id}
                    refreshTestData={this.refreshTestData}
                    token={this.token}
                />
            </div>
        );
    };
};

export default TestEditor;
