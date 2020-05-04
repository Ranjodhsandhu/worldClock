import React,{Component} from 'react';
import { setDriftlessInterval, clearDriftless} from 'driftless';

// This clock accepts the time from time zone and runs the clock
class AnalogClock extends Component {

    constructor(){
        super();
        this.state = {
            now: new Date(),
            mapUrl:'https://open.mapquestapi.com/staticmap/v5/map?key=ozwRV4KrZgLGMjKBYbnTIZBWQAN4JZBn&center=60,-95&size=200,200&zoom=1&format=png',
            zone:'',
            seconds:(new Date()).getSeconds(),
            mins: (new Date()).getMinutes(),
            hours: (new Date()).getHours(),
        }
    }
    // here first check if there is any difference in state and props received
    componentDidUpdate(prevProps, prevState) {
        if (this.props.timeProp.zoneName !== prevState.zone) {
            this.setDate();
        }
    }
    componentDidMount() {
        this.setDate();
        // run the clock to update every second
        // driftlessInterval make the time lost by drift caused by interval call
        this.timeId = setDriftlessInterval(()=>{
            this.updateTime();
        }, 
        1000);
    }
    // clear the clock Interval when clock is unmounted
    componentWillUnmount(){
        clearDriftless(this.timeId);
    }

    // This method gets called after props updation 
    // it will update the state to get new Date() from timeProp
    setDate = () => {
        if (Object.keys(this.props.timeProp).length && this.props.timeProp.status ==='OK'){
            const zTime = this.props.timeProp;
            // calculate date in string format from timestamp by converting to milliseconds
            let date = new Date((zTime.timestamp - zTime.gmtOffset) * 1000);
            //  convert the date to its zone locale
            date = new Date(date.toLocaleString('en-US', { timeZone: `${zTime.zoneName}` }));
            this.setState({
                now: date,
                mapUrl:`https://open.mapquestapi.com/staticmap/v5/map?key=ozwRV4KrZgLGMjKBYbnTIZBWQAN4JZBn&center=${this.props.coordinatesProp}&size=200,200&zoom=1&format=png`,
                zone: zTime.zoneName,
                seconds: date.getSeconds(),
                mins: date.getMinutes(),
                hours: date.getHours(),
            })
        }
    }

    // update time every second and also show it on the clock 
    updateTime = () => {
        // calculate how many degrees each hand should move
        const sDegrees = ((this.state.seconds / 60) * 360);
        const mDegrees = ((this.state.mins / 60) * 360) + ((this.state.seconds / 60) * 6);
        const hDegrees = ((this.state.hours / 12) * 360) + ((this.state.mins / 60) * 30);

        // update hands for each clock by its clock number from prop
        const clockNumber = this.props.clockNumberProp;
        document.getElementsByClassName('second-hand')[clockNumber].style.transform = `rotate(${sDegrees}deg)`;
        document.getElementsByClassName('min-hand')[clockNumber].style.transform = `rotate(${mDegrees}deg)`;
        document.getElementsByClassName('hour-hand')[clockNumber].style.transform = `rotate(${hDegrees}deg)`;

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
        if( h >= 24 )h = 0;
        
        this.setState({
            seconds:s,
            mins:m,
            hours:h,
        })
    }

    
    // renders clock and time  in analog and digital format
    render(){
        let digHours = this.state.hours;
        let digMins = this.state.mins;
        // check if the it is day or night time
        const isLight = digHours >= 6 && digHours < 18;
        // get the map url as per day or night with its type
        const mapURL = isLight ? this.state.mapUrl + '&type=light' : this.state.mapUrl + '&type=dark';
        // get the text color to show as per day or night
        const textColor = isLight ? 'black':'white';
        // get the zone name to show on page
        const propZoneName = (this.state.zone).split('/')[1];

        let zoneName = '';
        if (propZoneName === undefined) {
            zoneName = 'Local Time';
        } else if (propZoneName.length >= 12) {
            zoneName = propZoneName.match(/\b\w/g).join('');
        } else {
            zoneName = propZoneName;
        }

        // convert the 24 hour format to 12 hour format
        digHours = digHours >= 13 ? (digHours-12): digHours;
        digHours = digHours === 0 ? '0'+digHours: digHours;
        digMins = digMins >= 0 && digMins < 10 ? '0'+digMins : digMins;
        const d = this.state.now;
        const digDay = d.toString().split(' ')[0];
        const digMonth = d.toString().split(' ')[1];
        const digDate = d.getDate();
        const postFix = digHours >= 12 && digHours <=24 ? 'PM':'AM';

        return (
            <section className="clock-section">
                <div 
                    className={isLight?'clock light-background' :'clock dark-background'} 
                    style={{backgroundImage:`url(${mapURL})`}}
                >
                    <div className='clock-face' style={{color:`${textColor}`}}>
                        <div className='hand hour-hand'></div>
                        <div className='hand min-hand'></div>
                        <div className='hand second-hand'></div>
                        <div className="number number1"><p>1</p></div>
                        <div className="number number2"><p>2</p></div>
                        <div className="number number3"><p>3</p></div>
                        <div className="number number4"><p>4</p></div>
                        <div className="number number5"><p>5</p></div>
                        <div className="number number6"><p>6</p></div>
                        <div className="number number7"><p>7</p></div>
                        <div className="number number8"><p>8</p></div>
                        <div className="number number9"><p>9</p></div>
                        <div className="number number10"><p>10</p></div>
                        <div className="number number11"><p>11</p></div>
                        <div className="number number12"><p>12</p></div>
                    </div>
                </div>
                <p className="digital-time">
                    {digDay} {digMonth} {digDate}, {digHours}:{digMins} {postFix}
                </p>
                <h3 className="country-name">{zoneName}</h3>
            </section>
        )
    }
}

export default AnalogClock;