import React, {Component} from 'react';
import ActionButtons from '../../../../../components/UI/Buttons/ActionButtons';

class IndividualQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false
        }
    }

    editHandler = () => {
        this.setState({isEditing: true});
    }

    onCancelClick = () => {
        this.setState({isEditing: false});
    }

    onSaveClick = (event) => {
        event.preventDefault();
        let question = null;
        if (this.props.question.type === "OPEN RESPONSE") {
            question = this.refs.editQuestion.value;
            this.props.question.question = question;
        } else if (this.props.question.type === "MULTIPLE CHOICE") {
            question = this.refs.MCQuestion.value;
            let answer1 = this.refs.answer1.value;
            console.log(this.refs.answer1.value);
            let answer2 = this.refs.answer2.value;
            let answer3 = this.refs.answer3.value;
            let answer4 = this.refs.answer4.value;
            this.props.question.question = question;
            this.props.question.answers[0] = answer1;
            this.props.question.answers[1] = answer2;
            this.props.question.answers[2] = answer3;
            this.props.question.answers[3] = answer4;
        }
        this.setState({isEditing: false});
    }

    render() { 
        let openResponseQuestion = null;
        if (this.props.question.type === "OPEN RESPONSE") {
            openResponseQuestion = <h3>{this.props.question.index}. {this.props.question.question}</h3>;
            if (this.state.isEditing) {
                openResponseQuestion = <div>
                        <div style={{padding:'10px 0px'}}>
                            <textarea rows='5' cols='50' defaultValue={this.props.question.question} ref='editQuestion'/>
                        </div>
                        <br />
                    </div>
            }
        }
        let multipleChoiceQuestion = null;
        if (this.props.question.type === "MULTIPLE CHOICE") {
            let correctAnswer = Number(this.props.question.correct) + 1;
            multipleChoiceQuestion = <div>
                <h3>{this.props.question.index}. {this.props.question.question}</h3>
                <h4>{this.props.question.answers[0]}</h4>
                <h4>{this.props.question.answers[1]}</h4>
                <h4>{this.props.question.answers[2]}</h4>
                <h4>{this.props.question.answers[3]}</h4>
                <p>Correct Answer is number: <strong>{correctAnswer}</strong></p>
            </div>
            if (this.state.isEditing) {
                multipleChoiceQuestion = <div>
                    <br /><textarea cols="100" rows="5" ref="MCQuestion" defaultValue={this.props.question.question} /><br /><br />
                    <input style={{padding: '5px 10px'}} ref="answer1" defaultValue={this.props.question.answers[0]} /><br /><br />
                    <input style={{padding: '5px 10px'}} ref="answer2" defaultValue={this.props.question.answers[1]} /><br /><br />
                    <input style={{padding: '5px 10px'}} ref="answer3" defaultValue={this.props.question.answers[2]} /><br /><br />
                    <input style={{padding: '5px 10px'}} ref="answer4" defaultValue={this.props.question.answers[3]} /><br /><br />
                    <label>Select the number that correponds to the right answer</label><br />
                    <select value={this.state.correct} onChange={this.handleCorrectAnswer}>
                        <option value="0">1</option>
                        <option value="1">2</option>
                        <option value="2">3</option>
                        <option value="3">4</option>
                    </select><br /><br />
                </div>
            }
        }
        return(
            <div style={{paddingBottom: '20px', border: 'solid #cccdce 2px',  margin: "20px 300px", backgroundColor: '#cccdce', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                <span>
                    {openResponseQuestion}
                    {multipleChoiceQuestion}
                    <ActionButtons isEditing={this.state.isEditing}
                                    onCancelClick={this.onCancelClick.bind(this)}
                                    editHandler={this.editHandler.bind(this)}
                                    onSaveClick={this.onSaveClick.bind(this)}
                                    delete={this.props.delete} />
                </span>
            </div>
        );
    }
}

export default IndividualQuestion;