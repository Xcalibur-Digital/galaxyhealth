import React, { useState, useEffect } from 'react';
import { Table, Text, Paper, Title, Loader, Center, Group, Badge } from '@mantine/core';
import { getRecentPatients } from '../../services/fhirService';

const PatientList = ({ limit = 10 }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await getRecentPatients(limit);
        
        // Transform FHIR patient resources and calculate gaps
        const formattedPatients = data.entry?.map(entry => {
          const resource = entry.resource;
          const name = resource.name?.[0] || {};
          
          // Calculate risk gaps from conditions and observations
          const riskGaps = calculateRiskGaps(resource.conditions || [], resource.observations || []);
          
          // Calculate care gaps from care plans and appointments
          const careGaps = calculateCareGaps(resource.carePlans || [], resource.appointments || []);

          return {
            id: resource.id,
            name: `${name.given?.[0] || ''} ${name.family || ''}`.trim() || 'Unknown',
            gender: resource.gender || 'Unknown',
            birthDate: resource.birthDate || 'Unknown',
            identifier: resource.identifier?.[0]?.value || 'N/A',
            lastUpdated: new Date(resource.meta?.lastUpdated).toLocaleDateString(),
            riskGaps: riskGaps.length,
            careGaps: careGaps.length,
            riskLevel: calculateRiskLevel(riskGaps)
          };
        }) || [];

        setPatients(formattedPatients);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err.message || 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [limit]);

  const calculateRiskGaps = (conditions, observations) => {
    // Example risk gap calculation logic
    const gaps = [];
    
    // Check for missing vital signs
    const requiredVitals = ['blood-pressure', 'heart-rate', 'body-weight'];
    const missingVitals = requiredVitals.filter(vital => 
      !observations.some(obs => obs.code?.coding?.[0]?.code === vital)
    );
    gaps.push(...missingVitals);

    // Check for unmanaged conditions
    conditions.forEach(condition => {
      if (!condition.clinicalStatus || condition.clinicalStatus.coding?.[0]?.code === 'active') {
        gaps.push(`unmanaged-${condition.code?.coding?.[0]?.code}`);
      }
    });

    return gaps;
  };

  const calculateCareGaps = (carePlans, appointments) => {
    // Example care gap calculation logic
    const gaps = [];
    
    // Check for overdue appointments
    const today = new Date();
    appointments.forEach(apt => {
      const aptDate = new Date(apt.start);
      if (aptDate < today && apt.status !== 'fulfilled') {
        gaps.push(`overdue-appointment-${apt.type?.coding?.[0]?.code}`);
      }
    });

    // Check for incomplete care plan activities
    carePlans.forEach(plan => {
      plan.activity?.forEach(activity => {
        if (!activity.outcomeReference) {
          gaps.push(`incomplete-${activity.detail?.code?.coding?.[0]?.code}`);
        }
      });
    });

    return gaps;
  };

  const calculateRiskLevel = (riskGaps) => {
    if (riskGaps.length >= 5) return 'high';
    if (riskGaps.length >= 2) return 'medium';
    return 'low';
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Center style={{ height: 200 }}>
        <Loader size="lg" />
        <Text ml="md">Loading patients...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Paper p="md" style={{ backgroundColor: '#FEE2E2' }}>
        <Text color="red" align="center">Error: {error}</Text>
      </Paper>
    );
  }

  return (
    <Paper p="md">
      <Group position="apart" mb="md">
        <Title order={2}>Recent Patients</Title>
        <Text color="dimmed" size="sm">
          Showing {patients.length} patients
        </Text>
      </Group>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Risk Level</th>
            <th>Risk Gaps</th>
            <th>Care Gaps</th>
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
                <Badge color={getRiskBadgeColor(patient.riskLevel)}>
                  {patient.riskLevel.toUpperCase()}
                </Badge>
              </td>
              <td>
                <Badge color={patient.riskGaps > 0 ? 'red' : 'green'}>
                  {patient.riskGaps}
                </Badge>
              </td>
              <td>
                <Badge color={patient.careGaps > 0 ? 'red' : 'green'}>
                  {patient.careGaps}
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