import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import Aux from '../../../../hoc/Aux/Aux';
import ResultsHeader from '../ResultsHeader';

class TestResults extends Component  {
    constructor(props){
        super(props);
        this.state = {
            firstName: 'Jackson',
            lastName: 'Lenhart',
            secondsElapsed: 880,
            test: {
                name: 'Customer Service',
                questions: [
                         {
                        id: 1,
                        type: 'MULTIPLE_CHOICE',
                        body: 'Question 1',
                        options: [
                            {
                                id: 1,
                                answer: 'answer 1',
                                correct: false
                            },
                            {
                                id: 2,
                                answer: 'answer 2',
                                correct: false
                            },
                            {
                                id: 3,
                                answer: 'answer 3',
                                correct: true
                            }
                        ],
                        
                    },
                    {
                        id: 2,
                        type: 'MULTIPLE_CHOICE',
                        body: 'Question 2',
                        options: [
                            {
                                id: 4,
                                answer: 'answer 1',
                                correct: false
                            },
                            {
                                id: 5,
                                answer: 'answer 2',
                                correct: false
                            },
                            {
                                id: 6,
                                answer: 'answer 3',
                                correct: true
                            }
                        ],
                        
                    },
                    {
                        id: 2,
                        type: 'OPEN_RESPONSE',
                        body: 'Question 3'
                    }
                ],
                answers: [
                    {
                        answer: 'answer 2'
                    },
                    {
                        answer: 'answer 3'
                    },
                    {
                        answer: 'I dont know what im doing in life... :('
                    }
                ]
            },
            showMultipleChoice: false
        }
    }

    showMultipleChoiceHandler = () => {
        this.setState({showMultipleChoice: !this.state.showMultipleChoice});
    }


    formattedSeconds = (sec) => {
        return (Math.floor(sec / 60) +
            ' minutes and ' +
          ('0' + sec % 60).slice(-2) + ' seconds');
    }

    render() {
        const answers = this.state.test.answers;
        const questions = this.state.test.questions;
        const multipleChoice = [];
        const openResponse = [];
        const correctAnswers = [];
        let MCQuestion ='';
        let openResonseQuestions;
        let MCStyle = {
            textDecoration: 'underline',
            color: 'blue'
        }
        // const correctAnswers = [];

        questions.map((question) => {
            if (question.type === 'MULTIPLE_CHOICE') {
                let index = questions.indexOf(question);
                multipleChoice.push(question);
                question.options.map((option) => {
                    if (answers[index].answer === option.answer && option.correct) {
                        correctAnswers.push(question);
                    }
                    return correctAnswers;
                });
                return multipleChoice;
            } else {
                openResponse.push(question);
            }
            return openResponse;
        });

        let fractionCorrect = <p><strong>({correctAnswers.length}/{multipleChoice.length})</strong> of the Multiple Choice Questions are Correct</p>;
        
        if (this.state.showMultipleChoice) {
            MCQuestion = questions.map((question) => {
                if (question.type === 'MULTIPLE_CHOICE') {
                    return <div key={question.id}>
                    <h3 style={{borderTop: 'solid gray 2px', paddingTop: '5px'}}>{question.body}</h3>
                    {question.options.map((option) => {
                        let index = questions.indexOf(question);
                        let answer = answers[index].answer;
                        let style = '';
                        if (answer === option.answer && option.correct) {
                            style = 'green';
                        } else if (answer === option.answer && !option.correct) {
                            style = 'red';
                        } 
                        return <div key={option.id}>
                            <p style={{color: style}}>{option.answer}</p>
                            </div>
                    })}
                    </div>
                }
            });
        }

        openResonseQuestions = questions.map((question) => {
            if (question.type === 'OPEN_RESPONSE') {
                let index = questions.indexOf(question);
                return (
                    <div key={question.id}>
                        <h3>{question.body}</h3>
                        <p>{answers[index].answer}</p>
                    </div>
                )
            }
        })

        // let answers = props.data.answers;
        // let content = [];
        // for (let k in answers) {
        //     content.push(
        //         <div key={k}>
        //             <p>{props.data.test.questions.find(x =>
        //                 x.id === k
        //             ).body}:</p>
        //             <p><em>{answers[k]}</em></p>
        //         </div>
        //     );
        // }

        return (
            <Aux>
                <ResultsHeader />
                <h3 style={{color: 'purple'}}>Results for {this.state.firstName} {this.state.lastName}</h3>
                <h4 style={{color: 'purple'}}>Total amount of time taken is <span style={{color: 'red', textDecoration: 'underline'}}>{this.formattedSeconds(this.state.secondsElapsed)}</span></h4>
                {/* {content} */}
                <div style={{backgroundColor: "#cfcfd1", margin: '10px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', padding: '5px'}}>
                    {multipleChoice.length > 0 ? <h3>Multiple Choice Question(s)</h3> : null}
                    {fractionCorrect}
                    {this.state.showMultipleChoice ? <a style={MCStyle} onClick={this.showMultipleChoiceHandler}>Hide Multiple Choice Answers</a> : <a style={MCStyle} onClick={this.showMultipleChoiceHandler}>Show Multiple Choice Answers</a>}
                    {MCQuestion}
                </div>
                <div style={{backgroundColor: "#cfcfd1", margin: '10px 300px', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', padding: '5px'}}>
                    {openResponse.length > 0 ? <h3>Open Response Question(s)</h3> : null}
                    {openResonseQuestions}
                </div>
            </Aux>
        )
    }

}

export default TestResults;