import React, { createContext, useContext, useState } from 'react';
import { fhirService } from '../services/fhirService';

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await fhirService.getPatients(searchTerm);
      setPatients(data.entry || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    patients,
    selectedPatient,
    loading,
    error,
    setSelectedPatient,
    fetchPatients
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}; 