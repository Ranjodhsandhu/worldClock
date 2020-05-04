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
    getTimeFromZone = (zoneName) => {
        zonePromise(zoneName).then((result) => {
            let lat = 0, lng = 0;
            if (latLngObject.hasOwnProperty(result.data.countryCode)) {
                lat = latLngObject[result.data.countryCode].Lat;
                lng = latLngObject[result.data.countryCode].Lng;
            }
            const copyOfTimeZoneArray = [...this.state.timeZoneArray];
            const copyOfCoordinatesArray = [...this.state.coordinatesArray];

            let tzArray = copyOfTimeZoneArray.filter(z => z.zoneName !== result.data.zoneName );
            let cArray = copyOfCoordinatesArray.filter(z => z.zoneName !== result.data.zoneName);
            tzArray = [...tzArray, result.data];
            cArray = [...cArray, { zoneName: `${result.data.zoneName}`, latlng: `${lat},${lng}` }];
            this.setState({
                timeZoneArray: tzArray.sort(this.sortByZoneName),
                coordinatesArray: cArray.sort(this.sortByZoneName)
            })
        }).catch((error) => {
            if(error) {
                setDriftlessTimeout(() => this.getTimeFromZone(zoneName), 2000);
            }
        })
    }
    getZonesFromDatabase = ()=>{
        // set up the listener to firebase database
        const dbRef = firebase.database().ref();
        dbRef.on('value',(result) => {
            const data = result.val();
            const zoneArr = [];
            for (let key in data) {
                if(data[key] !== '' && data[key] !== undefined){
                    zoneArr.push({ zoneName: data[key], zoneId: key });
                }
            }
            let flag = 0;
            this.setState({
                zoneArray: zoneArr.sort(this.sortByZoneName)
            },()=> this.state.zoneArray.map((zone)=>{
                    setDriftlessTimeout(() => this.getTimeFromZone(zone.zoneName), (1200 * flag++));
                })
            )
        })
    }
    sortByZoneName = (a, b) => {
        if (a.zoneName < b.zoneName) {
        return -1;
    }
    if (a.zoneName > b.zoneName) {
        return 1;
    }
    return 0;
}
    deleteZone = (zoneId,zoneName) => {
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
                (this.state.timeZoneArray.length > 0)
                ? this.state.timeZoneArray.map((timeZone,idx)=>{
                    return(  
                        <li key={this.state.zoneArray[idx].zoneId}>
                            <FontAwesomeIcon 
                            icon={faTimes} 
                            onClick={() => 
                                this.state.online
                                    ? this.deleteZone(this.state.zoneArray[idx].zoneId, this.state.zoneArray[idx].zoneName) 
                                : showAlert('warning','No Connection')
                                }
                            className="times-icon"/>
                            <div>
                                <AnalogClock
                                    timeProp={timeZone}
                                    coordinatesProp={this.state.coordinatesArray[idx].latlng}
                                    clockNumberProp={idx+1}
                                />
                            </div>
                        </li>
                    )
                })
                : <li><p className="empty-list">Select Zone or Country to add to Favorite List</p></li>
                }

            </ul>
        )
    }

}

export default SelectedZones;