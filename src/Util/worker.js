// import { setDriftlessInterval} from 'driftless';

export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        console.log(e.data);
        let seconds = e.data;
        setInterval(() => {
            seconds++;
            if(seconds>=60) seconds=0;
            postMessage(seconds);
        },
        1000);
    })
}
