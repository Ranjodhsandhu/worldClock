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
                        Get time from around the world with a zone and country name and get to add into your favorite list.
                    </p>
                </div>
                </div>
            </div>
        )
    }
}

export default InfoButton;