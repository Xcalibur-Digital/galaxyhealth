import { useState, useCallback } from 'react';
import { fhirService } from '../services/api/fhirApi';

export function useFHIR() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = useCallback(async (request) => {
    setLoading(true);
    setError(null);
    try {
      const data = await request();
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
    fetchPatients: (searchTerm) => handleRequest(() => fhirService.getPatients(searchTerm)),
    fetchPatientDetails: (id) => handleRequest(() => fhirService.getPatientDetails(id)),
    fetchPatientResources: (patientId, resourceType) => 
      handleRequest(() => fhirService.getPatientResources(patientId, resourceType))
  };
}

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
} 