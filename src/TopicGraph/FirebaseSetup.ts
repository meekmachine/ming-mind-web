// FirebaseSetup.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDaLUX0xrk1hND1r3PJ1tiAzG80jmKAFYg",
    authDomain: "ming-527ed.firebaseapp.com",
    projectId: "ming-527ed",
    storageBucket: "ming-527ed.appspot.com",
    messagingSenderId: "78727120574",
    appId: "1:78727120574:web:95eed43cc7579dacdf80ef"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);

export { firestore };
