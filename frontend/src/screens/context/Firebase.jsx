import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { 
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCikSR1AVUrjmd-PcFleEQtoyOBXzeT7fc",
    authDomain: "https://webomato.netlify.app",
    projectId: "bookify-5683b",
    storageBucket: "bookify-5683b.firebasestorage.app",
    messagingSenderId: "302544363896",
    appId: "1:302544363896:web:c3ccaf1f36ebde866da88d"
};

const firebaseApp = initializeApp(firebaseConfig); // Now, an instance of firebase app is created
const firebaseAuth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {

    const signInWithGoogle = () => {
        return signInWithPopup(firebaseAuth, googleProvider);
    }


    return <FirebaseContext.Provider value={{signInWithGoogle, signOut, firebaseAuth }}>
        {props.children}
    </FirebaseContext.Provider>
}