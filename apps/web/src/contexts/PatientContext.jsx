import { createContext, useContext, useState, useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import { IconUserCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../stores/notificationStore';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const [activePatient, setActivePatient] = useState(null);
  const navigate = useNavigate();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('Setting up patient context listener');
    
    // Test function to verify messaging
    window.testPatientContext = (patientData) => {
      console.log('Testing patient context with:', patientData);
      window.postMessage({
        type: 'PATIENT_CONTEXT_UPDATED',
        data: patientData
      }, '*');
    };
    
    // Listen for messages from Chrome extension
    const handleMessage = (event) => {
      console.log('Received message in web app:', event);
      
      if (event.data?.type === 'PATIENT_CONTEXT_UPDATED') {
        console.log('Updating patient context:', event.data.data);
        const patient = event.data.data;
        setActivePatient(patient);
        
        // Format patient name consistently
        const patientName = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
        
        // Add to persistent notification store
        addNotification({
          type: 'PATIENT_CONTEXT',
          title: 'Patient Context Detected',
          message: `Active patient: ${patientName}`,
          patientId: patient.id,
          patientInfo: {
            name: patientName,
            mrn: patient.identifier?.[0]?.value,
            id: patient.id
          },
          source: patient.source,
          appName: patient.appName
        });
        
        // Show immediate notification
        showNotification({
          title: 'Patient Context Detected',
          message: `Active patient: ${patientName}`,
          color: 'blue',
          icon: <IconUserCheck size={16} />,
          autoClose: 5000,
          onClick: () => navigate(`/patients/${patient.id}`)
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      delete window.testPatientContext;
    };
  }, [navigate, addNotification]);

  const fetchPatients = async () => {
    try {
      const patientsRef = collection(db, 'patients');
      const q = query(patientsRef, orderBy('lastName', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const patients = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        patients.push({
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          riskLevel: data.riskLevel || 'low',
          lastVisit: data.lastVisit,
          careGaps: data.careGaps || [],
          provider: data.provider || '',
          // Add other fields as needed
        });
      });
      
      return patients;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      try {
        const patientsData = await fetchPatients();
        console.log('Loaded patients:', patientsData);
        setPatients(patientsData);
      } catch (error) {
        console.error('Error loading patients:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  return (
    <PatientContext.Provider value={{ activePatient, setActivePatient, patients, loading, error }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext); 