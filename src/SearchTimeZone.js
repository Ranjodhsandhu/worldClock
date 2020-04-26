import React,{Component} from 'react';
import axios from 'axios';

class SearchTimeZone extends Component{
    constructor(){
        super();
        this.state = {
            timeZoneList: []
        }
    }
    componentDidMount(){
        this.getTimeZoneList();
    }
    render(){
        return(
            <form className="search-form" method="post" action="/form" autoComplete="off">
                <label htmlFor="search" ></label>
                <input 
                className="search" 
                type="text" 
                name="search" 
                id="search"
                placeholder="Country or Zone" 
                onKeyUp={this.displayTimeZoneList} 
                onChange={this.displayTimeZoneList}/>
                <ul className="suggestions" >
                    <li onClick={this.handleClick}>Country Name</li>
                    <li>or Zone Name</li>
                </ul>
            </form>
        )
    }
    displayTimeZoneList = () => {
        const matchWord = document.getElementsByClassName('search')[0].value;
        const matchedArray = this.findMatches(matchWord);
        
        const html = matchedArray.map(zone=>{
            
            const regex = new RegExp(matchWord, 'gi');
            
            const countryName = zone.countryName.replace(regex, `<span class='highLight'>${matchWord}</span>`) 
            const zoneName = zone.zoneName.replace(regex,`<span class='highLight'>${matchWord}</span>`) 
            
            return `<li><span class='zone' onClick={this.handleClick}} >${countryName}, ${zoneName}</span></li>`
        }).join('');

        const defaultHtml = `
            <li>Country Name</li>
            <li>or Zone Name</li>`;

        if(matchWord.length > 0)
            document.getElementsByClassName('suggestions')[0].innerHTML = html;
        else
            document.getElementsByClassName('suggestions')[0].innerHTML = defaultHtml;
        
    }
    handleClick = ()=>{
        console.log('Hello');
    }
    getTimeZoneList = ()=>{
        axios({
            url: 'https://api.timezonedb.com/v2.1/list-time-zone',
            method: 'GET',
            responseType: 'json',
            params:{
                key:'16OZ7ZU6JZBK',
                format:'json',
                fields:'countryName,zoneName'
            }
        }).then((zoneList)=>{
            this.setState({
                timeZoneList: zoneList.data.zones
            })
        });
    }
    findMatches = (matchWord)=>{
        return this.state.timeZoneList.filter(zone =>{
            const regex = new RegExp(matchWord,'gi');
            return zone.countryName.match(regex) || zone.zoneName.match(regex);
        });
    }
}



export default SearchTimeZone;