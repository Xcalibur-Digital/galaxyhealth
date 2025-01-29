import { create } from 'zustand';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const useRecommendationsStore = create((set, get) => ({
  recommendations: [],
  metrics: null,
  loading: true,
  error: null,

  initialize: () => {
    let unsubscribe = () => {};

    try {
      if (!auth.currentUser) {
        console.log('No authenticated user found');
        set({ loading: false });
        return () => {};
      }

      console.log('Initializing recommendations store...');
      
      // Subscribe to recommendations
      const recsRef = collection(db, 'recommendations');
      const q = query(
        recsRef,
        orderBy('priority', 'desc'),
        orderBy('timestamp', 'desc')
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const recommendations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Received recommendations:', recommendations);
        set({ recommendations, loading: false });
      }, (error) => {
        console.error('Error in recommendations snapshot:', error);
        set({ error: error.message, loading: false });
      });

      // Get metrics
      const metricsRef = doc(db, 'metrics', 'vbc-score');
      onSnapshot(metricsRef, (doc) => {
        if (doc.exists()) {
          console.log('Received metrics:', doc.data());
          set({ metrics: doc.data() });
        }
      });

    } catch (error) {
      console.error('Error initializing recommendations:', error);
      set({ error: error.message, loading: false });
    }

    return unsubscribe;
  }
}));

export default useRecommendationsStore; 