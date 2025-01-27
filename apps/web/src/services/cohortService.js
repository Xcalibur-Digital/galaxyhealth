import { db, auth } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  updateDoc,
  increment,
  writeBatch,
  arrayUnion,
  onSnapshot
} from 'firebase/firestore';

/**
 * @typedef {Object} CohortMetrics
 * @property {string} id
 * @property {string} name
 * @property {number} totalPatients
 * @property {Object} riskProfile
 * @property {number} riskProfile.high
 * @property {number} riskProfile.medium
 * @property {number} riskProfile.low
 * @property {number} careGaps
 * @property {number} adherence
 * @property {string} updatedAt
 * @property {string} createdAt
 */

// ... add other JSDoc type definitions ...

export const cohortService = {
  /**
   * Get all cohort metrics
   * @returns {Promise<CohortMetrics[]>}
   */
  async getCohortMetrics() {
    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      console.log('Fetching cohort metrics...');
      const metricsRef = collection(db, 'cohortMetrics');
      const snapshot = await getDocs(metricsRef);
      
      const metrics = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return metrics;
    } catch (error) {
      console.error('Error fetching cohort metrics:', error);
      throw error;
    }
  },

  /**
   * Get recommendations for a cohort
   * @param {string} cohortId
   */
  async getCohortRecommendations(cohortId) {
    try {
      const snapshot = await getDocs(
        collection(db, `cohortMetrics/${cohortId}/recommendations`)
      );
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  },

  /**
   * Get patient care pathways
   * @param {string} patientId
   */
  async getPatientCarePathways(patientId) {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'patientCarePathways'),
          where('patientId', '==', patientId)
        )
      );
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching care pathways:', error);
      return [];
    }
  },

  /**
   * Get care gaps for a patient
   * @param {string} patientId
   */
  async getPatientCareGaps(patientId) {
    try {
      const pathways = await this.getPatientCarePathways(patientId);
      return pathways.reduce((gaps, pathway) => [...gaps, ...pathway.careGaps], []);
    } catch (error) {
      console.error('Error fetching care gaps:', error);
      return [];
    }
  },

  /**
   * Update patient risk level
   * @param {string} pathwayId
   * @param {'high' | 'medium' | 'low'} riskLevel
   */
  async updatePatientRiskLevel(pathwayId, riskLevel) {
    try {
      const pathwayRef = doc(db, 'patientCarePathways', pathwayId);
      const pathwayDoc = await getDoc(pathwayRef);
      
      if (!pathwayDoc.exists()) throw new Error('Pathway not found');

      const pathway = pathwayDoc.data();
      
      await updateDoc(pathwayRef, {
        riskLevel,
        riskHistory: [
          ...pathway.riskHistory || [],
          {
            level: riskLevel,
            timestamp: new Date().toISOString()
          }
        ],
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating risk level:', error);
      throw error;
    }
  },

  /**
   * Subscribe to cohort updates
   * @param {string} cohortId
   * @param {function} callback
   */
  subscribeToUpdates(cohortId, callback) {
    return onSnapshot(doc(db, 'cohortMetrics', cohortId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }
}; 