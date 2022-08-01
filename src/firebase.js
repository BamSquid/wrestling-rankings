// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsxAkdle2Ppqmh2ppOccnbLu9d6oY_sYY",
  authDomain: "wrestling-rankings.firebaseapp.com",
  projectId: "wrestling-rankings",
  storageBucket: "wrestling-rankings.appspot.com",
  messagingSenderId: "583458966634",
  appId: "1:583458966634:web:303bf46e11a77ff76b8e13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };