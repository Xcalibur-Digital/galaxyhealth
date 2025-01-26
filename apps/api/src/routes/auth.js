import express from 'express';
import { auth } from '../config/firebase.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { db } from '../config/firebase.js';

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

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`
    });
    
    // Create user data object
    const userData = {
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      photoURL: userRecord.photoURL || '',
      token: await auth.createCustomToken(userRecord.uid)
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/google/register', async (req, res) => {
  try {
    const { idToken, email, firstName, lastName, photoURL } = req.body;
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Create or update user in your database
    // For now, we'll just return the user data
    const userData = {
      uid: decodedToken.uid,
      email,
      firstName,
      lastName,
      photoURL,
      token: idToken
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Handle preflight requests
router.options('/google/login', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

router.post('/google/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Get user from your database
    // For now, we'll just return the token data
    const userData = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      token: idToken
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

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

      await userRef.set(userData);
      console.log(`Created new user document for ${email}`);
      
      if (isAdmin) {
        console.log(`Configured ${email} as admin`);
      }
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export { router as auth }; 