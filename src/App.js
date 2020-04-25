import React, { Component } from 'react'; // react if from node_modules
import AnalogClock from './AnalogClock';
import './App.css';

class App extends Component {
  // constructor(){
  //   super();
  // }

  render(){
    return (
      <div className="App">
        <h1>World Clock</h1>

          <AnalogClock 
          time={new Date()
            // 'Sat Apr 25 2020 15:30:00 GMT-0400 (Eastern Daylight Time)'
          }
          clockNumber='1'
        />
      </div>
    );
  }
}


export default App;
