import React, {Component} from 'react';
import shortid from 'shortid';

import ActionButtons from '../../../components/UI/Buttons/ActionButtons';

class EditForm extends Component {
    constructor(props) {
        super(props);

        this.isMultipleChoice = props.question.type === "MULTIPLE_CHOICE";
        this.found = this.isMultipleChoice ?
            props.question.options.find(x =>
                x.correct
            ) : null;
            

        this.state = {
            questionType: props.question.type,
            options: this.isMultipleChoice ?
                props.question.options.reduce((acc, x) => ({
                    ...acc,
                    [x.id]: x.answer
                }), {}) : null,
            correctAnswerId: this.found ? this.found.id : null,
            body: props.question.body
        };

        this.onSaveClick = this.onSaveClick.bind(this);
        this.setCorrectAnswer = this.setCorrectAnswer.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.addOption = this.addOption.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    onSaveClick = event => {
        event.preventDefault();

        const options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.props.token}`
            },
            method: "POST"
        };

        const body = {
            questionType: this.props.question.type,
            questionId: this.props.question.id,
            testId: this.props.testId,
            body: this.state.body
        };

        if (this.props.question.type === "MULTIPLE_CHOICE") {
            let _options = [];
            for (let k in this.state.options) {
                if (this.state.options[k].length > 0) {
                    _options.push({
                        id: k,
                        answer: this.state.options[k],
                        correct: k === this.state.correctAnswerId ? true : false
                    });
                }
            }
            options.body = JSON.stringify({
                ...body,
                options: _options
            });
        } else {
            options.body = JSON.stringify(body);
        }

        fetch("http://localhost:4567/api/company/edit-question", options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.props.toggleEditForm();
            this.props.refreshTestData();
        }).catch(err => console.error(err));
    }

    setCorrectAnswer(e) {
        this.setState({
            correctAnswerId: e.target.value
        });
    }

    addOption() {
        this.setState(prevState => ({
            options: prevState.options.concat({
                id: shortid.generate(),
                answer: "",
                correct: false
            })
        }));
    }

    removeOption(id) {
        this.setState(prevState => ({
            options: prevState.options.length > 2 ?
                prevState.options.filter(x => x.id !== id) :
                prevState.options
        }));
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleOptionChange(e) {
        this.setState({
            options: {
                ...this.state.options,
                [e.target.name]: e.target.value
            }
        });
    }

    render() {
        let options = "";
        let addOptionBtn = "";
        if (this.isMultipleChoice) {
            options = [];
            for (let k in this.state.options) {
                options.push(
                    <div key={k}>
                        <input
                        type="radio"
                        name="options"
                        value={k}
                        onClick={this.setCorrectAnswer}
                        defaultChecked={k === this.state.correctAnswerId ? true : false}
                    />
                    <input
                        type="text"
                        style={{padding: '5px 10px'}}
                        name={k}
                        onChange={this.handleOptionChange}
                        defaultValue={this.props.question.options.find(x =>
                           x.id === k
                        ).answer}
                    />
                    <input
                        type="button"
                        onClick={() => this.removeOption(k)}
                        value="Delete"
                    />
                    <br/><br/>
                    </div>
                );
            }

            addOptionBtn = (
                <div style={{ padding: '5px 0px 20px 0px' }}>
                    <button
                        type="button"
                        onClick={this.addOption}
                    >Add</button>
                </div>
            );
        }

        return (
            <div style={{padding: '10px 0px'}}>
                <textarea
                    rows='5'
                    cols='50'
                    name="body"
                    defaultValue={this.props.question.body}
                    onChange={this.handleChange}
                />
                {options}
                {addOptionBtn}
                <div style={{padding: '20px'}}>
                    <ActionButtons
                        isEditing={true}
                        onCancel={this.props.toggleEditForm}
                        onSaveClick={this.onSaveClick}
                    />
                </div>
            </div>
        );
    }
}

export default EditForm;
