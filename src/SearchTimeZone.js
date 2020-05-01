import React,{Component} from 'react';
import zoneListObject from './zoneListObject';
import Swal from 'sweetalert2';

class SearchTimeZone extends Component{
    constructor(){
        super();
        this.state = {
            timeZoneList: zoneListObject
        }
    }
    componentDidMount(){
        const searchForm = document.getElementById('search');
        searchForm.addEventListener('click',(event)=>{
            if(event.target.localName === 'li' || event.target.localName === 'span' ){
                document.getElementById('search-input').value = '';
                document.getElementsByClassName('suggestions')[0].innerHTML = `<li>Country Name</li>
                <li>or Zone Name</li>`;
                let text = event.target.innerText;
                if(event.target.localName === 'span' && event.target.className === 'highLight'){
                    text = event.target.parentNode.innerText;
                }
                const updateSelection = (selection)=>{
                    this.props.userSelectionProp(selection);
                }
                if(text !== 'Country Name' && text !== 'or Zone Name' && text !== 'undefined'){
                    updateSelection(text);
                }else{
                    Swal.fire({
                        icon:'info',
                        title: 'Type in input field',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
            }
        });
    }
    render(){
        return(
            <form id="search" className="search-form" action="" autoComplete="off" onSubmit={(event) => 
                event.preventDefault()}>
                <label htmlFor="search" ></label>
                <input 
                className="search" 
                type="text" 
                name="search" 
                id="search-input"
                placeholder="Country or Zone" 
                onKeyUp={this.displayTimeZoneList} 
                onChange={this.displayTimeZoneList}/>
                <div className="listContainer">
                    <ul className="suggestions" >
                        <li>Country Name</li>
                        <li>or Zone Name</li>
                    </ul>
                </div>
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
            
            return `<li><span class='zone'>${countryName}, ${zoneName}</span></li>`
        }).join('');

        const defaultHtml = `
            <li>Country Name</li>
            <li>or Zone Name</li>`;

        if(matchWord.length > 0)
            document.getElementsByClassName('suggestions')[0].innerHTML = html;
        else
            document.getElementsByClassName('suggestions')[0].innerHTML = defaultHtml;
        
    }
    findMatches = (matchWord)=>{
        return this.state.timeZoneList.filter(zone =>{
            const regex = new RegExp(matchWord,'gi');
            return zone.countryName.match(regex) || zone.zoneName.match(regex);
        });
    }
}



export default SearchTimeZone;