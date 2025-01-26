import express from 'express';
import admin from 'firebase-admin';
import { verifyAuthToken } from './auth.js';
import User from '../models/User.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all user routes
router.use(verifyAuthToken);

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile with role validation
router.patch('/profile', async (req, res) => {
  try {
    const uid = req.user.uid;
    const updates = req.body;
    
    const user = new User(uid);

    if (updates.role) {
      // Role updates require additional validation
      const validRoles = ['nurse', 'physician', 'practice_staff', 'analyst'];
      if (!validRoles.includes(updates.role)) {
        return res.status(400).json({
          error: {
            message: 'Invalid role specified',
            validRoles
          }
        });
      }

      // Update role with audit trail
      const updatedUser = await user.updateRole(updates.role, req.user.uid);
      return res.json(updatedUser);
    }

    // Regular profile updates
    const updatedUser = await user.update(updates);
    res.json(updatedUser);

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update user profile',
        details: error.message
      }
    });
  }
});

// Get user role (helper endpoint)
router.get('/role', async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(uid)
      .get();

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
    const user = new User(userId);
    const roleHistory = await user.getRoleHistory();
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