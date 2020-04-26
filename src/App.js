import React, { Component } from 'react'; // react if from node_modules
import axios from 'axios';
import InfoButton from './InfoButton';
import SearchTimeZone from './SearchTimeZone';
import AnalogClock from './AnalogClock';
import SelectedZones from './SelectedZones';

import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      publicIp: '0.0.0.0',
      time: new Date(),
      userSelection:''
    }
  }

  updateUserSelection = (selection)=>{
    this.setState({
      userSelection:selection
    })
    console.log(this.state.userSelection);
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
        <InfoButton />
        <h1>World Clock</h1>

          <AnalogClock 
          time={ 
            this.state.time.toString()
          }
          clockNumber='1'
          location="Ontario"
        />
        <SearchTimeZone 
          userSelectionProp={this.updateUserSelection}
        />
        <SelectedZones
          item={<AnalogClock time='Sun Apr 26 2020 17:11: GMT-0400 (Eastern Daylight Time)'
          clockNumber='2'
          />} 
          location="British Colombia"
          >
        </SelectedZones>
      </div>
    );
  }
}


export default App;
