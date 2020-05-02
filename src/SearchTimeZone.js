import React,{Component} from 'react';
import zoneListObject from './zoneListObject';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt} from '@fortawesome/fontawesome-free-solid';

class SearchTimeZone extends Component{
    constructor(){
        super();
        this.state = {
            timeZoneList: zoneListObject,
            userInput:'',
        }
    }

    handleFormClick = (event) => {
        if (event.target.localName === 'li' || event.target.localName === 'span') {
            document.getElementsByClassName('suggestions')[0].innerHTML = `<li>Country Name</li>
            <li>or Zone Name</li>`;
            let text = event.target.innerText;
            if (event.target.localName === 'span' && event.target.className === 'highLight') {
                text = event.target.parentNode.innerText;
            }
            const updateSelection = (selection) => {
                this.props.userSelectionProp(selection);
            }
            if (text !== 'Country Name' && text !== 'or Zone Name' && text !== 'undefined') {
                updateSelection(text);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Type in input field',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
            this.setState({
                userInput:''
            })
        }
    }

    displayTimeZoneList = (event) => {
        const matchWord = document.getElementsByClassName('search')[0].value;
        const matchedArray = this.findMatches(matchWord);
        
        const html = matchedArray.map(zone=>{
            
            const regex = new RegExp(matchWord, 'gi');
            
            const countryName = zone.countryName.replace(regex, `<span class='highLight'>${matchWord}</span>`) 
            const zoneName = zone.zoneName.replace(regex,`<span class='highLight'>${matchWord}</span>`) 
            
            return `<li><span class='zone'>${countryName}, ${zoneName}</span></li>`
        }).join('');
        
        const defaultHtml = `
        <li>Country Name</li>
        <li>or Zone Name</li>`;
        
        if(matchWord.length > 0)
        document.getElementsByClassName('suggestions')[0].innerHTML = html;
        else
        document.getElementsByClassName('suggestions')[0].innerHTML = defaultHtml;
        
        this.setState({
            userInput:event.target.value
        })
        
    }
    findMatches = (matchWord)=>{
        return this.state.timeZoneList.filter(zone =>{
            const regex = new RegExp(matchWord,'gi');
            return zone.countryName.match(regex) || zone.zoneName.match(regex);
        });
    }

    render() {
        return (
            <form 
                id="search" 
                className="search-form" 
                action="" 
                autoComplete="off" 
                onSubmit={(event) => event.preventDefault()}
                onClick={this.handleFormClick}
            >
                <label 
                    htmlFor="search" 
                    aria-label="Enter Country or Zone name"
                    className="sr-only">Enter Country or Zone name</label>
                <input
                    className="search"
                    type="text"
                    name="search"
                    id="search-input"
                    value={this.state.userInput}
                    placeholder="Country or Zone"
                    onKeyUp={this.displayTimeZoneList}
                    onChange={this.displayTimeZoneList}
                />
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => { this.setState({userInput:''})}}
                    className="clear-input"
                    aria-label="Clear Input"
                />
                <div className="listContainer">
                    <ul className="suggestions" >
                        <li>Country Name</li>
                        <li>or Zone Name</li>
                    </ul>
                </div>
            </form>
        )
    }
}



export default SearchTimeZone;