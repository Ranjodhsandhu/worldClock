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

            const tzArray = copyOfTimeZoneArray.filter(z => z.zoneName !== result.data.zoneName );
            const cArray = copyOfCoordinatesArray.filter(z => z.zoneName !== result.data.zoneName);

            this.setState({
                timeZoneArray: [...tzArray, result.data],
                coordinatesArray: [...cArray,{zoneName:`${result.data.zoneName}`,latlng:`${lat},${lng}`}]
            })
        }
        )
    }
    getZonesFromDatabase = ()=>{
        // set up the listener to firebase database
        const dbRef = firebase.database().ref();
        dbRef.child('.info/connected').on('value',(connectedSnap) =>{
            if (connectedSnap.val() === true) {
                dbRef.on('value',(result) => {
                    const data = result.val();
                    const zoneArr = [];
                    let flag = 0;
                    for (let key in data) {
                        if(data[key] !== '' && data[key] !== undefined){
                            zoneArr.push({ zoneName: data[key], zoneId: key });
                            setDriftlessTimeout(()=>this.getTimeFromZone(data[key]),(1200 * flag++));
                        }
                    }
                    this.setState({
                        zoneArray:zoneArr
                    })
                })
            }
        });
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
                    timeZoneArray: tzArray,
                    coordinatesArray:cArray,
                    zoneArray:zArray,
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
                this.state.timeZoneArray.length > 0
                ? this.state.timeZoneArray.map((timeZone,idx)=>{
                    return(  
                        <li key={this.state.zoneArray[idx].zoneId}>
                            {<FontAwesomeIcon 
                            icon={faTimes} 
                            onClick={() => 
                                this.deleteZone(this.state.zoneArray[idx].zoneId,timeZone.zoneName) 
                                }
                            className="times-icon"/>}
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