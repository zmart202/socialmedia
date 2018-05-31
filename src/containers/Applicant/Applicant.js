import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import Test from './Test/Test';

// const formattedSeconds = (sec) => {
//   Math.floor(sec / 60) +
//     ':' +
//   ('0' + sec % 60).slice(-2)
// }

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

    handleStopClick = () => {
        clearInterval(this.incrementer);
        this.setState({
          lastClearedIncrementer: this.incrementer
        });
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
                                    <p style={{color: 'purple'}}><strong>Best of luck!</strong></p>
                                    </div>
                                    <a onClick={this.changePageHandler} style={{backgroundColor: 'purple', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>START TEST NOW</a>
                            </div>;
        const test = <div style={{margin: '200px 300px', padding: '10px 30px 35px 30px', backgroundColor: '#cfcfd1', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                        <h1>BEGIN TESTING NOW</h1>
                        <h1 style={{color: 'red'}}>{this.formattedSeconds(this.state.secondsElapsed)}</h1>
                        <p style={{color: 'purple'}}><strong>Exercise A)</strong></p>

 <p>Please write an email to the customer based on the following details:
 
The customer's order was 30 minutes late because the delivery driver got a flat tire on the way to the event.  We were in contact with the customer throughout the process. The caterer is unwilling to offer any compensation to the customer because they feel that a flat tire is not their fault. In this case, ezCater would try to negotiate with both parties to reach an acceptable resolution.  Please write an email apologizing to the customer and offering them some kind of compensation. Do not take more than 10-15 minutes and simply craft what you feel leaves the customer feeling that they received excellent, 5-star customer service. Do not try to figure out what we would do, we want to know what YOU think is right. The sky's the limit.  Have fun and remember, we love our customers!</p>
                        <textarea type="text" placeholder="Place response here" ref='editQuestion1' rows='10' cols='110'/>
                        <p style={{color: 'purple'}}><strong>Exercise B)</strong></p>
 <p>One of our core values is to be "Insanely Helpful". Below is a copy of a real email we received when trying to have a new account set up with one of our vendors:
Hi Sallie,
The request to add a new user profile is complete. It appears your name may be spelled incorrectly, however we processed the request as it was. Please let us know if you need this corrected.
To download the software on your computer go to:
sampledownloadxyz.com
Thank you
XYZ Company
More information and user guides can be found on our website. </p>
 
<p>1) What is wrong with this email?</p>
<p>2) How would you write it? </p>
                        <textarea type="text" placeholder="Place response here" ref='editQuestion2' rows='10' cols='110' />
                        <div style={{marginTop: '20px'}}>
                        <Link onClick={this.handleStopClick} from='/applicant' to='finished' style={{backgroundColor: 'purple', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>SUBMIT</Link>
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