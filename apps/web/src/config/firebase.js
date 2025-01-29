import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { firebaseConfig } from './firebase.config.js';

// Initialize Firebase first
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Debug logging after initialization
if (import.meta.env.DEV) {
  console.log('Firebase config:', {
    ...firebaseConfig,
    apiKey: 'HIDDEN'
  });
  
  window.firebase = { firestore: db };
}

// Exports after everything is initialized
export { db, auth, googleProvider };
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is signed in');
  return user.getIdToken();
};
export default app; 