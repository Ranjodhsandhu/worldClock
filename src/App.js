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
      timeZone: {},
      selectedZoneList:[],
    }
  }

  updateUserSelection = (selection)=>{
    let selectedZoneName = '';
    if(selection !== 'undefined')
      selectedZoneName =  selection.split(', ')[1];
    this.setState({
      selectedZoneList: [...this.state.selectedZoneList, selectedZoneName]
    })
    this.getTimeFromZone();
  }

  getTimeFromZone = ()=>{
    axios({
        url: 'https://api.timezonedb.com/v2.1/list-time-zone',
        method: 'GET',
        responseType: 'json',
        params: {
          key: '16OZ7ZU6JZBK',
          format: 'json',
          fields: 'zoneName,gmtOffset,timestamp'
        }
      }).then((result) => {
        result.data.zones.forEach((zTime)=>{
          for(let i = 0; i < this.state.selectedZoneList.length; i++){
            if ((zTime.zoneName).toUpperCase() === this.state.selectedZoneList[i].toUpperCase()) { 
              // console.log("zTime", zTime);
              this.setState({
                timeZone : zTime,
              })
              break;
            }
          }
        })
      });
  }
  

  render(){
    // console.log(this.state.timeZone);
    return (
      <div className="App wrapper">
        <InfoButton />
        <h1>World Clock</h1>
          <AnalogClock 
            timeProp={this.state.timeZone}
            clockNumberProp='0'
          />
        <SearchTimeZone 
          userSelectionProp={this.updateUserSelection}
        />
        
        <SelectedZones 
          timeZoneProp = {new Date()}
          clockNumberProp = '1'
        />
      </div>
    );
  }
}


export default App;
