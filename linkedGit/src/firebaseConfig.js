// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { doc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8nVv0KJ-jFrqwFJ-euPidGomn8mGPozk",
  authDomain: "final-linkedin-clone-d8422.firebaseapp.com",
  projectId: "final-linkedin-clone-d8422",
  storageBucket: "final-linkedin-clone-d8422.appspot.com",
  messagingSenderId: "291983709681",
  appId: "1:291983709681:web:90e1b1c33c46824b1d2050"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { auth, app, firestore, storage };
