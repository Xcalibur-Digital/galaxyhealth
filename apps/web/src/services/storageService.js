import { 
  doc, 
  collection, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const storageService = {
  // User Settings
  async getUserSettings(userId) {
    try {
      const docRef = doc(db, 'userSettings', userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // Create default settings if none exist
        const defaultSettings = {
          theme: 'dark',
          notifications: true,
          dashboardLayout: 'default',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(docRef, defaultSettings);
        return defaultSettings;
      }
      
      return docSnap.data();
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  },

  async updateUserSettings(userId, settings) {
    try {
      const docRef = doc(db, 'userSettings', userId);
      await updateDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },

  // Application Settings
  async getAppSettings() {
    try {
      const docRef = doc(db, 'appSettings', 'config');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const defaultConfig = {
          fhirServerUrl: import.meta.env.VITE_FHIR_SERVER_URL || '',
          apiRateLimit: 100,
          debugMode: false,
          maintenanceMode: false,
          version: '1.0.0',
          features: {
            appointments: true,
            messaging: true,
            analytics: true
          },
          updatedAt: new Date().toISOString()
        };
        
        // Remove any undefined values
        Object.keys(defaultConfig).forEach(key => {
          if (defaultConfig[key] === undefined) {
            delete defaultConfig[key];
          }
        });

        await setDoc(docRef, defaultConfig);
        return defaultConfig;
      }
      
      return docSnap.data();
    } catch (error) {
      console.error('Error getting app settings:', error);
      // Return default settings on error
      return {
        apiRateLimit: 100,
        debugMode: false,
        maintenanceMode: false,
        version: '1.0.0',
        features: {
          appointments: true,
          messaging: true,
          analytics: true
        }
      };
    }
  },

  async updateAppSettings(settings) {
    try {
      const docRef = doc(db, 'appSettings', 'config');
      await updateDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating app settings:', error);
      throw error;
    }
  },

  // User Preferences
  async getUserPreferences(userId) {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const defaultPreferences = {
          favoritePatients: [],
          recentSearches: [],
          customViews: [],
          shortcuts: [],
          updatedAt: serverTimestamp()
        };
        
        await setDoc(docRef, defaultPreferences);
        return defaultPreferences;
      }
      
      return docSnap.data();
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  },

  async addFavoritePatient(userId, patientId) {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      await updateDoc(docRef, {
        favoritePatients: arrayUnion(patientId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding favorite patient:', error);
      throw error;
    }
  },

  async removeFavoritePatient(userId, patientId) {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      await updateDoc(docRef, {
        favoritePatients: arrayRemove(patientId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing favorite patient:', error);
      throw error;
    }
  },

  // Audit Logs
  async logAuditEvent(event) {
    try {
      const auditRef = collection(db, 'auditLogs');
      await setDoc(doc(auditRef), {
        ...event,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging audit event:', error);
      throw error;
    }
  },

  async logRegistration(userId, email) {
    try {
      await this.logAuditEvent({
        type: 'USER_REGISTRATION',
        userId,
        email,
        details: {
          timestamp: new Date().toISOString(),
          action: 'USER_CREATED'
        }
      });
    } catch (error) {
      console.error('Error logging registration:', error);
    }
  },

  async updateAccountStatus(userId, status) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountStatus: status,
        statusUpdatedAt: new Date().toISOString(),
        isActive: status === 'active',
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating account status:', error);
      throw error;
    }
  },

  async updateUserRole(userId, role) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role,
        roleUpdatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        permissions: role === 'admin' ? ['all'] : ['basic']
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
};

export default storageService; 