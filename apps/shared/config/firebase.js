import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Remove the service account loading for client-side
const firebaseConfig = {
  apiKey: "AIzaSyBm2rIxMiZUxMWtzewLz1s6hZeNQEDvm6s",
  authDomain: "galaxyhealth.firebaseapp.com",
  projectId: "galaxyhealth",
  storageBucket: "galaxyhealth.appspot.com",
  messagingSenderId: "415572460225",
  appId: "1:415572460225:web:0e67f8d39701a6699d0a40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Debug logging in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.firebase = {};
  window.firebase.firestore = db;
  console.log('Firestore debug enabled:', db);
}

export default app;

// For server-side only
export const getServerConfig = () => {
  if (typeof window === 'undefined') {
    try {
      // This should only run on the server
      const serviceAccount = require('./serviceAccount.json');
      return {
        credential: serviceAccount,
        ...firebaseConfig
      };
    } catch (error) {
      console.error('Failed to load service account:', error);
      return firebaseConfig;
    }
  }
  return firebaseConfig;
}; 