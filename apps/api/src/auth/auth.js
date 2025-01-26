import express from 'express';
import { auth, db } from '../config/firebase.js';

const router = express.Router();

export const verifyAuthToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header');
      return res.status(401).json({ 
        error: { message: 'No authorization token provided' } 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Attempting to verify token...');

    try {
      const decodedToken = await auth.verifyIdToken(token);
      console.log('Token verified for user:', decodedToken.uid);
      req.user = decodedToken;
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(403).json({ 
        error: { message: 'Invalid authorization token' } 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: { message: 'Internal authentication error' } 
    });
  }
};

// Handle new user creation
export const createUserDocument = async (user) => {
  const { uid, email, displayName, photoURL } = user;
  
  try {
    const userRef = db.collection('users').doc(uid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      const isAdmin = email === 'brendansmithelion@gmail.com';
      
      const userData = {
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date(),
        lastUpdated: new Date(),
        isActive: true,
        profileComplete: false,
        permissions: isAdmin ? ['all'] : ['basic']
      };

      // Create the user document
      await userRef.set(userData, { merge: true });
      console.log(`Created/updated user document for ${email}`);
      
      if (isAdmin) {
        console.log(`Configured ${email} as admin`);
      }

      return userData;
    }

    return snapshot.data();
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

// Auth routes
router.post('/user/create', verifyAuthToken, async (req, res) => {
  try {
    const userData = await createUserDocument(req.user);
    res.json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Auth state change handler
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      await createUserDocument(user);
    } catch (error) {
      console.error('Error in auth state change:', error);
    }
  }
});

export { router as auth }; 