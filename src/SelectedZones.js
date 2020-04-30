import React,{Component} from 'react';
import AnalogClock from './AnalogClock';
import axios from 'axios';

class SelectedZones extends Component{

    getTimeFromZone = () => {
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
            result.data.zones.forEach((zTime) => {
                for (let i = 0; i < this.state.selectedZoneList.length; i++) {
                    if ((zTime.zoneName).toUpperCase() === this.state.selectedZoneList[i].toUpperCase()) {
                        // console.log("zTime", zTime);
                        this.setState({
                            timeZone: zTime,
                        })
                        break;
                    }
                }
            })
        });
    }

    render(){
        return(
            <ul className="time-zone-list">
                <li>
                    <p>{this.props.locationProp}</p>
                    <div>
                        <AnalogClock
                            timeProp={this.props.timeZoneListProp}
                            clockNumberProp='1'
                        />
                    </div>
                </li>
            </ul>
        )
    }

}

export default SelectedZones;