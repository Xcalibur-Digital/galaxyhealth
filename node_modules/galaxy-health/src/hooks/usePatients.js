import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';

export const usePatients = (filters = {}) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const patientsRef = collection(db, 'patients');
        let q = query(patientsRef, orderBy('name'));

        // Apply filters
        if (filters.riskLevel?.length) {
          q = query(q, where('riskLevel', 'in', filters.riskLevel));
        }
        if (filters.careGaps?.length) {
          q = query(q, where('hasOpenCareGaps', '==', true));
        }
        if (filters.awvStatus?.length) {
          q = query(q, where('awvStatus', 'in', filters.awvStatus));
        }

        const snapshot = await getDocs(q);
        const patientData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPatients(patientData);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [filters]);

  return { patients, loading, error };
}; 