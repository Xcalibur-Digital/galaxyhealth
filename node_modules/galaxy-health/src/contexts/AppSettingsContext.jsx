import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { useUser } from './UserContext';

const AppSettingsContext = createContext(null);

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
};

export const AppSettingsProvider = ({ children }) => {
  const { user } = useUser();
  const [appSettings, setAppSettings] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load app settings
        const appConfig = await storageService.getAppSettings().catch(() => ({
          apiRateLimit: 100,
          debugMode: false,
          maintenanceMode: false,
          version: '1.0.0',
          features: {
            appointments: true,
            messaging: true,
            analytics: true
          }
        }));
        setAppSettings(appConfig);

        // Load user-specific settings if logged in
        if (user) {
          const [settings, preferences] = await Promise.all([
            storageService.getUserSettings(user.uid).catch(() => null),
            storageService.getUserPreferences(user.uid).catch(() => null)
          ]);
          
          if (settings) setUserSettings(settings);
          if (preferences) setUserPreferences(preferences);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const updateAppSettings = async (newSettings) => {
    try {
      await storageService.updateAppSettings(newSettings);
      setAppSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Error updating app settings:', error);
      throw error;
    }
  };

  const updateUserSettings = async (newSettings) => {
    try {
      await storageService.updateUserSettings(user.uid, newSettings);
      setUserSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  };

  const value = {
    appSettings,
    userSettings,
    userPreferences,
    loading,
    updateAppSettings,
    updateUserSettings,
    storageService
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {!loading && children}
    </AppSettingsContext.Provider>
  );
}; 