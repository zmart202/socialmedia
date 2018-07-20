import React from "react";
import _ from "lodash";
import "./Test.css";

import Question from "../../../components/Question";

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
    this.incrementer = setInterval(
      () =>
        this.setState({
          secondsElapsed: this.state.secondsElapsed + 1
        }),
      1000
    );
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
      let question = this.props.test.find(x => x.id === k);
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

    fetch(
      `http://localhost:4567/api/applicant/test-results/${this.props.id}`,
      options
    )
      .then(
        res => (res.status === 403 ? Promise.reject("Auth denied") : res.json())
      )
      .then(data => {
        if (!data.success) {
          return this.props.propagateError();
        }

        this.props.redirectToFinished();
      })
      .catch(err => console.error(err));
  };

  formattedSeconds = sec => {
    return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
  };

  render() {
    const test = this.props.test.map((x, i) => (
      <div key={x.id}>
        <Question question={x} index={i} handleChange={this.handleChange} />
      </div>
    ));

    return (
      <div className="testform">
        <h1 style={{ color: "purple", paddingBottom: "30px" }}>
          BEGIN TESTING NOW
        </h1>
        <h1 className="timer">
          {this.formattedSeconds(this.state.secondsElapsed)}
        </h1>
        {test}
        <div className="testformbtnarea">
          <a
            onClick={this.handleSubmit}
            className="testformbtn"
            style={{ color: "white" }}
          >
            SUBMIT
          </a>
        </div>
      </div>
    );
  }
}

export default Test;
