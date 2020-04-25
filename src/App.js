import React, { Component } from 'react'; // react if from node_modules
import axios from 'axios';
import SearchTimeZone from './SearchTimeZone';
import AnalogClock from './AnalogClock';

import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      publicIp: '0.0.0.0',
      time: new Date()
    }
  }

  componentDidMount(){
    this.getTimeFromIp();
  }

  getTimeFromIp = ()=>{
    axios({
      url: 'https://api.ipify.org/?format=json',
      method: 'GET',
      responseType: 'json'
    }).then((publicAddress) => {
      const ipAddress = publicAddress.data.ip;
      axios({
        url: `https://worldtimeapi.org/api/ip/${ipAddress}`,
        method: 'GET',
        responseType: 'json'
      }).then((resultTime) => {
        this.setState({
          publicIp: publicAddress.data.ip,
          time: new Date(resultTime.data.datetime)
        })
      })
    })
  }

  render(){
    return (
      <div className="App">
        <h1>World Clock</h1>
          <AnalogClock 
          time={ 
            this.state.time.toString()
          }
          clockNumber='1'
        />
        <SearchTimeZone />
      </div>
    );
  }
}


export default App;
