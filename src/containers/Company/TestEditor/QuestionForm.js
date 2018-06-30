import React, {Component} from 'react';
import shortid from 'shortid';

class QuestionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            body: "",
            type: "OPEN_RESPONSE",
            options: [
                {
                    id: shortid.generate(),
                    answer: "",
                    correct: true
                },
                {
                    id: shortid.generate(),
                    answer: "",
                    correct: false
                }
            ],
            correctAnswerId: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.addOption = this.addOption.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    removeOption(id) {
        this.setState(prevState => ({
            options: prevState.options.length > 2 ?
                prevState.options.filter(x => x.id !== id) :
                prevState.options
        }));
    }

    addOption() {
        this.setState(prevState => ({
            options: prevState.options.concat({
                id: shortid.generate(),
                answer: "",
                correct: false,
                removable: true
            })
        }));
    }

    handleSubmit(e) {
        e.preventDefault();

        const options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.props.token}`
            },
            method: "POST"
        };

        const body = {
            questionId: shortid.generate(),
            testId: this.props.testId,
            body: this.state.body,
            type: this.state.type
        };

        switch (this.state.type) {
            case "OPEN_RESPONSE":
                options.body = JSON.stringify(body);
                break;
            case "MULTIPLE_CHOICE":
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
                break;
            default:
                console.error("Submitted invalid question type");
        }

        fetch("http://localhost:4567/api/company/create-question", options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.props.refreshTestData();
            this.props.toggleQuestionForm();
        }).catch(err => console.error(err));
    }

    render() {
        let options = "";
        let addOptionBtn = "";
        if (this.state.type === "MULTIPLE_CHOICE") {
            options = this.state.options.map(x =>
                <div key={x.id}>
                    <input
                        type="radio"
                        name="correctAnswerId"
                        value={x.id}
                        onClick={this.handleChange}
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
                <button
                    type="button"
                    onClick={this.addOption}
                >Add Option</button>
            );
        }

        return (
            <div>
                <form>
                    <h3>Question Type:</h3>
                    <select name="type" value={this.state.type} onChange={this.handleChange}>
                        <option value="OPEN_RESPONSE">Open Response</option>
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    </select>
                    <br/>
                    <h3>Question Body:</h3>
                    <textarea
                        cols="100"
                        rows="5"
                        name="body"
                        onChange={this.handleChange}
                        placeholder="write question here"
                    />
                    <br />
                    {options}
                    {addOptionBtn}
                    <br/><br/>
                    <span>
                        <button type="button" onClick={this.handleSubmit}>Create</button>
                        <button type="button" onClick={this.props.toggleQuestionForm}>Cancel</button>
                    </span>
                </form>
            </div>
        );
    }
}

export default QuestionForm;
