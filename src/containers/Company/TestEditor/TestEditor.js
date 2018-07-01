import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import TestForm from './TestForm';
import QuestionList from './QuestionList/QuestionList';
import QuestionForm from './QuestionForm';
import DeleteTestForm from './DeleteTestForm';
import Spinner from '../../../components/UI/Spinner/Spinner';
import ActionButtons from '../../../components/UI/Buttons/ActionButtons';

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
            nameFormMounted: false,
            questionFormMounted: false,
            deleteFormMounted: false
        };

        this.token = localStorage.getItem("token");

        this.toggleNameForm = this.toggleNameForm.bind(this);
        this.toggleQuestionForm = this.toggleQuestionForm.bind(this);
        this.toggleTestForm = this.toggleTestForm.bind(this);
        this.toggleDeleteForm = this.toggleDeleteForm.bind(this);
        this.refreshTestData = this.refreshTestData.bind(this);
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

    saveNewName = () => {
        this.setState({
            isLoading: true
        }, () => {
            if (this.token === null) {
                this.props.history.push("/");
            }

            const options = {
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    name: this.state.testName,
                    testId: this.state.editingTestId
                })
            };

            fetch("http://localhost:4567/api/company/edit-test-name", options)
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
                this.refreshTestData();
                this.toggleNameForm();
            }).catch(err => {
                this.setState({
                    isLoading: false,
                    isError: true
                });
                console.error(err);
            });
        });
    }

    toggleNameForm = () => {
        this.setState(prevState => ({
            nameFormMounted: !prevState.nameFormMounted
        }));
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

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
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

        if (this.state.isError) {
            return <p>There was an error.</p>
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

        let testName = "";
        let editNameForm = "";
        let actionBtns = "";
        if (!this.state.nameFormMounted) {
            testName = (
                <div style={{ padding: '20px' }}>
                    <h1>{test.name}</h1>
                    <ActionButtons
                        isEditing={false}
                        editHandler={this.toggleNameForm}
                        deleteHandler={this.toggleDeleteForm}
                    />
                </div>
            );
        } else {
            editNameForm = (
                <div style={{ padding: '20px'}}>
                    <div style={{ padding: '20px' }}>
                        <input type="text"
                            style={{
                                height: '30px',
                                width: '300px',
                                fontSize: '20px'
                            }}
                            name="testName"
                            defaultValue={test.name}
                            onChange={this.handleChange}
                        />
                    </div>
                    <ActionButtons
                        isEditing={true}
                        onSaveClick={this.saveNewName}
                        onCancel={this.toggleNameForm}
                    />
                </div>
            );
        }

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
                {testName}
                {editNameForm}
                {deleteForm}
                {addQuestionBtn}
                {questionForm}
                <QuestionList
                    questions={test.questions}
                    testId={test.id}
                    inTestForm={false}
                    refreshTestData={this.refreshTestData}
                    token={this.token}
                />
            </div>
        );
    };
};

export default TestEditor;
