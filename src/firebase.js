import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyD7aX3iO2nZ43eLPVbcqXqB_676Wn_oKOw",
    authDomain: "world-clock-11971.firebaseapp.com",
    databaseURL: "https://world-clock-11971.firebaseio.com",
    projectId: "world-clock-11971",
    storageBucket: "world-clock-11971.appspot.com",
    messagingSenderId: "329957177639",
    appId: "1:329957177639:web:a35f60880e487ad3281102"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;