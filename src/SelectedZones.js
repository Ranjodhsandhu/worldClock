import React,{Component} from 'react';
import AnalogClock from './AnalogClock';

class SelectedZones extends Component{

    render(){
        return(
            <ul className="time-zone-list">
                <li>
                    <p>{this.props.locationProp}</p>
                    <div>
                        <AnalogClock
                            timeProp={this.props.timeZoneProp}
                            clockNumberProp={this.props.clockNumberProp}
                        />
                    </div>
                </li>
            </ul>
        )
    }

}

export default SelectedZones;