import { create } from 'zustand';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  writeBatch,
  where,
  addDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const useNotificationStore = create((set, get) => {
  console.log('Creating notification store');
  
  return {
    notifications: [],
    loading: true,
    error: null,

    initialize: () => {
      console.log('Initializing notifications');
      let unsubscribe = () => {};

      try {
        if (!auth.currentUser) {
          console.log('No authenticated user');
          set({ loading: false });
          return () => {};
        }

        console.log('Setting up Firestore listener for:', auth.currentUser.uid);
        const notificationsRef = collection(db, 'notifications');
        const q = query(
          notificationsRef,
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc'),
          limit(100)
        );

        unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const notifications = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate()?.toISOString() || data.createdAt,
              };
            });
            console.log('Received notifications:', notifications);
            set({ notifications, loading: false });
          },
          (error) => {
            console.error('Error loading notifications:', error);
            set({ error: error.message, loading: false });
          }
        );
      } catch (error) {
        console.error('Error initializing notifications:', error);
        set({ error: error.message, loading: false });
      }

      return unsubscribe;
    },

    addNotification: async (notification) => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('Must be authenticated to add notifications');
          return;
        }

        const notificationsRef = collection(db, 'notifications');
        await addDoc(notificationsRef, {
          ...notification,
          userId: user.uid,
          timestamp: serverTimestamp(),
          createdAt: new Date().toISOString(),
          read: false
        });
      } catch (error) {
        console.error('Error adding notification:', error);
      }
    },

    markAsRead: async (notificationId) => {
      try {
        await updateDoc(doc(db, 'notifications', notificationId), {
          read: true
        });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },

    clearNotifications: async () => {
      try {
        const batch = writeBatch(db);
        const notifications = get().notifications;
        
        notifications.forEach((notification) => {
          const docRef = doc(db, 'notifications', notification.id);
          batch.delete(docRef);
        });

        await batch.commit();
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    },

    getUnreadCount: () => {
      return get().notifications.filter(n => !n.read).length;
    }
  };
});

export default useNotificationStore; 