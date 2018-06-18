import React from 'react';

const QuestionType = (props) => {
    return (
        <div style={{paddingBottom: '10px'}}>
            <form onSubmit={props.handleSubmit}>
                <select value={props.value} onChange={props.handleChange}>
                    <option value="None">Select Question Type</option>
                    <option value="Open Response">Open Response</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                </select>
                <input type="submit" value="Choose" />
            </form>
        </div>
    );
}

export default QuestionType;