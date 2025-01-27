import React, { useState, useEffect } from 'react';
import { Table, Text, Paper, Title, Loader, Center, Group, Badge, Switch } from '@mantine/core';
import { searchFHIRPatients } from '../../services/fhirService';
import { useUser } from '../../contexts/UserContext';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useFHIR, setUseFHIR] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchPatients();
  }, [useFHIR, user]);

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

  if (loading) {
    return (
      <Center style={{ height: 200 }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Paper p="md" style={{ backgroundColor: '#FEE2E2' }}>
        <Text color="red" align="center">{error}</Text>
      </Paper>
    );
  }

  return (
    <Paper p="md">
      <Group position="apart" mb="md">
        <Title order={2}>Recent Patients</Title>
        <Group>
          <Switch
            label="Use FHIR Data"
            checked={useFHIR}
            onChange={(event) => setUseFHIR(event.currentTarget.checked)}
          />
        </Group>
      </Group>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Risk Level</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.identifier}</td>
              <td style={{ textTransform: 'capitalize' }}>{patient.gender}</td>
              <td>{patient.birthDate}</td>
              <td>
                <Badge color={patient.riskLevel === 'high' ? 'red' : 'green'}>
                  {patient.riskLevel?.toUpperCase() || 'LOW'}
                </Badge>
              </td>
              <td>{patient.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {patients.length === 0 && (
        <Text align="center" mt="md" color="dimmed">
          No patients found
        </Text>
      )}
    </Paper>
  );
};

export default PatientList; 