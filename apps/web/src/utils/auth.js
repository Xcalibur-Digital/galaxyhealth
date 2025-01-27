import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../config/firebase';

export const saveUserProfile = async (userId, profileData) => {
  try {
    const db = getFirestore();
    await setDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is signed in');
  }

  // Get the ID token with Google Healthcare API scope
  const token = await user.getIdToken(true);
  
  // For Google Healthcare API, we need to exchange this token
  // This would typically be done through your backend
  const response = await fetch('/api/auth/healthcare-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get Healthcare API token');
  }

  const { accessToken } = await response.json();
  return accessToken;
}; 