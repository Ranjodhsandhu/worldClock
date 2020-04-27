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
      timeFromIP: new Date(),
      timeFromZone: new Date(),
      userSelection:''
    }
  }
  componentDidMount(){
    // this.getTimeFromIp();
  }

  updateUserSelection = (selection)=>{
    let selectedZoneName = '';
    if(selection !== undefined)
      selectedZoneName =  selection.split(', ')[1];
  
    this.setState({
      userSelection:selectedZoneName
    })
    if(this.state.userSelection !== ''){
      this.getTimeFromZone();
    }
  }

  getTimeFromZone = ()=>{
    axios({
      url: 'http://api.timezonedb.com/v2.1/get-time-zone',
      method: 'GET',
      responseType: 'json',
      params:{
        key:'16OZ7ZU6JZBK',
        format:'json',
        by:'zone',
        zone:this.state.userSelection
      }
    }).then((resultTime) => {
        const actualTime = resultTime.data.formatted;
        this.setState({
          timeFromZone: new Date(actualTime),
        })
      })
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
          timeFromIp: resultTime.data.datetime
        })
      })
    })
  }

  render(){
    // let timeClock2 = 'Mon Apr 27 2020 17:11:12 GMT-0400 (Eastern Daylight Time)';
    console.log(this.state.timeFromZone);
    return (
      <div className="App wrapper">
        <InfoButton />
        <h1>World Clock</h1>
          <AnalogClock 
          timeProp={new Date()}//this.state.timeFromIp)}
          clockNumberProp='1'
        />
        <SearchTimeZone 
          userSelectionProp={this.updateUserSelection}
        />
        {this.state.userSelection !== '' 
        ? 
        <SelectedZones
          itemProp={
            <AnalogClock 
              timeProp={new Date(this.state.timeFromZone)}
              clockNumberProp='2'
            />
          } 
          locationProp="British Colombia"
          >
        </SelectedZones>
        :<SelectedZones />
        }
      </div>
    );
  }
}


export default App;
