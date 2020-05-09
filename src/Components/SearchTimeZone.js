import React,{Component} from 'react';
import zoneListObject from '../Util/zoneListObject';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt} from '@fortawesome/fontawesome-free-solid';
import ReactHtmlParser from 'react-html-parser';

// Show the list of zones and countries to select
class SearchTimeZone extends Component{
    constructor(){
        super();
        this.zoneInput = React.createRef();
        this.focusZoneInput = this.focusZoneInput.bind(this);
        this.state = {
            timeZoneList: zoneListObject,
            userInput:'',
            html: `<li>Country Name</li>
            <li>or Zone Name</li>`,
        }
    }
    componentDidMount(){
        this.focusZoneInput();
    }
    // to focus on the input field
    focusZoneInput() {
        this.zoneInput.current.focus();
    }

    // get the user click and corresponding zone name from the click event
    // @params: event - to get clicked item text
    handleFormClick = (event) => {
        // if only the item clicked is li or span
        if (event.target.localName === 'li' || event.target.localName === 'span') {
            let text = event.target.innerText;
            // update selection that goes back to App.js userSelection function
            const updateSelection = (selection) => {
                this.props.userSelectionProp(selection);
            }
            // if the highlighted area is clicked then get value of parent
            if (event.target.className === 'highLight'){
                text = event.target.parentNode.innerText;
            }
            // filter out default values from the user click and update selection
            if (text !== 'Country Name' 
                && text !== 'Or Zone Name' 
                && text !== 'undefined'
                && text !== ''
                && text !== ' '){
                updateSelection(text);
            } else {
                // get the user to enter in text field
                Swal.fire({
                    icon: 'info',
                    title: 'Type in input field',
                    showConfirmButton: false,
                    timer: 1000
                });
                this.focusZoneInput();
            }
            // scroll to top to show clock
            window.scrollTo(0, 0);
            this.setState({
                userInput:'',
                html: `<li>Country Name</li>
                        <li>or Zone Name</li>`,
            })
        }
    }
    // this function filters out the value from object to get li's to render on page
    // @params: event - value change or key up events
    displayTimeZoneList = (event) => {
        let dynamicHtml = `<li>Country Name</li><li>or Zone Name</li>`;
        // get rid of extra space in string
        const matchWord = (this.state.userInput).trim();
        // get array of matched values
        let matchedArray = this.findMatches(matchWord);
        // check if there is any array returned
        if (matchWord !== '' && matchedArray.length){
            // map the values by wrapping them in semantic html tags
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
    // checks for each item in the time Zone List from timezonedb.com
    // @params: matchWord - the word in input field to be matched
    findMatches = (matchWord)=>{
        // first check if the word to find has all characters or a space
        const isCharacter = /^[a-zA-Z ]+$/.test(matchWord);
        return isCharacter ? this.state.timeZoneList.filter(zone =>{
            const regex = new RegExp(matchWord,'gi');
            return zone.countryName.match(regex) || zone.zoneName.match(regex);
        }):[];
    }
    // clear text button inside the text field
    handleDeleteClick = ()=>{
        this.focusZoneInput();
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
                    ref={this.zoneInput}
                    onKeyUp={this.displayTimeZoneList}
                    onChange={this.displayTimeZoneList}
                />
                <button
                    onClick={this.handleDeleteClick}
                    className="clear-input"
                    aria-label="Clear Input">
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                    />
                </button>
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