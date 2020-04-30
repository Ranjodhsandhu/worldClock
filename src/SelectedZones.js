import React,{Component} from 'react';
import AnalogClock from './AnalogClock';
import axios from 'axios';
import firebase from './firebase';
import latLngObject from './latLngObject';
import { setDriftlessTimeout } from 'driftless';
class SelectedZones extends Component{

    constructor(){
        super();
        this.state = {
            timeZoneArray:[],
            coordinatesArray:[],
        }
    }
    componentDidMount(){
        this.getZonesFromDatabase();
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
            let lat = 0, lng = 0;
            if (latLngObject.hasOwnProperty(result.data.countryCode)) {
                lat = latLngObject[result.data.countryCode].Lat;
                lng = latLngObject[result.data.countryCode].Lng;
            }
            this.setState({
                timeZoneArray: [...this.state.timeZoneArray, result.data],
                coordinatesArray: [...this.state.coordinatesArray,`${lat},${lng}`]
            })
        }
        )
    }
    getZonesFromDatabase = ()=>{
        // set up the listener to firebase database
        const dbRef = firebase.database().ref();
        dbRef.on('value',(result) => {
            const data = result.val();
            // convert data object into the array
            const zoneArr = [];
            let flag = 0;
            for (let key in data) {
                zoneArr.push({ zoneName: data[key], zoneId: key });
                setDriftlessTimeout(()=>this.getTimeFromZone(data[key]),(1100 * flag++));
            }
        })
    }
    render(){

        return(
            <ul className="time-zone-list">
                {this.state.timeZoneArray.map((timeZone,idx)=>{
                    return(  
                        <li key={idx}>
                            {<button type="button" onClick={()=>console.log('Wanna delete me',idx+1)}style={{padding:`10px`}}>Delete me!</button>}
                            <div>
                                <AnalogClock
                                    timeProp={timeZone}
                                    coordinatesProp={this.state.coordinatesArray[idx]}
                                    clockNumberProp={idx+1}
                                />
                            </div>
                        </li>
                    )
                })
                }
            </ul>
        )
    }

}

export default SelectedZones;