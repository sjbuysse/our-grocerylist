import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyCmJ281SMzN33Dla22JRYM9fgKi0nj3Qs8",
    authDomain: "ons-boodschappenlijstje.firebaseapp.com",
    databaseURL: "https://ons-boodschappenlijstje.firebaseio.com",
    projectId: "ons-boodschappenlijstje",
    storageBucket: "ons-boodschappenlijstje.appspot.com",
    messagingSenderId: "460723363652"
};

export default firebase.initializeApp(config);

const settings = {
    timestampsInSnapshots: true
};
firebase.firestore().settings(settings);
firebase.firestore().enablePersistence().catch((err) => {
    if (err.code === 'failed-precondition') {
        console.log('You have opened multiple tabs with the ourgroceries app, only the first will work properly offline');
    } else if (err.code === 'unimplemented') {
        console.log('this browser does not support offline perisitance, data might not be displayed correctly');
    }
});
