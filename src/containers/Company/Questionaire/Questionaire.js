import React, {Component} from 'react';
import QuestionList from './QuestionList/QuestionList';
import QuestionType from './QuestionType';
import NewMultipleChoice from './NewMultipleChoice'

class Questionaire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            activeQuestion: false,
            questions: [ 
                        {
                            key: 0,
                            index: 1,
                            type:"OPEN RESPONSE",
                            question: "What is your name"
                        },
                        {
                            key: 1,
                            index: 2,
                            type:"OPEN RESPONSE",
                            question: "what is your color"
                        },
                        {
                            key: 2,
                            index: 3,
                            type: "MULTIPLE CHOICE",
                            question: 'What is the color of the sky',
                            answers: [
                                'Zack',
                                'Jackson',
                                'Josh',
                                'none'
                            ],
                            correct: 0
                        },
                        {
                            key: 3,
                            index: 4,
                            type: "MULTIPLE CHOICE",
                            question: 'What is the best color',
                            answers: [
                                'black',
                                'green',
                                'purple',
                                'red'
                            ],
                            correct: 2
                        }
            ],
            questionNumber: 4,
            keyValue: 4,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    increaseQuestionNumberHandler = () => {
        let quesNumber = this.state.questions.length;
        quesNumber += 1;
        this.setState({questionNumber: quesNumber});
        return quesNumber;
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    closeMultipleChoiceForm = () => {
        this.setState({MultipleChoiceQuestion: false});
    }
    

    handleSubmit = (event) => {
        event.preventDefault();
        switch(this.state.value) {
            case 'Open Response':
                this.setState({MultipleChoiceQuestion: false});
                this.setState({ORQuestion: true});
                break;
            case 'Multiple Choice':
                this.setState({ORQuestion: false});
                this.setState({MultipleChoiceQuestion: true});
                break;
            default:
                alert('Please choose one of the question types...');
                break;
        }
    }

    keyValueHandler = () => {
        let num = this.state.keyValue;
        num += 1;
        this.setState({keyValue: num});
        return this.state.keyValue;
    }

    submitOR = () => {
        let question = this.refs.ORQuestion.value;
        let questionObj = {
            key: this.keyValueHandler(),
            index: this.increaseQuestionNumberHandler(),
            type:"OPEN RESPONSE",
            question
        }
        this.setState(prevState => ({
            question: prevState.questions.concat(questionObj),
            ORQuestion: false
        }));
    }

    deleteQuestionHandler = (question) => {
        let questionIndex = this.state.questions.filter((q) => question.key !== q.key);
        this.setState({questions: questionIndex});
        let num = 1;
        questionIndex.map((q) => {
            q.index = num;
            num += 1;
            return q.index;
        });
        this.setState({questionNumber: questionIndex.length + 1});
    }

    cancelOpenResponseHandler = (event) => {
        event.preventDefault();
        this.setState({ORQuestion: false});
    }

    cancelMultipleChoiceHandler = (event) => {
        event.preventDefault();
        this.setState({MCQuestion: false})
    }



    render() {
        let openResponse = null;

        if (this.state.ORQuestion) {
            openResponse = <form>
                <textarea cols="100" rows="5" ref="ORQuestion" placeholder="write question here"/><br />
                <span>
                    <button type="button" onClick={this.submitOR}>Create</button>
                    <button type="button" onClick={this.cancelOpenResponseHandler}>Cancel</button>
                </span>
            </form>;
        }
        return (
            <div>
                <h1>Create a question</h1>
                <QuestionType value={this.state.value} 
                                handleSubmit={this.handleSubmit}
                                handleChange={this.handleChange}
                                ORQuestion={this.state.OpenResponseQuestion} />
                {openResponse}
                <NewMultipleChoice MCQuestion={this.state.MultipleChoiceQuestion}
                                    cancelMCHandler={this.cancelMultipleChoiceHandler}
                                    multipleChoiceQuestion={this.state.questions}
                                    keyValueHandler={this.keyValueHandler}
                                    increaseQuestionNumberHandler={this.increaseQuestionNumberHandler}
                                    closeMultipleChoiceForm={this.closeMultipleChoiceForm}/>
                <QuestionList questions={this.state.questions}
                              deleteQuestionHandler={this.deleteQuestionHandler.bind(this)} />
            </div>
        );
    };
};

export default Questionaire;