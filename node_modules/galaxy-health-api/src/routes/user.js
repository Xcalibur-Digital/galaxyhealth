import express from 'express';
import { verifyAuthToken, requireRole } from '../middleware/auth.js';
import { db } from '../config/firebase.js';

const router = express.Router();

// Protect all user routes with auth
router.use(verifyAuthToken);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        error: { message: 'User profile not found' } 
      });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch user profile' } 
    });
  }
});

// Update user profile
router.patch('/profile', async (req, res) => {
  try {
    const updates = req.body;
    const userRef = db.collection('users').doc(req.user.uid);

    // Don't allow updating sensitive fields
    delete updates.role;
    delete updates.email;
    delete updates.uid;

    await userRef.update({
      ...updates,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await userRef.get();
    res.json(updatedDoc.data());
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      error: { message: 'Failed to update user profile' } 
    });
  }
});

// Get user settings
router.get('/settings', async (req, res) => {
  try {
    const settingsDoc = await db.collection('userSettings').doc(req.user.uid).get();
    
    if (!settingsDoc.exists) {
      // Create default settings if none exist
      const defaultSettings = {
        theme: 'dark',
        notifications: true,
        dashboardLayout: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.collection('userSettings').doc(req.user.uid).set(defaultSettings);
      return res.json(defaultSettings);
    }

    res.json(settingsDoc.data());
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ 
      error: { message: 'Failed to fetch user settings' } 
    });
  }
});

// Update user settings
router.patch('/settings', async (req, res) => {
  try {
    const updates = req.body;
    const settingsRef = db.collection('userSettings').doc(req.user.uid);

    await settingsRef.update({
      ...updates,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await settingsRef.get();
    res.json(updatedDoc.data());
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ 
      error: { message: 'Failed to update user settings' } 
    });
  }
});

// Get user role (helper endpoint)
router.get('/role', async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection('users').doc(uid).get();
    const role = userDoc.exists ? userDoc.data().role : null;
    res.json({ role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch user role',
        details: error.message
      }
    });
  }
});

// Get role history (requires admin or self)
router.get('/role-history/:userId', requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    const roleHistory = userDoc.data()?.roleHistory || [];
    res.json(roleHistory);
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch role history',
        details: error.message
      }
    });
  }
});

export { router as userRoutes }; 