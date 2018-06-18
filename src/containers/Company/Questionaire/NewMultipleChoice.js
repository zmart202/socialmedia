import React, {Component} from 'react';

class NewMultipleChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correct: ''
        }
    }
    handleCorrectAnswer = (event) => {
        this.setState({correct: event.target.value});
    }

    submitMC = (event) => {
        event.preventDefault();
        let question = this.refs.MCQuestion.value;
        let answer1 = this.refs.answer1.value;
        let answer2 = this.refs.answer2.value;
        let answer3 = this.refs.answer3.value;
        let answer4 = this.refs.answer4.value;
        let answers = [];
        answers.push(answer1, answer2, answer3, answer4);
        let questions = {
            key: this.props.keyValueHandler(),
            index: this.props.increaseQuestionNumberHandler(),
            type: "MULTIPLE CHOICE",
            question,
            answers,
            correct: this.state.correct
        }
        console.log(questions);
        this.props.multipleChoiceQuestion.push(questions);
        this.props.closeMultipleChoiceForm();
        
    }

    render() {
        let multipleChoiceQuestion = null;
        if (this.props.MCQuestion) {
                multipleChoiceQuestion = <form onSubmit={this.submitMC}>
                <textarea cols="100" rows="5" ref="MCQuestion" placeholder="write question here..." /><br /><br />
                <input style={{padding: '5px 10px'}} ref="answer1" placeholder="place first option here.." /><br /><br />
                <input style={{padding: '5px 10px'}} ref="answer2" placeholder="place second option here.." /><br /><br />
                <input style={{padding: '5px 10px'}} ref="answer3" placeholder="place third option here.." /><br /><br />
                <input style={{padding: '5px 10px'}} ref="answer4" placeholder="place fourth option here.." /><br /><br />
                <label>Select the number that correponds to the right answer</label><br />
                <select value={this.state.correct} onChange={this.handleCorrectAnswer}>
                    <option value="0">1</option>
                    <option value="1">2</option>
                    <option value="2">3</option>
                    <option value="3">4</option>
                </select><br /><br />
                <span>
                    <input type="submit" value="Create" />
                    <button onClick={this.cancelMCHandler}>Cancel</button>
                </span>
            </form>;
        }
        return (
            <div>
                {multipleChoiceQuestion}
            </div>
        );
    }
}

export default NewMultipleChoice;