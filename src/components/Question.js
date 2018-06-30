import React from 'react';

const Question = props => {
    let question = "";
    switch (props.question.type) {
        case "MULTIPLE_CHOICE":
            question = (
                <div>
                    <p style={{ color: 'purple' }}>Exercise {props.index + 1}</p>
                    <p>{props.question.body}</p>
                    {
                        props.question.options.map(x =>
                            <div key={x.id}>
                                <input
                                    type="radio"
                                    name={props.question.id}
                                    value={x.answer}
                                    onClick={props.handleChange}
                                />
                                <label htmlFor={x.id}>{x.answer}</label>
                            </div>
                        )
                    }
                </div>
            );
            break;
        case "OPEN_RESPONSE":
            question = (
                <div>
                    <p style={{ color: 'purple' }}>Exercise {props.index + 1}</p>
                    <p>{props.question.body}</p>
                        <textarea
                            type="text"
                            name={props.question.id}
                            placeholder="Place response here"
                            onChange={props.handleChange}
                            rows='10'
                            cols='110'
                        />
                 </div>
             );
             break;
          default:
              question = <p>Invalid question type</p>;
    }

    return (
        <div>
            {question}
        </div>
    );
};

export default Question;
