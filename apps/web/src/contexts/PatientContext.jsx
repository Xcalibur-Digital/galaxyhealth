import { createContext, useContext, useState, useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import { IconUserCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../stores/notificationStore';

const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const [activePatient, setActivePatient] = useState(null);
  const navigate = useNavigate();
  const addNotification = useNotificationStore(state => state.addNotification);
  
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

  return (
    <PatientContext.Provider value={{ activePatient, setActivePatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext); 