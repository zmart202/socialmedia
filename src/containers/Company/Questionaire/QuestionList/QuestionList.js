import React, {Component} from 'react';
import _ from 'lodash';
import IndividualQuestion from './IndividualQuestion/IndividualQuestion';

class QuestionList extends Component {
    renderQuestions = () => {
        let questions = this.props.questions;
        const props = _.omit(this.props, 'questions');
        return questions
            .map((question) => 
            <IndividualQuestion question={question}
                                key={question.key}
                                delete={() => props.deleteQuestionHandler(question)} />

            
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