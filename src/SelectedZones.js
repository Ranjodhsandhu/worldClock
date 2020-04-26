import React,{Component} from 'react';

class SelectedZones extends Component{

    render(){
        return(
            <ul className="time-zone-list">
                <li>
                    <p>{this.props.location}</p>
                    <div>
                        {this.props.item}
                    </div>
                </li>
            </ul>
        )
    }

}

export default SelectedZones;