import React, {Component} from 'react';
import _ from 'lodash';
import IndividualQuestion from './IndividualQuestion/IndividualQuestion';

class QuestionList extends Component {
    renderQuestions = () => {
        let questions = this.props.questions;
        const props = _.omit(this.props, 'questions');
        return questions
            .map((question, i) =>
            <IndividualQuestion question={question}
                                key={question.id}
                                index={i}
                                token={props.token}
                                deleteQuestionInState={props.deleteQuestionInState}
                                createQuestionInState={props.createQuestionInState}
                                editQuestionInState={props.editQuestionInState}
                                refreshTestData={props.refreshTestData}
                                testId={props.testId}/>


        );
    }

    render() {
        return (
            <div>
                {this.renderQuestions()}
            </div>
        )
    }
}

export default QuestionList;
