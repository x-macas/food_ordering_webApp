import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { 
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    GithubAuthProvider
} from "firebase/auth";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: "webomato.firebasestorage.app",
    messagingSenderId: "322583788809",
    appId: "1:322583788809:web:df52b139eee301df39e7d8",
    measurementId: "G-YR37FFX67H"
  };
  

const firebaseApp = initializeApp(firebaseConfig); // Now, an instance of firebase app is created
const firebaseAuth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

console.log(firebaseAuth);
console.log(window.location.origin);

export const FirebaseProvider = (props) => {

    const signInWithGoogle = () => {
        return signInWithPopup(firebaseAuth, googleProvider);
    }

    const signInWithGithub = () => {
        return signInWithPopup(firebaseAuth, githubProvider);
    }


    return <FirebaseContext.Provider value={{signInWithGoogle, signOut, firebaseAuth, signInWithGithub }}>
        {props.children}
    </FirebaseContext.Provider>
}