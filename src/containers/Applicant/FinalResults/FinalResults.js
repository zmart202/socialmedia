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
            <h3 style={{color: 'purple'}}>Results for {props.applicant.fname} {props.applicant.lname}</h3>
            <h4 style={{color: 'purple'}}>Total amount of time taken is <span style={{color: 'red', textDecoration: 'underline'}}>{formattedSeconds(props.applicant.secondsElapsed)}</span></h4>
            <p>Exercise A:</p>
            <p><em>{props.applicant.question1}</em></p>
            <p>Exercise B:</p>
            <p><em>{props.applicant.question2}</em></p>
            <div style={{paddingTop: '20px'}}>
                <a onClick={props.modalClosed} style={{backgroundColor: '#6d6dc4', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', backgroundColor: 'purple'}}>BACK</a>
            </div>
        </Aux>
    );
};

export default finalResults;