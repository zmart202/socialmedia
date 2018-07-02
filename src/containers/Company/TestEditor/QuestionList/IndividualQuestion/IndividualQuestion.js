import React, {Component} from 'react';

import QuestionForm from '../../QuestionForm';
import ActionButtons from '../../../../../components/UI/Buttons/ActionButtons';

class IndividualQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editFormMounted: false
        }

        this.toggleEditForm = this.toggleEditForm.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }

    toggleEditForm = () => {
        this.setState(prevState => ({
            editFormMounted: !prevState.editFormMounted
        }));
    }

    deleteQuestion = id => {
        const options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.props.token}`
            },
            method: "POST",
            body: JSON.stringify({
                questionId: this.props.question.id,
                testId: this.props.testId
            })
        };

        fetch("http://localhost:4567/api/company/delete-question", options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.props.refreshTestData();
        }).catch(err => console.error(err));
    }

    render() {
        let question = "";
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

        let questionForm = "";
        let actionBtns = "";
        if (this.state.editFormMounted) {
            questionForm = (
                <QuestionForm
                    question={this.props.question}
                    toggleEditForm={this.toggleEditForm.bind(this)}
                    testId={this.props.testId}
                    refreshTestData={this.props.refreshTestData}
                    token={this.props.token}
                    delete={this.props.delete}
                />
            );
        } else {
            actionBtns = (
                <ActionButtons
                    isEditing={false}
                    editHandler={this.toggleEditForm}
                    deleteHandler={this.deleteQuestion}
                />
            )
        }

        return (
            <div style={{paddingBottom: '20px', border: 'solid #cccdce 2px',  margin: "20px 300px", backgroundColor: '#cccdce', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                <span>
                    {question}
                    {questionForm}
                    {actionBtns}
                </span>
            </div>
        );
    }
}

export default IndividualQuestion;
