import React,{Component} from 'react';

class SelectedZones extends Component{

    render(){
        return(
            <ul className="time-zone-list">
                <li>
                    <p>{this.props.locationProp}</p>
                    <div>
                        {this.props.itemProp}
                    </div>
                </li>
            </ul>
        )
    }

}

export default SelectedZones;