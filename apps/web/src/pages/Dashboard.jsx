import React from 'react';
import { Container, Grid, Title, Box } from '@mantine/core';
import { useUser } from '../contexts/UserContext';
import AIGuidance from '../components/dashboard/AIGuidance';
import { usePatient } from '../contexts/PatientContext';
import PatientAlert from '../components/patients/PatientAlert';

const Dashboard = () => {
  const { activePatient } = usePatient();
  const { user } = useUser();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <Box py="md" px="0">
      <Title order={1} mb="lg" pl="md" color="dark.9">
        Welcome, {firstName}
      </Title>
      
      {activePatient && (
        <Box mb="lg">
          <PatientAlert patient={activePatient} />
        </Box>
      )}
      
      <Grid gutter={0}>
        <Grid.Col span={12}>
          <AIGuidance />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Dashboard; 