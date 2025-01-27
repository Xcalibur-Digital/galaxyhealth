import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Add more detailed logging
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Only log non-sensitive config info
console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: 'HIDDEN'
});

console.log('Initializing Firebase with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized successfully');

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Add auth state change listener
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User is signed in' : 'User is signed out');
});

// Get auth token function
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is signed in');
  }
  return user.getIdToken();
};

// Export everything
export { auth, db, getAuthToken };
export default app; 