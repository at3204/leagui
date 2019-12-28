import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import config from './.env/env'

firebase.initializeApp(config);


const firebaseDB = firebase.database();
const firebaseMatches = firebaseDB.ref('matches');
const firebasePromotions = firebaseDB.ref('promotions');
const firebaseTeams = firebaseDB.ref('teams');
const firebasePlayers = firebaseDB.ref('players');
const firebaseId = (uid) => firebaseDB.ref(`${uid}`);
const firebaseAuth = firebase.auth();

export{
    firebase,
    firebaseMatches,
    firebasePromotions,
    firebaseTeams,
    firebasePlayers,
    firebaseDB,
    firebaseId,
    firebaseAuth
}