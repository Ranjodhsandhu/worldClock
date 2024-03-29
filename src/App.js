import React, { Component } from 'react';
import { Offline } from 'react-detect-offline';
import InfoButton from './Components/InfoButton';
import SearchTimeZone from './Components/SearchTimeZone';
import AnalogClock from './Components/AnalogClock';
import SelectedZones from './Components/SelectedZones';
import latLngObject from './Util/latLngObject';
import firebase from './Util/firebase';
import showAlert from  './Util/showAlert';
import zonePromise from './Util/zonePromise';
import './App.css';

const initialState = {
  timeZone: {},
  coordinates: '',
  selectedZoneList: [],
};
class App extends Component {
  constructor(){
    super();
    this.state = initialState
  }

  // This method is to update the user selection from the search list
  // @params: selection - user selected zone
  updateUserSelection = (selection)=>{
    let selectedZoneName = '';
    if(selection !== 'undefined')
      selectedZoneName =  selection.split(', ')[1];
    this.setState({
      selectedZoneList: [...this.state.selectedZoneList, selectedZoneName]
    })
    this.getTimeFromZone(selectedZoneName);
  }
  
  // Get the time zone from the timezonedb.com api
  // @params: zoneName
  getTimeFromZone = (zoneName) => {
    zonePromise(zoneName).then((result) => {
        let lat=0,lng=0;
        // get the lat lng from the object with given country code
        if(latLngObject.hasOwnProperty(result.data.countryCode))
        {
          lat = latLngObject[result.data.countryCode].Lat;
          lng = latLngObject[result.data.countryCode].Lng;
        }
        // update the timeZone and coordinates
        this.setState({
          timeZone: result.data,
          coordinates: `${lat},${lng}`
        })
      }
    ).catch(error=>{
      // if Network error try again to get the time for zone
      if(error){
        this.getTimeFromZone(zoneName);
      }
    })
  }

  // add the selected time zone to the favorite list
  // @params: event - to prevent page refresh
  addToFavorite = (event) => {
    event.preventDefault();
    // If the timeZone is not selected, display message
    if (!Object.keys(this.state.timeZone).length) {
      showAlert('info', 'Please Select a Zone or Country',2000);
    }
    // If the timeZone is selected
    if (Object.keys(this.state.timeZone).length) {
      
      // get Reference to Database
      const dbRef = firebase.database().ref();
      let flag = false;
      
      dbRef.on('value', (result) => {
        const data = result.val();
        // If there are already MAX FOUR items in the database
        if (data && Object.keys(data).length === 4) {
          flag = true;
          showAlert('warning', 'Max!!!', 2000);
        } else {
          // otherwise check for duplication
          for (let key in data) {
            if (data[key] === this.state.timeZone.zoneName) {
              flag = true;
            }
          }
        }
      })
      // If none of the above condition were true, add to database
      if(!flag && this.state.timeZone.zoneName){
        dbRef.push(this.state.timeZone.zoneName);
        showAlert('success', 'Added To Favorite',2000);
      }
    }
  }

  resetClock = (event)=>{
    event.preventDefault();
    this.setState(initialState);
  }
  // Show content on the page
  render(){
    return (
      <div className="App wrapper">
        <header>
          <InfoButton />
          <h1>World Clock</h1>
          <p className="description">Get time from anywhere in the Globe</p>
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
          <button 
            className="reset-button"
            type="button"
            onClick={this.resetClock}
            aria-label="reset">
            Reset
          </button>
          <Offline><p className='offline'>You are offline.</p></Offline>
          <SearchTimeZone 
            userSelectionProp={this.updateUserSelection}
          />
          <h2 className="favorite-zone">Favorite Zones</h2>
          <SelectedZones />
        </main>
        <footer>
          <p>&copy; <a href="https://www.ranjodhsandhu.com">Ranjodh Singh</a>, 2020.</p>
        </footer>
      </div>
    );
  }
}


export default App;
