import { useState, useCallback } from 'react';
import { fhirService } from '../services/api/fhirApi';

export function useFHIR() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async (searchTerm = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fhirService.getPatients(searchTerm);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatientDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fhirService.getPatientDetails(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchPatients,
    fetchPatientDetails
  };
} 