import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import TestForm from './TestForm';
import QuestionList from './QuestionList/QuestionList';
import QuestionForm from './QuestionForm';
import DeleteTestForm from './DeleteTestForm';
import Spinner from '../../../components/UI/Spinner/Spinner';

class TestEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false,
            tests: [],
            editingTestId: null,
            testFormMounted: false,
            testName: "",
            questions: [],
            questionFormMounted: false,
            deleteTestForm: false
        };

        this.token = localStorage.getItem("token");

        this.toggleQuestionForm = this.toggleQuestionForm.bind(this);
        this.toggleTestForm = this.toggleTestForm.bind(this);
        this.toggleDeleteForm = this.toggleDeleteForm.bind(this);
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

            console.log("TESTS", data.tests);

            this.setState({
                isLoading: false,
                tests: data.tests,
                editingTestId: data.tests[0].id
            });
        }).catch(err => console.error(err));
    }

    refreshTestData = (editingTestId = this.state.editingTestId) => {
        this.setState({
            isLoading: true
        }, () => {
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
                    editingTestId,
                    tests: data.tests,
                    isLoading: false
                });
            }).catch(err => console.error(err));
        });
    }

    toggleQuestionForm = () => {
        this.setState(prevState => ({
            questionFormMounted: !prevState.questionFormMounted
        }));
    }

    toggleTestForm = () => {
        this.setState(prevState => ({
            testFormMounted: !prevState.testFormMounted
        }));
    }

    toggleDeleteForm = () => {
        this.setState(prevState => ({
            deleteFormMounted: !prevState.deleteFormMounted
        }));
    }

    setEditingTestId = (id) => {
        this.setState({
            editingTestId: id
        });
    }

    render() {
        const style = {
            header: {
                padding: '50px'
            },
            li: {
                cursor: 'pointer',
                border: 'solid',
                padding: '10px'
            }
        };

        if (this.state.isLoading) {
            return <Spinner />
        }

        let header = this.state.tests.map(x =>
            <span key={x.id}
                style={style.li}
                onClick={() => this.setEditingTestId(x.id)}
            >{x.name}</span>
        );

        let test = this.state.tests.find(x =>
            x.id === this.state.editingTestId
        );

        let newTestBtn = "";
        let newTestForm = "";
        if (!this.state.testFormMounted) {
            newTestBtn = (
                <button type="button"
                    onClick={this.toggleTestForm}
                >New Test</button>
            );
        } else {
            newTestForm = (
                <div>
                    <TestForm
                        refreshTestData={this.refreshTestData}
                        toggleTestForm={this.toggleTestForm}
                        token={this.token}
                        setEditingTestId={this.setEditingTestId}
                    />
                </div>
            );
        }

        let addQuestionBtn = "";
        let questionForm = "";
        if (!this.state.questionFormMounted) {
            addQuestionBtn = (
                <button
                    type="button"
                    onClick={this.toggleQuestionForm}
                >Add New Question</button>
            );
        } else {
            questionForm = (
                <QuestionForm
                    testId={test.id}
                    toggleQuestionForm={this.toggleQuestionForm}
                    refreshTestData={this.refreshTestData}
                    token={this.token}
                />
            );
        }

        let deleteBtn = "";
        let deleteForm = "";
        if (this.state.deleteFormMounted) {
            deleteForm = (
                <DeleteTestForm
                    toggleDeleteForm={this.toggleDeleteForm}
                    id={this.state.editingTestId}
                    refreshTestData={this.refreshTestData}
                    name={test.name}
                    token={this.token}
                    firstTestId={this.state.tests[0].id}
                />
            );
        } else {
            deleteBtn = (
                <button type="button"
                    onClick={this.toggleDeleteForm}
                >Delete</button>
            );
        }

        return (
            <div>
                <div style={{padding: '20px', textAlign: 'left'}}>
                    <Link to='/company' style={{textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', backgroundColor: 'purple'}}>BACK</Link>
                </div>
                <div>
                    {newTestBtn}
                    {newTestForm}
                </div>
                <div style={style.header}>
                    {header}
                </div>
                <h1>{test.name}</h1>
                {addQuestionBtn}
                {questionForm}
                <QuestionList
                    questions={test.questions}
                    testId={test.id}
                    inTestForm={false}
                    refreshTestData={this.refreshTestData}
                    token={this.token}
                />
                {deleteBtn}
                {deleteForm}
            </div>
        );
    };
};

export default TestEditor;
