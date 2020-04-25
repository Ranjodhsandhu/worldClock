import React,{Component} from 'react';

class AnalogClock extends Component {

    constructor(){
        super();
        this.state = {
            seconds:0,
            mins:0,
            hours:0,
        }
    }
    
    componentDidMount() {
        this.setDate();
        setInterval(()=>{
            this.updateTime(1);
        }, 1000);
    }
    setDate = () => {
        let now = new Date(this.props.time);
        this.setState({
            seconds: now.getSeconds(),
            mins: now.getMinutes(),
            hours: now.getHours(),
        })
    }
    updateTime = (secs) => {
        const sDegrees = ((this.state.seconds / 60) * 360) + 90;
        const mDegrees = ((this.state.mins / 60) * 360) + ((this.state.seconds / 60) * 6) + 90;
        const hDegrees = ((this.state.hours / 12) * 360) + ((this.state.mins / 60) * 30) + 90;

        const clockNumber = this.props.clockNumber - 1;

        // if(sDegrees === 90){
        //     document.getElementsByClassName('second-hand')[clockNumber].style.transition = `none`;
        // }else{
        //     document.getElementsByClassName('second-hand')[clockNumber].style.transition = `all 1s linear`;
        // }

        document.getElementsByClassName('second-hand')[clockNumber].style.transform = `rotate(${sDegrees}deg)`
        
        document.getElementsByClassName('min-hand')[clockNumber].style.transform = `rotate(${mDegrees}deg)`
        
        document.getElementsByClassName('hour-hand')[clockNumber].style.transform = `rotate(${hDegrees}deg)`
        
        if(this.state.hours >= 6 && this.state.hours < 18){
            document.getElementsByClassName('clock')[clockNumber].style.background = `rgba(255,255,255,0)`;
        }else{
            document.getElementsByClassName('clock')[clockNumber].style.background = `rgba(0,0,0,0.5)`;
        }

        let s=0,
            m=this.state.mins,
            h=this.state.hours;

        s = this.state.seconds + secs;
        if(s >= 60){
            m = this.state.mins + 1; 
            s = 0;
        }
        if(m >= 60){
            h = this.state.hours + 1;
            m = 0;
        }
        if( h >= 24 ){
            h = 0;
        }
        this.setState({
            seconds:s,
            mins:m,
            hours:h,
        })
    }
    render(){
        return (
            <div className='clock'>
                <div className='clock-face'>
                    <div className='hand hour-hand'></div>
                    <div className='hand min-hand'></div>
                    <div className='hand second-hand'></div>
                </div>
                <p>{this.state.hours}::{this.state.mins}::{this.state.seconds}</p>
            </div>
        )
    }
}

export default AnalogClock;