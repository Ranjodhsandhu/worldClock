import React,{Component} from 'react';
import zoneListObject from './zoneListObject';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt} from '@fortawesome/fontawesome-free-solid';
import ReactHtmlParser from 'react-html-parser';

class SearchTimeZone extends Component{
    constructor(){
        super();
        this.state = {
            timeZoneList: zoneListObject,
            userInput:'',
            html: `<li>Country Name</li>
            <li>or Zone Name</li>`,
        }
    }

    handleFormClick = (event) => {
        if (event.target.localName === 'li' || event.target.localName === 'span') {
            let text = event.target.innerText;
            const updateSelection = (selection) => {
                this.props.userSelectionProp(selection);
            }
            if (event.target.localName === 'span' && event.target.className === 'highLight'){
                text = event.target.parentNode.innerText;
            }
            if (text !== 'Country Name' && text !== 'Or Zone Name' && text !== 'undefined'){
                updateSelection(text);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Type in input field',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
            window.scrollTo(0, 0);
            this.setState({
                userInput:'',
                html: `<li>Country Name</li>
                        <li>or Zone Name</li>`,
            })
        }
    }

    displayTimeZoneList = (event) => {
        let dynamicHtml = `<li>Country Name</li><li>or Zone Name</li>`;
        const matchWord = this.state.userInput;
        const matchedArray = this.findMatches(matchWord);

        if (matchWord !== '' && matchedArray.length){
            dynamicHtml = matchedArray.map(zone=>{
                const regex = new RegExp(matchWord, 'gi');
                
                const countryName = zone.countryName.replace(regex, `<span class='highLight'>${matchWord}</span>`);

                const zoneName = zone.zoneName.replace(regex,`<span class='highLight'>${matchWord}</span>`);

                return `<li><span class='zone'>${countryName}, ${zoneName}</span></li>`
            }).join('');
        }

        this.setState({
            userInput:event.target.value,
            html: dynamicHtml
        })
    }
    findMatches = (matchWord)=>{
        return this.state.timeZoneList.filter(zone =>{
            const regex = new RegExp(matchWord,'gi');
            return zone.countryName.match(regex) || zone.zoneName.match(regex);
        });
    }
    handleDeleteClick = ()=>{
        this.setState({
            userInput: '',
            html: `<li>Country Name</li>
                    <li>or Zone Name</li>`});
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
                    onClick={this.handleDeleteClick}
                    className="clear-input"
                    aria-label="Clear Input"
                />
                <div className="list-container">
                    <ul className="suggestions" >
                        {ReactHtmlParser(this.state.html)}
                    </ul>
                </div>
            </form>
        )
    }
}



export default SearchTimeZone;