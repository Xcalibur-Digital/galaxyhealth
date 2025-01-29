import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  // Use same config as web app
  projectId: "galaxyhealth",
  // ... other config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const StorageService = {
  async addNotification(notification) {
    try {
      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, {
        ...notification,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      return false;
    }
  },

  subscribeToNotifications(callback) {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(notifications);
    });
  }
};

export default StorageService; 