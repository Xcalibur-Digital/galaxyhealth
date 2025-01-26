import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Create context outside of components
const UserContext = createContext(null);

// Named function for the hook
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Named function for the provider component
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('UserProvider mounted');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        console.log('Auth state changed:', firebaseUser);
        if (firebaseUser) {
          // First, ensure user document exists
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userData;

          try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              userData = docSnap.data();
            } else {
              // Create user document if it doesn't exist
              const newUserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: firebaseUser.email === 'brendansmithelion@gmail.com' ? 'admin' : 'user',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
              };
              await setDoc(userDocRef, newUserData);
              userData = newUserData;
            }

            setUser({
              ...firebaseUser,
              ...userData
            });
          } catch (error) {
            console.error('Firestore error:', error);
            // Fall back to basic user data if Firestore fails
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'user'
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (userData) => {
    console.log('Login called with:', userData);
    setUser(userData);
  };

  const logout = async () => {
    console.log('Logout called');
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  console.log('UserContext value:', value);

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
}

// Export as named exports
export { UserProvider, useUser }; 