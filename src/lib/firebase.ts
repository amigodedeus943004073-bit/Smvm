import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// @ts-ignore
import firebaseConfig from '../../firebase-applet-config.json';

let app: any;
let auth: any;
let db: any;
let googleProvider: any;

const isConfigValid = firebaseConfig && 
                     firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== "YOUR_API_KEY" &&
                     firebaseConfig.apiKey !== "MY_GEMINI_API_KEY";

if (isConfigValid) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  googleProvider = new GoogleAuthProvider();
}

export { auth, db, googleProvider, signInWithPopup, signOut };

export const isFirebaseReady = () => !!db && !!auth;
