import firebase from 'firebase/app'

import 'firebase/firestore'


if (!firebase.apps.length) {
firebase.initializeApp({
    apiKey: "AIzaSyDmn6W937gALeHEAz1IZ4aWg4Nq3NA8WTE",
    authDomain: "project-kanri-5e5f4.firebaseapp.com",
    databaseURL: "https://project-kanri-5e5f4.firebaseio.com",
    projectId: "project-kanri-5e5f4",
    storageBucket: "project-kanri-5e5f4.appspot.com",
    messagingSenderId: "144754756291",
    appId: "1:144754756291:web:3e5ea220ebf5aecdfe7076"
});
}
 
const db = firebase.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)
export default db