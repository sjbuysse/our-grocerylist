import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: process.env['REACT_APP_FIREBASE_API_KEY'],
    authDomain: process.env['REACT_APP_FIREBASE_AUTH_DOMAIN'],
    databaseURL: process.env['REACT_APP_FIREBASE_DATABASE_URL'],
    projectId: process.env['REACT_APP_FIREBASE_PROJECT_ID'],
    storageBucket: process.env['REACT_APP_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId:  process.env['REACT_APP_FIREBASE_MESSAGING_SENDER_ID'],
};

export default firebase.initializeApp(config);

firebase.firestore().enablePersistence().catch((err) => {
    if (err.code === 'failed-precondition') {
        console.log('You have opened multiple tabs with the ourgroceries app, only the first will work properly offline');
    } else if (err.code === 'unimplemented') {
        console.log('this browser does not support offline perisitance, data might not be displayed correctly');
    }
});
