import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Copy .env.example to .env and fill in your Firebase project values.
// Get these from: Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// True only when the .env file has been filled in with real credentials.
export const IS_CONFIGURED = !!(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let _auth = null;
let _db = null;

if (IS_CONFIGURED) {
  const app = initializeApp(firebaseConfig);
  _auth = getAuth(app);
  _db = getFirestore(app);
}

export const auth = _auth;
export const db = _db;

// The Firestore document path for each user's profile:
// /artifacts/escape-strategist/users/{userId}
export const APP_ID = 'escape-strategist';
