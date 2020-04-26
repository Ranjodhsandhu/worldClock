import React,{Component} from 'react';

class InfoButton extends Component{
    render(){
        return(
            <div className="info-container">
                <div className="info-outer">
                <div className="info-inner">
                    <span>i</span>
                    <h3>
                        World Clock
                    </h3>
                    <p>
                        You can get time from around the world within a time zone and get to add into your list with modified name.
                    </p>
                </div>
                </div>
            </div>
        )
    }
}

export default InfoButton;