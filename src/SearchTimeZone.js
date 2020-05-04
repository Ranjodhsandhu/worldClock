import React,{Component} from 'react';
import zoneListObject from './zoneListObject';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt} from '@fortawesome/fontawesome-free-solid';
import ReactHtmlParser from 'react-html-parser';

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
    focusZoneInput() {
        this.zoneInput.current.focus();
    }

    handleFormClick = (event) => {
        
        if (event.target.localName === 'li' || event.target.localName === 'span') {
            let text = event.target.innerText;
            const updateSelection = (selection) => {
                this.props.userSelectionProp(selection);
            }
            if (event.target.className === 'highLight'){
                text = event.target.parentNode.innerText;
            }
            if (text !== 'Country Name' 
                && text !== 'Or Zone Name' 
                && text !== 'undefined'
                && text !== ''
                && text !== ' '){
                updateSelection(text);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Type in input field',
                    showConfirmButton: false,
                    timer: 1000
                });
                this.focusZoneInput();
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
        const matchWord = (this.state.userInput).trim();
        let matchedArray = this.findMatches(matchWord);

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
        // first check if the word to find has all characters or a space
        const isCharacter = /^[a-zA-Z ]+$/.test(matchWord);
        return isCharacter ? this.state.timeZoneList.filter(zone =>{
            const regex = new RegExp(matchWord,'gi');
            return zone.countryName.match(regex) || zone.zoneName.match(regex);
        }):[];
    }
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