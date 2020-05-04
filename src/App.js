import React, { Component } from 'react';
import { Offline } from 'react-detect-offline';
import InfoButton from './InfoButton';
import SearchTimeZone from './SearchTimeZone';
import AnalogClock from './AnalogClock';
import SelectedZones from './SelectedZones';
import latLngObject from './latLngObject';
import firebase from './firebase';
import showAlert from  './showAlert';
import zonePromise from './zonePromise';
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
    zonePromise(zoneName).then((result) => {
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
    ).catch(error=>{
      if(error){
        this.getTimeFromZone(zoneName);
      }
    })
  }
  addToFavorite = (event) => {
    event.preventDefault();
    if (!Object.keys(this.state.timeZone).length) {
      showAlert('info', 'Please Select a Zone or Country',2000);
    }
    if (Object.keys(this.state.timeZone).length) {
      const dbRef = firebase.database().ref();
      let flag = false;
      dbRef.on('value', (result) => {
        const data = result.val();
        if (data && Object.keys(data).length === 4) {
          flag = true;
          showAlert('warning', 'Max!!!', 2000);
        } else {
          for (let key in data) {
            if (data[key] === this.state.timeZone.zoneName) {
              flag = true;
            }
          }
        }
      })
      if(!flag && this.state.timeZone.zoneName){
        dbRef.push(this.state.timeZone.zoneName);
        showAlert('success', 'Added To Favorite',2000);
      }
    }
  }

  render(){
    return (
      <div className="App wrapper">
        <header>
          <InfoButton />
          <h1>World Clock</h1>
        </header>
        <main>
          <AnalogClock 
            timeProp={this.state.timeZone}
            coordinatesProp={this.state.coordinates}
            clockNumberProp='0'
          />
          <form action="" className="favorite-form">
            <button 
            className="favorite-button" 
            type="submit" 
            onClick={this.addToFavorite}
            aria-label="add to favorite">Add To Favorite</button>
          </form>
          <Offline><p className='offline'>You are offline.</p></Offline>
          <SearchTimeZone 
            userSelectionProp={this.updateUserSelection}
          />
          <h2 className="favorite-zone">Favorite Zones</h2>
          <SelectedZones />
        </main>
        <footer>
          <p>&copy; <a href="https://www.ranjodhsingh.ca">Ranjodh Singh</a>, 2020. Thanks for Clock Tutorial by Wesbos.</p>
        </footer>
      </div>
    );
  }
}


export default App;
