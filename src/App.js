import React, { Component } from 'react'; // react if from node_modules
import axios from 'axios';
import InfoButton from './InfoButton';
import SearchTimeZone from './SearchTimeZone';
import AnalogClock from './AnalogClock';
import SelectedZones from './SelectedZones';
import latLngObject from './latLngObject';
import firebase from './firebase';
import Swal from 'sweetalert2';
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
  addToFavorite = (event) => {
    event.preventDefault();
    if (!Object.keys(this.state.timeZone).length) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Select a Zone or Country',
        showConfirmButton: false,
        timer: 2000
      });
    }
    if (Object.keys(this.state.timeZone).length) {
      const dbRef = firebase.database().ref();
      let flag = false;
      dbRef.on('value', (result) => {
        const data = result.val();
        if(Object.keys(data).length === 4){
          flag = true;
          Swal.fire({
            icon: 'warning',
            title: 'Max Limit of Four Zones',
            showConfirmButton: false,
            timer: 2000
          })
        }else {
          for (let key in data) {
            if(data[key] === this.state.timeZone.zoneName){
              flag = true;
            }
          }
        }
      })
      
      if(!flag) {
        dbRef.push(this.state.timeZone.zoneName);
        Swal.fire({
          icon: 'success',
          title: 'Added To Favorite',
          showConfirmButton: false,
          timer: 2000
        })
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
            onClick={this.addToFavorite}>Add To Favorite</button>
          </form>
          <SearchTimeZone 
            userSelectionProp={this.updateUserSelection}
          />
          
          <SelectedZones />
        </main>
        <footer>
          <p>&copy; <a href="https://www.ranjodhsingh.ca">Ranjodh Singh</a>, 2020. Code <a href="https://github.com/Ranjodhsandhu/worldClock">here</a></p>
        </footer>
      </div>
    );
  }
}


export default App;
