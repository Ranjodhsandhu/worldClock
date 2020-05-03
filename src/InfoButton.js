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
                        Get time from around the world with a zone or country name. Add to your favorite list for future use.
                    </p>
                </div>
                </div>
            </div>
        )
    }
}

export default InfoButton;