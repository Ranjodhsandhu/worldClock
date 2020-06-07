
export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        let seconds = e.data.split("_")[0];
        let minutes = e.data.split("_")[1];
        let hours = e.data.split("_")[2];
        setInterval(() => {
            seconds++;
            if (seconds >= 60){
                minutes++; 
                seconds = 0;
            }
            if (minutes >= 60){
                hours++;
                minutes = 0;
            }
            if (hours >= 24) hours = 0;
            postMessage(seconds+"_"+minutes+"_"+hours);
        },
        1000);
    })
}
