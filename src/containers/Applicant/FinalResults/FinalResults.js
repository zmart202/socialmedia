import React from 'react';
import Aux from '../../../hoc/Aux/Aux';




const finalResults = (props) => {
    const formattedSeconds = (sec) => {
        return (Math.floor(sec / 60) +
          ' minutes ' +
        ('0' + sec % 60).slice(-2) + ' seconds');
      }
    return (
        <Aux>
            <h3>Results for {props.applicant.fname} {props.applicant.lname}</h3>
            <h4>Total amount of time taken is <span style={{color: 'red', textDecoration: 'underline'}}>{formattedSeconds(props.applicant.secondsElapsed)}</span></h4>
            <p>Question 1:</p>
            <p>{props.applicant.question1}</p>
            <p>Question 2:</p>
            <p>{props.applicant.question2}</p>
            <div style={{paddingTop: '20px'}}>
                <a onClick={props.modalClosed} style={{backgroundColor: '#6d6dc4', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>BACK</a>
            </div>
        </Aux>
    );
};

export default finalResults;