import React,{Component} from 'react';
import { setDriftlessInterval} from 'driftless';
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
        setDriftlessInterval(()=>{
            this.updateTime();
        }, 
        1000);
    }
    setDate = () => {
        let now = this.props.timeProp;
        this.setState({
            seconds: now.getSeconds(),
            mins: now.getMinutes(),
            hours: now.getHours(),
        })
    }

    updateTime = () => {
        const sDegrees = ((this.state.seconds / 60) * 360);
        const mDegrees = ((this.state.mins / 60) * 360) + ((this.state.seconds / 60) * 6);
        const hDegrees = ((this.state.hours / 12) * 360) + ((this.state.mins / 60) * 30);

        const clockNumber = this.props.clockNumberProp - 1;

        document.getElementsByClassName('second-hand')[clockNumber].style.transform = `rotate(${sDegrees}deg)`
        
        document.getElementsByClassName('min-hand')[clockNumber].style.transform = `rotate(${mDegrees}deg)`
        
        document.getElementsByClassName('hour-hand')[clockNumber].style.transform = `rotate(${hDegrees}deg)`
        
        if(this.state.hours >= 6 && this.state.hours < 18){
            document.getElementsByClassName('clock')[clockNumber].style.background = `rgba(255,255,255,0)`;
        }else{
            document.getElementsByClassName('clock')[clockNumber].style.background = `rgba(0,0,0,0.5)`;
        }

        let s=this.state.seconds,
            m=this.state.mins,
            h=this.state.hours;

        s = s + 1;
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
                    <div className="number number1">1</div>
                    <div className="number number2">2</div>
                    <div className="number number3">3</div>
                    <div className="number number4">4</div>
                    <div className="number number5">5</div>
                    <div className="number number6">6</div>
                    <div className="number number7">7</div>
                    <div className="number number8">8</div>
                    <div className="number number9">9</div>
                    <div className="number number10">10</div>
                    <div className="number number11">11</div>
                    <div className="number number12">12</div>
                </div>
                <p>
                    {this.state.hours}::{this.state.mins}::{this.state.seconds}
                </p>
            </div>
        )
    }
}

export default AnalogClock;