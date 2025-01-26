import { db } from '../config/firebase.js';

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