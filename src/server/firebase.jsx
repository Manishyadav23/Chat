// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsy9pQ_Xa_NLv_1f_HwfDSlIGZEXzFirs",
  authDomain: "slack2oo.firebaseapp.com",
  projectId: "slack2oo",
  storageBucket: "slack2oo.appspot.com",
  messagingSenderId: "482416622203",
  appId: "1:482416622203:web:67e53cb05faa64e21180de",
  measurementId: "G-1B7X0X184W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth();
export {app, auth};



