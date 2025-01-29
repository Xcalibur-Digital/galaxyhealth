import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { firebaseConfig } from './config/firebase.config.js';

// Initialize Firebase first
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Debug logging after initialization
const isDev = typeof window !== 'undefined' 
  ? import.meta?.env?.DEV 
  : process.env.NODE_ENV === 'development';

if (isDev) {
  if (typeof window !== 'undefined') {
    window.firebase = { firestore: db };
  }
  console.log('Firebase config:', {
    ...firebaseConfig,
    apiKey: 'HIDDEN'
  });
}

// Exports after everything is initialized
export { db, auth, googleProvider };
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is signed in');
  return user.getIdToken();
};
export default app; 