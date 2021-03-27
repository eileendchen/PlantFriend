import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: "plantfriend-9e1b5.firebaseapp.com",
  databaseURL: "https://plantfriend-9e1b5-default-rtdb.firebaseio.com",
  projectId: "plantfriend-9e1b5",
  storageBucket: "plantfriend-9e1b5.appspot.com",
  messagingSenderId: "174361461334",
  appId: "1:174361461334:web:2872c730ba95182825f1f7",
  measurementId: "G-2DML9KMJBM",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export default firebase;
