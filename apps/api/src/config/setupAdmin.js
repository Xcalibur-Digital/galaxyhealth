import { db } from './firebase.js';

const ADMIN_EMAIL = 'brendansmithelion@gmail.com';

export const setupAdminUser = async () => {
  try {
    console.log('Setting up admin user...');
    
    // Get user by email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', ADMIN_EMAIL)
      .get();

    if (usersSnapshot.empty) {
      console.log('Admin user not found in database, waiting for first login...');
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.role === 'admin') {
      console.log('Admin user already configured');
      return;
    }

    // Update user with admin role
    await userDoc.ref.update({
      role: 'admin',
      roleAssignedAt: new Date(),
      permissions: ['all'],
      isActive: true,
      profileComplete: true
    });

    console.log('Admin user configured successfully');
  } catch (error) {
    console.error('Error setting up admin user:', error);
    throw error;
  }
}; 