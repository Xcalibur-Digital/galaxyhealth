import { getFirestore, doc, setDoc } from 'firebase/firestore';

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