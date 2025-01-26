import User from '../models/User.js';
import { auth } from '../config/firebase.js';
import { db } from '../config/firebase.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // ... your authentication logic ...
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userDoc = await db.collection('users')
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        return res.status(403).json({
          error: {
            message: 'User profile not found'
          }
        });
      }

      const userData = userDoc.data();
      if (!userData.role || !allowedRoles.includes(userData.role)) {
        return res.status(403).json({
          error: {
            message: 'Insufficient permissions',
            requiredRoles: allowedRoles,
            currentRole: userData.role
          }
        });
      }

      req.userRole = userData.role;
      next();
    } catch (error) {
      next(error);
    }
  };
}; 