import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { storageService } from '../services/storageService';
import { LoadingSpinner, ErrorDisplay } from '../components/common';

// Create context outside of components
const UserContext = createContext(null);

// Create the hook
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Create the provider component
const UserProvider = ({ children }) => {
  console.log('UserProvider initializing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createNewUser = async (firebaseUser) => {
    try {
      const registrationDate = new Date().toISOString();
      const isAdmin = firebaseUser.email === 'brendansmithelion@gmail.com';
      
      const newUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: isAdmin ? 'admin' : 'user',
        registeredAt: registrationDate,
        createdAt: registrationDate,
        lastUpdated: registrationDate,
        isActive: true,
        accountStatus: 'active'
      };

      // Create user document first
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userRef, newUserData);

      // After user document is created, create settings
      const settingsRef = doc(db, 'userSettings', firebaseUser.uid);
      const settingsData = {
        theme: 'dark',
        notifications: true,
        dashboardLayout: 'default',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        createdAt: registrationDate,
        updatedAt: registrationDate
      };
      await setDoc(settingsRef, settingsData);

      // Finally create preferences
      const prefsRef = doc(db, 'userPreferences', firebaseUser.uid);
      const prefsData = {
        favoritePatients: [],
        recentSearches: [],
        customViews: [],
        shortcuts: [],
        createdAt: registrationDate,
        updatedAt: registrationDate
      };
      await setDoc(prefsRef, prefsData);

      return newUserData;
    } catch (error) {
      console.error('Error creating new user:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('Setting up auth listener');
    const auth = getAuth();
    let unsubscribe;

    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
        try {
          setLoading(true);
          console.log('Current firebaseUser:', firebaseUser?.email);
          
          if (firebaseUser) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            console.log('Attempting to read user document for:', firebaseUser.uid);
            
            try {
              const docSnap = await getDoc(userRef);
              console.log('Document exists?', docSnap.exists());

              let userData;
              if (docSnap.exists()) {
                userData = docSnap.data();
                console.log('Retrieved user data:', userData);
              } else {
                console.log('Creating new user document');
                userData = await createNewUser(firebaseUser);
              }

              setUser({
                ...firebaseUser,
                ...userData
              });
            } catch (error) {
              console.error('Specific Firestore error:', {
                code: error.code,
                message: error.message,
                details: error
              });
              throw error;
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', {
            code: error.code,
            message: error.message,
            details: error
          });
          setError(error);
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Auth setup error:', error);
      setError(error);
      setLoading(false);
    }

    return () => unsubscribe?.();
  }, []);

  const value = {
    user,
    loading,
    error,
    login: async (userData) => {
      setUser(userData);
    },
    logout: async () => {
      try {
        await signOut(auth);
        setUser(null);
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
    makeAdmin: async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          role: 'admin',
          updatedAt: new Date().toISOString()
        });
        
        // Force token refresh to get new claims
        await auth.currentUser.getIdToken(true);
        window.location.reload();
      } catch (error) {
        console.error('Error making user admin:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Export everything at once at the bottom
export { useUser, UserProvider }; 