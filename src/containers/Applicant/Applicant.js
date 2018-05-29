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
            isLoading: true,
            isCompleted: false,
            isAuth: false,
            testTaker: {},
            buttonClicked: false,
            secondsElapsed: 0
        }
        this.incrementer = null;
    }

    componentDidMount() {
        const token = this.props.match.params.token;
        if (token === null) {
            this.props.history.push("/");
            return;
        }

        fetch(`http://localhost:4567/applicant/auth/${token}`)
        .then(res => {
            this.setState({ isLoading: false });
            return res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        }).then(data => {
            console.log("DATA:", data);
            return data.completed ?
                this.setState({ isCompleted: true }) :
                this.setState({
                    isAuth: true,
                    testTaker: data
                });
        }

        ).catch(err => console.error(err));
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

      finishedTest = () => {
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

        const welcomePage = <div style={{margin: '200px 500px', padding: '10px 30px 35px 30px', backgroundColor: '#cfcfd1', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                                <div style={{paddingBottom: '10px'}}>
                                    <p>Hey {this.state.testTaker.firstName}, thanks for showing iinterest in becoming a customer
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
                        <textarea type="text" placeholder="Place response here" ref='editQuestion1' rows='4' cols='50'/>
                        <p>Question 2</p>
                        <textarea type="text" placeholder="Place response here" ref='editQuestion2' rows='4' cols='50' />
                        <div style={{marginTop: '20px'}}>
                        <Link onClick={this.handleStopClick} from='/applicant' to='finished' style={{backgroundColor: '#6d6dc4', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>SUBMIT</Link>
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
