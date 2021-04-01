import axios from 'axios';
// function that returns a promise from api call
function zonePromise(zoneName){
    return axios({
        url: 'https://api.timezonedb.com/v2.1/get-time-zone',
        method: 'GET',
        responseType: 'json',
        params: {
            key: '16OZ7ZU6JZBK',
            format: 'json',
            by: 'zone',
            zone: zoneName,
            fields: 'zoneName,gmtOffset,timestamp,countryName,countryCode',
        }
    })
}

export default zonePromise;