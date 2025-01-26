import React, { useEffect, useState } from 'react';
import { Table, Text, Paper, Title, Loader, Center, Button, Group, Switch } from '@mantine/core';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { seedPatients } from '../utils/seedPatients';
import { searchFHIRPatients } from '../utils/fhirService';
import { useAuthState } from 'react-firebase-hooks/auth';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useFHIR, setUseFHIR] = useState(true);
  const [user, authLoading] = useAuthState(auth);

  const fetchFirestorePatients = async () => {
    const patientsCollection = collection(db, 'patients');
    const querySnapshot = await getDocs(patientsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };

  const fetchPatients = async () => {
    try {
      if (!user) {
        setError('Please sign in to view patients');
        setLoading(false);
        return;
      }

      setLoading(true);
      let patientList = [];
      
      if (useFHIR) {
        console.log('Fetching FHIR patients...');
        patientList = await searchFHIRPatients();
      } else {
        console.log('Fetching Firestore patients...');
        patientList = await fetchFirestorePatients();
      }
      
      console.log('Fetched patients:', patientList);
      setPatients(patientList);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(`Failed to load patients: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPatients();
    }
  }, [useFHIR, user, authLoading]);

  const handleAddTestData = async () => {
    await seedPatients();
    fetchPatients();
  };

  if (authLoading || loading) {
    return (
      <Center style={{ height: 200 }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Text color="red" align="center">
        Please sign in to view patients
      </Text>
    );
  }

  if (error) {
    return (
      <Text color="red" align="center">
        {error}
      </Text>
    );
  }

  return (
    <Paper p="md" radius="md">
      <Group position="apart" mb="md">
        <Title order={2}>Patients</Title>
        <Group>
          <Switch
            label="Use FHIR Data"
            checked={useFHIR}
            onChange={(event) => setUseFHIR(event.currentTarget.checked)}
          />
          {!useFHIR && (
            <Button onClick={fetchPatients} color="blue">
              Refresh
            </Button>
          )}
        </Group>
      </Group>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{`${patient.firstName} ${patient.lastName}`}</td>
              <td>{patient.dateOfBirth}</td>
              <td>{patient.gender}</td>
              <td>{patient.phone || patient.email}</td>
              <td>{patient.lastVisit || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {patients.length === 0 && (
        <Text align="center" mt="md" color="dimmed">
          {useFHIR ? 'No patients found in FHIR store.' : 'No patients found in Firestore.'}
        </Text>
      )}
    </Paper>
  );
};

export default PatientList; 