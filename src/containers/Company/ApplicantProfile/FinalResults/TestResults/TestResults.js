import React, { Component } from "react";
import { Link } from "react-router-dom";

import Aux from "../../../../hoc/Aux/Aux";

class TestResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMultipleChoice: false
    };
  }

  showMultipleChoiceHandler = () => {
    this.setState({ showMultipleChoice: !this.state.showMultipleChoice });
  };

  formattedSeconds = sec => {
    return (
      Math.floor(sec / 60) +
      " minutes and " +
      ("0" + (sec % 60)).slice(-2) +
      " seconds"
    );
  };

  render() {
    console.log(this.props.applicant.answerData);
    const correctMultipleChoiceAnswers = [];
    const allMultipleChoiceAnswers = [];

    // console.log(answerData);
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
        <h3 style={{ color: "purple" }}>
          Results for {this.props.applicant.firstName}{" "}
          {this.props.applicant.lastName}
        </h3>
        <h4 style={{ color: "purple" }}>
          Total amount of time taken is{" "}
          <span style={{ color: "red", textDecoration: "underline" }}>
            {this.formattedSeconds(this.props.applicant.secondsElapsed)}
          </span>
        </h4>
        {/* {content} */}
      </Aux>
    );
  }
}

export default TestResults;
