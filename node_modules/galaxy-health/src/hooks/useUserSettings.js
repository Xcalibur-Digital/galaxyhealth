import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export const useUserSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      if (!auth.currentUser) return;

      const settingsRef = doc(db, 'userSettings', auth.currentUser.uid);
      const snapshot = await getDoc(settingsRef);
      
      if (snapshot.exists()) {
        setSettings(snapshot.data());
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    if (!auth.currentUser) return;

    const settingsRef = doc(db, 'userSettings', auth.currentUser.uid);
    await setDoc(settingsRef, {
      ...settings,
      ...newSettings,
      updatedAt: new Date()
    }, { merge: true });

    setSettings(current => ({
      ...current,
      ...newSettings
    }));
  };

  return { settings, loading, updateSettings };
}; 