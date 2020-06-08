// import { setDriftlessInterval} from 'driftless';

function worker () {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        let seconds = e.data;
        setInterval(() => {
            seconds++;
            postMessage(seconds);
            if(seconds>=60)seconds=0;
        },
        1000);
    })
}

export default worker;