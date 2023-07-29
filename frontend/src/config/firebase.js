// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: 'AIzaSyDkRBKMBmB_Hmz9njuQuOBuIKGUkL51oc8',
   authDomain: 'market-4e35a.firebaseapp.com',
   projectId: 'market-4e35a',
   storageBucket: 'market-4e35a.appspot.com',
   messagingSenderId: '279277541219',
   appId: '1:279277541219:web:12a7993cefee74b2ea6556',
   measurementId: 'G-MME70SLF30',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const signInWithGoogle = new GoogleAuthProvider();
export const db = getFirestore(app);
