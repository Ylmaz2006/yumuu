// src/firebase.js
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFLvFKPAZLhQMJhd0IzbLG0REMh5h68ZI",
  authDomain: "yumu-1ee3c.firebaseapp.com",
  projectId: "yumu-1ee3c",
  appId: "1:898770049585:web:68b2b2fedbd5ec60cf9310",
  // other values from your Firebase config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};
