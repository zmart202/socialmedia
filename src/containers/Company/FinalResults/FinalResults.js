import React from "react";
import Aux from "../../../hoc/Aux/Aux";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ResultsHeader from "./ResultsHeader";

class FinalResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      data: {},
      applicants: [],
      showMultipleChoice: false
    };
    this.ApplicantId = this.props.match.params.ApplicantId;
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.setState({
        isLoading: false,
        isError: true
      });
      return;
    }

    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    fetch(
      `http://localhost:4567/api/company/test-results/${this.ApplicantId}`,
      options
    )
      .then(
        res => (res.status === 403 ? Promise.reject("Auth denied") : res.json())
      )
      .then(data => {
        console.log("DATA FROM FINALRESULTS", data);
        this.setState({
          data,
          isLoading: false
        });
      })
      .catch(err => console.error(err));
  }

  formattedSeconds = sec => {
    return (
      Math.floor(sec / 60) +
      " minutes and " +
      ("0" + (sec % 60)).slice(-2) +
      " seconds"
    );
  };

  showMultipleChoiceHandler = () => {
    this.setState({ showMultipleChoice: !this.state.showMultipleChoice });
  };

  render() {
    let answerData = this.state.data.answerData;
    let allMCResponses = [];
    let correctMCResponses = [];
    let ORQuestionsArray = [];
    let multipleChoiceQuestions = null;
    let style;
    let MCButtonStyle = {
      cursor: "pointer",
      color: "blue",
      textDecoration: "underline"
    };
    let questionStyle = {
      backgroundColor: "#cfcfd1",
      margin: "10px 300px",
      boxShadow: "2px 2px 1px 0px rgba(0,0,0,0.75)",
      padding: "5px"
    };

    if (!answerData) {
      return null;
    } else {
      answerData.map(answer => {
        if (answer.type === "MULTIPLE_CHOICE") {
          allMCResponses.push(answer);

          if (answer.answer === "true") {
            correctMCResponses.push(answer);
          }
          return correctMCResponses;
        }

        return allMCResponses;
      });
      answerData.map(answer => {
        if (answer.type === "OPEN_RESPONSE") {
          ORQuestionsArray.push(answer);
        }

        return ORQuestionsArray;
      });
    }

    let openResponseQuestions = ORQuestionsArray.map(question => {
      return (
        <div key={question.body} style={questionStyle}>
          <h3>{question.body}</h3>
          <p>{question.answer}</p>
        </div>
      );
    });

    if (this.state.showMultipleChoice) {
      multipleChoiceQuestions = allMCResponses.map(question => {
        return (
          <div key={question.body}>
            <h3>{question.body}</h3>
            {question.options.map(option => {
              if (question.answer === option.answer && option.correct) {
                style = {
                  color: "green"
                };
              } else if (question.answer === option.answer && !option.correct) {
                style = {
                  color: "red"
                };
              }
              return (
                <div key={option.id} style={style}>
                  {option.answer}
                </div>
              );
            })}
          </div>
        );
      });
    }

    let multipleChoiceButton = this.state.showMultipleChoice ? (
      <a onClick={this.showMultipleChoiceHandler} style={MCButtonStyle}>
        Hide Multiple Choice Questions
      </a>
    ) : (
      <a onClick={this.showMultipleChoiceHandler} style={MCButtonStyle}>
        Show Multiple Choice Questions
      </a>
    );

    let MCScore = `(${correctMCResponses.length}/${
      allMCResponses.length
    }) of the multiple choice questions were answered correctly!`;

    if (this.state.isLoading) {
      return <Spinner />;
    }

    // let answers = this.state.data.answers;
    // let content = [];
    // for (let k in answers) {
    //     content.push(
    //         <div key={k}>
    //             <p>{this.state.data.test.questions.find(x =>
    //                 x.id === k
    //             ).body}:</p>
    //             <p><em>{answers[k]}</em></p>
    //         </div>
    //     );
    // }

    return (
      <Aux>
        <ResultsHeader ApplicantId={this.ApplicantId} />
        <h3 style={{ color: "purple" }}>
          Results for {this.state.data.firstName} {this.state.data.lastName}
        </h3>
        <h4 style={{ color: "purple" }}>
          Total amount of time taken is{" "}
          <span style={{ color: "red", textDecoration: "underline" }}>
            {this.formattedSeconds(this.state.data.secondsElapsed)}
          </span>
        </h4>
        <div style={questionStyle}>
          {MCScore}
          <br />
          {multipleChoiceQuestions}
          {multipleChoiceButton}
        </div>
        {openResponseQuestions}
      </Aux>
    );
  }
}

export default FinalResults;
