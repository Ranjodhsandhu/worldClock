import React,{Component} from 'react';
import AnalogClock from './AnalogClock';
import zonePromise from './zonePromise';
import firebase from './firebase';
import latLngObject from './latLngObject';
import { setDriftlessTimeout } from 'driftless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/fontawesome-free-solid';
import Swal from 'sweetalert2';
import showAlert from  './showAlert';

// Show the selected zones on the page from database 
class SelectedZones extends Component{

    constructor(){
        super();
        this.state = {
            zoneArray:[],
            timeZoneArray:[],
            coordinatesArray:[],
            online:true
        }
    }
    componentDidMount(){
        this.getZonesFromDatabase();
    }
    // this method gets time zone from timezonedb.com api
    // @params: zoneName - for which data to fetch from api
    getTimeFromZone = (zoneName) => {
        zonePromise(zoneName).then((result) => {
            let lat = 0, lng = 0;
            // get coordinates for the zone to center map on
            if (latLngObject.hasOwnProperty(result.data.countryCode)) {
                lat = latLngObject[result.data.countryCode].Lat;
                lng = latLngObject[result.data.countryCode].Lng;
            }
            const copyOfTimeZoneArray = [...this.state.timeZoneArray];
            const copyOfCoordinatesArray = [...this.state.coordinatesArray];
            // check for duplicate values
            let tzArray = copyOfTimeZoneArray.filter(z => z.zoneName !== result.data.zoneName );
            let cArray = copyOfCoordinatesArray.filter(z => z.zoneName !== result.data.zoneName);
            // then combine the new time zone
            tzArray = [...tzArray, result.data];
            cArray = [...cArray, { zoneName: `${result.data.zoneName}`, latlng: `${lat},${lng}` }];
            // update the state by sorting arrays
            this.setState({
                timeZoneArray: tzArray.sort(this.sortByZoneName),
                coordinatesArray: cArray.sort(this.sortByZoneName)
            })
        }).catch((error) => {
            // if network error call api again to get data
            if(error) {
                setDriftlessTimeout(() => this.getTimeFromZone(zoneName), 2000);
            }
        })
    }

    // get the saved values from the database if any
    getZonesFromDatabase = ()=>{
        // set up the listener to firebase database
        const dbRef = firebase.database().ref();
        // setup listener to get value on database modification
        dbRef.on('value',(result) => {
            const data = result.val();
            const zoneArr = [];
            for (let key in data) {
                if(data[key] !== '' && data[key] !== undefined){
                    zoneArr.push({ zoneName: data[key], zoneId: key });
                }
            }
            // update the zone array with sorted values and call api to get time for each zone
            let flag = 0;
            this.setState({
                zoneArray: zoneArr.sort(this.sortByZoneName)
            },()=> this.state.zoneArray.map((zone)=>{
                    setDriftlessTimeout(() => this.getTimeFromZone(zone.zoneName), (1200 * flag++));
                })
            )
        })
    }
    // method to sort an object by its zone name
    // @params: a,b - objects from the objects array
    sortByZoneName = (a, b) => {
        if (a.zoneName < b.zoneName) {
            return -1;
        }
        if (a.zoneName > b.zoneName) {
            return 1;
        }
        return 0;
    }
    // delete a zone with given zone id
    // @params: zoneId, zoneName
    deleteZone = (zoneId,zoneName) => {
        // ask for user confirmation to delete
        Swal.fire({
            title: `<pre>Are you sure?</pre>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass:{
                popup:'show-alert'
            }
        }).then((result) => {
            // on acceptance delete from database and state
            if (result.value) {
                const copyOfZoneArray = [...this.state.zoneArray];
                const copyOfTimeZoneArray = [...this.state.timeZoneArray];
                const copyOfCoordinatesArray = [...this.state.coordinatesArray];

                const tzArray = copyOfTimeZoneArray.filter((z)=>{return z.zoneName !== zoneName});
                const cArray = copyOfCoordinatesArray.filter(c=>{return c.zoneName !== zoneName});
                const zArray = copyOfZoneArray.filter((z)=>{return z.zoneId !== zoneId});

                this.setState({
                    timeZoneArray: tzArray.sort(this.sortByZoneName),
                    coordinatesArray: cArray.sort(this.sortByZoneName),
                    zoneArray: zArray.sort(this.sortByZoneName),
                },()=>{
                    // show success message on deletion
                    showAlert('success','Deleting...',3000);
                    const itemRef = firebase.database().ref(zoneId);
                    itemRef.remove();
                });
            
            }
        })
    }

    render(){
        return(
            <ul className="time-zone-list">
                {
                // check if any zone in to show
                (this.state.timeZoneArray.length > 0)
                // map over each zone value to display it on page
                ? this.state.timeZoneArray.map((timeZone,idx)=>{
                    return(  
                        <li key={this.state.zoneArray[idx].zoneId}>
                            <button 
                            // button to delete the current zone 
                                onClick={() =>
                                    this.state.online
                                    ? this.deleteZone(this.state.zoneArray[idx].zoneId, this.state.zoneArray[idx].zoneName)
                                    : showAlert('warning', 'No Connection')
                                }
                                className="times-icon"
                                aria-label="delete clock">
                                <FontAwesomeIcon 
                                    icon={faTimes} 
                                />
                            </button>
                            <div>
                                {/* get the analog clock to show with corresponding props */}
                                <AnalogClock
                                    timeProp={timeZone}
                                    coordinatesProp={this.state.coordinatesArray[idx].latlng}
                                    clockNumberProp={idx+1}
                                />
                            </div>
                        </li>
                    )
                })
                // if list is empty show helpful message
                : <li><p className="empty-list">Select Zone or Country to add to Favorite List</p></li>
                }
            </ul>
        )
    }

}

export default SelectedZones;