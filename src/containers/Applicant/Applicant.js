import React, { Component } from 'react';
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
            isLoading: true,
            isCompleted: false,
            isAuth: false,
            isError: false,
            testTaker: {},
            buttonClicked: false,
            secondsElapsed: 0
        }
        this.incrementer = null;
        this.token = this.props.match.params.token;
    }

    componentDidMount() {
        if (!this.token) {
            this.props.history.push("/");
            return;
        }

        fetch(`https://decisiontime.herokuapp.com/api/applicant/auth/${this.token}`)
        .then(res => {
            this.setState({ isLoading: false });
            return res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        }).then(data => {
            if (data.completed) {
                this.setState({
                    isAuth: true,
                    isCompleted: true
                });
            } else if (data.testTimestamp) {
                const parsedDate = Date.parse(data.testTimestamp);
                this.setState({
                    secondsElapsed: Math.floor((new Date() - parsedDate) / 1000),
                    isAuth: true,
                    testTaker: data
                }, this.changePageHandler);
            } else {
                this.setState({
                    isAuth: true,
                    testTaker: data
                });
            }
        }).catch(err => console.error(err));
    }

    startTest = () => {
        if (!this.token) {
            this.props.history.push("/");
            return;
        }

        fetch(`https://decisiontime.herokuapp.com/api/applicant/test-timestamp/${this.token}`)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            this.changePageHandler();
        }).catch(err => console.error(err));
    }

    changePageHandler = () => {
        this.setState({ buttonClicked: !this.state.buttonClicked})
        this.incrementer = setInterval( () =>
          this.setState({
            secondsElapsed: this.state.secondsElapsed + 1
          })
        , 1000);
    }

    handleSubmit = () => {
        clearInterval(this.incrementer);
        this.setState({
            lastClearedIncrementer: this.incrementer
        });

        const options = {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                applicantId: this.state.testTaker.id,
                secondsElapsed: this.state.secondsElapsed,
                answer1: this.refs.editQuestion1.value,
                answer2: this.refs.editQuestion2.value
            })
        };

        fetch(`https://decisiontime.herokuapp.com/api/applicant/test-results/${this.token}`, options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            if (!data.success) {
                return this.setState({ isError: true });
            }

            this.props.history.push("/finished");
        }).catch(err => console.error(err));
    }

    formattedSeconds = (sec) => {
        return (Math.floor(sec / 60) +
          ':' +
        ('0' + sec % 60).slice(-2));
      }

    render () {
        if (this.state.isLoading) {
            return <p>We are loading...</p>;
        }

        if (!this.state.isAuth) {
            return <p>Invalid token</p>;
        }

        if (this.state.isCompleted) {
            return <p>You have already completed the test!</p>;
        }

        const welcomePage = <div style={{textAlign: 'center', margin: '200px 500px', padding: '10px 30px 35px 30px', backgroundColor: '#cfcfd1', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                                <div style={{paddingBottom: '10px'}}>
                                    <p>Hey {this.state.testTaker.firstName}, thanks for showing iinterest in becoming a customer
                        service ninja. We think you have the potential to be a great fit
                        at our company. Before we can take this any further, we would like
                        you to respond to a couple questions. You only have 30 minutes
                        to finish all the questions upon the time you click “START TEST NOW”.</p>
                                    <p style={{color: 'purple'}}><strong>Best of luck!</strong></p>
                                    </div>
                                    <a onClick={this.startTest.bind(this)} style={{backgroundColor: 'purple', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>START TEST NOW</a>
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
                        <a onClick={this.handleSubmit.bind(this)} style={{backgroundColor: 'purple', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>SUBMIT</a>
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
