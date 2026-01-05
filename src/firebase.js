// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfipqQevqUBRxYsMcEnj15MoOXmbXDxKo",
    authDomain: "hsk-vocab-12561.firebaseapp.com",
    projectId: "hsk-vocab-12561",
    storageBucket: "hsk-vocab-12561.firebasestorage.app",
    messagingSenderId: "873066975344",
    appId: "1:873066975344:web:988c420091fa66cd3a64b5",
    measurementId: "G-BJMS9B75E9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
export const db = getFirestore(app);
