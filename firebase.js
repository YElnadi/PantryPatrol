// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqFOEBuwTCumhKzygIIeR3pZbhVGef2vw",
  authDomain: "pantrypatrol-a1e00.firebaseapp.com",
  projectId: "pantrypatrol-a1e00",
  storageBucket: "pantrypatrol-a1e00.appspot.com",
  messagingSenderId: "912431470384",
  appId: "1:912431470384:web:0465cdc6f4ca3058e9daf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{
    app, firestore
}