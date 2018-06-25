import React, {Component} from 'react';
import shortid from 'shortid';

import ActionButtons from '../../../components/UI/Buttons/ActionButtons';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionType: props.question.type,
            options: props.question.options,
            correctAnswerId: props.question.type === "MULTIPLE_CHOICE" ?
              props.question.options.find(x => x.correct) ?
              props.question.options.find(x => x.correct).id : null
              : null
        };

        this.onSaveClick = this.onSaveClick.bind(this);
        this.setCorrectAnswer = this.setCorrectAnswer.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.addOption = this.addOption.bind(this);
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
            body: this.refs.body.value,
            questionId: this.props.question.id,
            testId: this.props.testId
        };

        if (this.props.question.type === "MULTIPLE_CHOICE") {
            options.body = JSON.stringify({
                ...body,
                options: this.state.options.filter(x =>
                    this.refs[x.id].value.length > 0
                ).map(x => ({
                    ...x,
                    answer: this.refs[x.id].value,
                    correct: x.id === this.state.correctAnswerId ? true : false
                }))
            });
        } else {
            options.body = JSON.stringify(body);
        }

        fetch("http://localhost:4567/api/company/edit-question", options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.props.refreshTestData();
            this.props.toggleEditForm();
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

    render() {
        let options = "";
        let addOptionBtn = "";
        if (this.props.question.type === "MULTIPLE_CHOICE") {
            options = this.state.options.map(x =>
                <div key={x.id}>
                    <input
                        type="radio"
                        name="options"
                        value={x.id}
                        onClick={this.setCorrectAnswer}
                        defaultChecked={x.id === this.state.correctAnswerId ? true : false}
                    />
                    <input
                        type="text"
                        style={{padding: '5px 10px'}}
                        ref={x.id}
                        defaultValue={x.answer}
                    />
                    <input
                        type="button"
                        onClick={() => this.removeOption(x.id)}
                        value="Delete"
                    />
                    <br/><br/>
                </div>
            );

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
                    defaultValue={this.props.question.body}
                    ref='body'
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
