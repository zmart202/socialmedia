import React, {Component} from 'react';

import EditQuestion from '../../EditQuestion';
import ActionButtons from '../../../../../components/UI/Buttons/ActionButtons';
import Spinner from '../../../../../components/UI/Spinner/Spinner';

class IndividualQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isError: false,
            editQuestionMounted: false
        }

        this.toggleEditQuestion = this.toggleEditQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }

    toggleEditQuestion() {
        this.setState(prevState => ({
            editQuestionMounted: !prevState.editQuestionMounted
        }));
    }

    deleteQuestion = () => {
        const newTest = this.props.test.filter(x =>
            x.id !== this.props.question.id
        );

        const options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.props.token}`
            },
            method: "POST",
            body: JSON.stringify({
                id: this.props.jobId,
                test: newTest
            })
        };

        this.setState({
            isLoading: true
        }, () => {
            fetch("http://localhost:4567/api/job/edit-test", options)
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
                }, () => this.props.deleteQuestionInState(this.props.question.id));
            }).catch(err => console.error(err));
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Spinner />
            );
        }

        if (this.state.isError) {
            return (
                <p>Error</p>
            );
        }

        let question = "";
        let editQuestion = "";
        let actionBtns = "";
        if (this.state.editQuestionMounted) {
            editQuestion = (
                <EditQuestion
                    question={this.props.question}
                    toggleEditQuestion={this.toggleEditQuestion}
                    test={this.props.test}
                    jobId={this.props.jobId}
                    editQuestionInState={this.props.editQuestionInState}
                    token={this.props.token}
                />
            );
        } else {
            switch (this.props.question.type) {
                case "OPEN_RESPONSE":
                    question = (
                        <div>
                            <h3>{this.props.index + 1}. {this.props.question.body}</h3>
                        </div>
                    );
                    break;
                case "MULTIPLE_CHOICE":
                    question = (
                        <div>
                            <h3>{this.props.index + 1}. {this.props.question.body}</h3>
                            {
                                this.props.question.options.map(x => {
                                    let highlighter = {};
                                    if (x.correct) {
                                        highlighter = {
                                            color: 'green'
                                        };
                                    }
                                    return (
                                        <div key={x.id}>
                                            <h4 style={highlighter}>{x.answer}</h4>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    );
                    break;
                default:
                    console.error("Invalid question type");
                    return <p>Error</p>
            }
            actionBtns = (
                <ActionButtons
                    isEditing={false}
                    editHandler={this.toggleEditQuestion}
                    deleteHandler={this.deleteQuestion}
                />
            )
        }

        return (
            <div style={{paddingBottom: '20px', border: 'solid #cccdce 2px',  margin: "20px 300px", backgroundColor: '#cccdce', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                <span>
                    {
                        this.state.isLoading ?
                        <Spinner /> :
                        <div>
                            {question}
                            {editQuestion}
                            {actionBtns}
                        </div>
                    }
                </span>
            </div>
        );
    }
}

export default IndividualQuestion;
