// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-eb54b.firebaseapp.com",
  projectId: "mern-estate-eb54b",
  storageBucket: "mern-estate-eb54b.appspot.com",
  messagingSenderId: "817859590857",
  appId: "1:817859590857:web:d1c9d6589d308103b0eb18",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
