import React from 'react';

const welcomePage = (props) => {
    return (<div style={{margin: '200px 500px', padding: '10px 30px 35px 30px', backgroundColor: '#cfcfd1', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                    <div style={{paddingBottom: '10px'}}>
                        <p>Hey {this.props.name}, thanks for showing iinterest in becoming a customer
            service ninja. We think you have the potential to be a great fit 
            at our company. Before we can take this any further, we would like
            you to respond to a couple questions. You only have 30 minutes
            to finish all the questions upon the time you click “START TEST NOW”.</p>
                        <p><strong>Best of luck!</strong></p>
                        </div>
                        <a onClick={this.changePageHandler} style={{backgroundColor: '#6d6dc4', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'}}>START TEST NOW</a>
            </div>);
}

export default welcomePage;