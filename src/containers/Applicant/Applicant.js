import React, { Component } from 'react';
//import Test from './Test/Test';

const formattedSeconds = (sec) => {
  Math.floor(sec / 60) +
    ':' +
  ('0' + sec % 60).slice(-2)
}

class Applicant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testTaker: [
                {
                    id: 1,
                    name: 'Zack',
                    question1: '',
                    question2: ''
                }
            ],
            buttonClicked: false,
            secondsElapsed: 0
        }
        this.incrementer = null;
    }

    changePageHandler = () => {
        this.setState({ buttonClicked: !this.state.buttonClicked})
        this.incrementer = setInterval( () =>
          this.setState({
            secondsElapsed: this.state.secondsElapsed + 1
          })
        , 1000);
    }

      formattedSeconds = (sec) => {
        return (Math.floor(sec / 60) +
          ':' +
        ('0' + sec % 60).slice(-2));
      }
    
    render () {
        const welcomePage = <div style={{margin: '200px 500px', padding: '10px 30px 35px 30px', backgroundColor: '#cfcfd1', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                                <div style={{paddingBottom: '10px'}}>
                                    <p>Hey {this.state.testTaker[0].name}, thanks for showing iinterest in becoming a customer
                        service ninja. We think you have the potential to be a great fit 
                        at our company. Before we can take this any further, we would like
                        you to respond to a couple questions. You only have 30 minutes
                        to finish all the questions upon the time you click “START TEST NOW”.</p>
                                    <p><strong>Best of luck!</strong></p>
                                    </div>
                                    <a onClick={this.changePageHandler} style={{backgroundColor: '#6d6dc4', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>START TEST NOW</a>
                            </div>;
        const test = <div style={{margin: '200px 500px', padding: '10px 30px 35px 30px', backgroundColor: '#cfcfd1', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                        <h1>BEGIN TESTING NOW</h1>
                        <h1 style={{color: 'red'}}>{this.formattedSeconds(this.state.secondsElapsed)}</h1>
                        <p>Question 1</p>
                        <textarea style={{padding: '20px 100px', textAlign: 'left'}}/>
                        <p>Question 2</p>
                        <textarea style={{padding: '20px 100px', textAlign: 'left'}} />
                        <div style={{marginTop: '20px'}}>
                        <a style={{backgroundColor: '#6d6dc4', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}} href='#'>SUBMIT</a>
                        </div>
                    </div>;
        let pageChoice = !this.state.buttonClicked ? welcomePage : test;
        return (
            <div>
                {pageChoice}
            </div>
        );
    }
}

export default Applicant;