import React from 'react';
import _ from 'lodash';

import Question from '../../../components/Question';

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: {},
            secondsElapsed: props.secondsElapsed
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.incrementer = null;
    }

    componentDidMount() {
        this.incrementer = setInterval(() =>
            this.setState({
                secondsElapsed: this.state.secondsElapsed + 1
            })
        , 1000);
    }

    handleChange = e => {
        this.setState({
            answers: {
                ...this.state.answers,
                [e.target.name]: e.target.value
            }
        });
    };

    handleSubmit = () => {
        clearInterval(this.incrementer);

        const answerData = [];
        for (let k in this.state.answers) {
            let question = this.props.test.find(x =>
                x.id === k
            );
            if (question.type === "MULTIPLE_CHOICE") {
                question.correct = false;
                for (let x of question.options) {
                    if ((x.correct && x.answer) === this.state.answers[k]) {
                        question.correct = true;
                        break;
                    }
                }
            }
            answerData.push({
                ..._.omit(question, "id"),
                answer: this.state.answers[k]
            });
        }

        const options = {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                answerData,
                applicantId: this.props.applicant.id,
                secondsElapsed: this.state.secondsElapsed
            })
        };

        fetch(`http://localhost:4567/api/applicant/test-results/${this.props.id}`, options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            if (!data.success) {
                return this.props.propagateError();
            }

            this.props.redirectToFinished();
        }).catch(err => console.error(err));
    };

    formattedSeconds = sec => {
        return (Math.floor(sec / 60) +
          ':' +
        ('0' + sec % 60).slice(-2));
    };

    render() {
        const style = {
            submit: {
                backgroundColor: 'purple',
                textDecoration: 'none',
                color: 'white',
                padding: '10px',
                cursor: 'pointer',
                boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'
            }
        };

        const test = this.props.test.map((x, i) =>
            <div key={x.id}>
                <Question
                    question={x}
                    index={i}
                    handleChange={this.handleChange}
                />
            </div>
        );

        return (
            <div style={{margin: '200px 500px', padding: '10px 30px 35px 30px', backgroundColor: '#cfcfd1', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                <h1>BEGIN TESTING NOW</h1>
                <h1 style={{color: 'red'}}>{this.formattedSeconds(this.state.secondsElapsed)}</h1>
                {test}
                <a onClick={this.handleSubmit} style={style.submit}>SUBMIT</a>
            </div>
        );
    }
}

export default Test;
