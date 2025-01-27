import User from '../models/User.js';
import { auth } from '../config/firebase.js';
import { db } from '../config/firebase.js';

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