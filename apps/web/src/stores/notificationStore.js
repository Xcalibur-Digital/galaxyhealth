import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (notification) => {
        console.log('Adding notification:', notification); // Debug log
        set((state) => {
          const newNotifications = [...state.notifications, {
            ...notification,
            id: `${notification.type}-${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
            source: notification.source || 'browser',
            appName: notification.appName
          }];
          console.log('Updated notifications:', newNotifications); // Debug log
          return { notifications: newNotifications };
        });
      },
      markAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      })),
      clearNotifications: () => set({ notifications: [] }),
      getUnreadCount: () => get().notifications.filter(n => !n.read).length
    }),
    {
      name: 'galaxy-health-notifications',
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrated state:', state); // Debug log
      }
    }
  )
);

export default useNotificationStore; 