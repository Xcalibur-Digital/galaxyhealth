import { useContext } from 'react';
import { PatientContext } from './context';
export const usePatient = () => useContext(PatientContext); 