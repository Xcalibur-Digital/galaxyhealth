import express from 'express';
import { auth } from '../config/firebase.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { db } from '../config/firebase.js';
import { storageService } from '../services/storageService.js';
import { GoogleAuth } from 'google-auth-library';

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

// Add this function to set admin claims
const setAdminClaim = async (uid, email) => {
  try {
    if (email === 'brendansmithelion@gmail.com') {
      await auth.setCustomUserClaims(uid, { admin: true });
      console.log(`Set admin claims for ${email}`);
    }
  } catch (error) {
    console.error('Error setting admin claims:', error);
  }
};

// Update createUserDocument to include this
export const createUserDocument = async (user) => {
  const { uid, email, displayName, photoURL } = user;
  
  try {
    const userRef = db.collection('users').doc(uid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      const isAdmin = email === 'brendansmithelion@gmail.com';
      
      if (isAdmin) {
        await setAdminClaim(uid, email);
      }

      const userData = {
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isActive: true,
        accountStatus: 'active',
        statusUpdatedAt: new Date().toISOString(),
        profileComplete: false,
        permissions: isAdmin ? ['all'] : ['basic'],
        registeredAt: new Date().toISOString()
      };

      await userRef.set(userData);
      
      // Log account activation
      await storageService.logAuditEvent({
        type: 'ACCOUNT_STATUS_CHANGE',
        userId: uid,
        email,
        details: {
          oldStatus: null,
          newStatus: 'active',
          timestamp: new Date().toISOString(),
          action: 'ACCOUNT_ACTIVATED'
        }
      });

      await db.collection('userSettings').doc(uid).set({
        theme: 'dark',
        notifications: true,
        dashboardLayout: 'default',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

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

router.post('/healthcare-token', verifyAuthToken, async (req, res) => {
  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    res.json({ accessToken: accessToken.token });
  } catch (error) {
    console.error('Error getting healthcare token:', error);
    res.status(500).json({ error: 'Failed to get healthcare token' });
  }
});

export { router as auth }; 