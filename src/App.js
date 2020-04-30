import React, { Component } from 'react'; // react if from node_modules
import axios from 'axios';
import InfoButton from './InfoButton';
import SearchTimeZone from './SearchTimeZone';
import AnalogClock from './AnalogClock';
import SelectedZones from './SelectedZones';
import latLngObject from './latLngObject';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      timeZone: {},
      coordinates:'',
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
    this.getTimeFromZone(selectedZoneName);
  }


  getTimeFromZone = (zoneName) => {
    axios({
      url: 'https://api.timezonedb.com/v2.1/get-time-zone',
      method: 'GET',
      responseType: 'json',
      params: {
        key: '16OZ7ZU6JZBK',
        format: 'json',
        by: 'zone',
        zone: zoneName,
        fields: 'zoneName,gmtOffset,timestamp,countryName,countryCode',
      }
    }).then((result) => {
        let lat=0,lng=0;
        if(latLngObject.hasOwnProperty(result.data.countryCode))
        {
          lat = latLngObject[result.data.countryCode].Lat;
          lng = latLngObject[result.data.countryCode].Lng;
        }
        this.setState({
          timeZone: result.data,
          coordinates: `${lat},${lng}`
        })
      }
    )
  }
  

  render(){
    // console.log(this.state.timeZone);
    return (
      <div className="App wrapper">
        <InfoButton />
        <h1>World Clock</h1>
          <AnalogClock 
            timeProp={this.state.timeZone}
            coordinatesProp={this.state.coordinates}
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
