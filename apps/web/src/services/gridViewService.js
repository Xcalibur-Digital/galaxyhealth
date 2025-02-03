import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

export const gridViewService = {
  async saveView(userId, viewId, viewData) {
    try {
      const viewRef = doc(db, 'users', userId, 'gridViews', viewId);
      await setDoc(viewRef, {
        ...viewData,
        updatedAt: new Date().toISOString(),
        id: viewId
      });
      return viewId;
    } catch (error) {
      console.error('Error saving grid view:', error);
      throw error;
    }
  },

  async getViews(userId) {
    try {
      const viewsRef = collection(db, 'users', userId, 'gridViews');
      const snapshot = await getDocs(viewsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching grid views:', error);
      throw error;
    }
  },

  async deleteView(userId, viewId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'gridViews', viewId));
    } catch (error) {
      console.error('Error deleting grid view:', error);
      throw error;
    }
  }
}; 