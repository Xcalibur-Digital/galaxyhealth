import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Title, 
  Text, 
  Group, 
  Stack,
  Loader,
  Center,
  createTheme,
  rem
} from '@mantine/core';
import { 
  IconHeartbeat, 
  IconStethoscope, 
  IconReportMedical,
  IconAlertCircle,
  IconCalendarStats,
  IconChartBar,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { usePatient } from '../../contexts/PatientContext';

import RiskScoreCard from './chart/RiskScoreCard';
import QualityMetrics from './chart/QualityMetrics';
import CareGaps from './chart/CareGaps';
import CarePathway from './chart/CarePathway';

const PatientDetails = () => {
  const { id } = useParams();
  const { patients, loading } = usePatient();
  
  // Find the current patient from the patients array
  const patient = patients?.find(p => p.id === id);

  if (loading) {
    return (
      <Center style={{ height: 'calc(100vh - 200px)' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!patient) {
    return (
      <Container size="xl" py="xl">
        <Paper p="xl" radius="md">
          <Text align="center" color="dimmed">
            Patient not found
          </Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Paper p="xl" radius="md" mb="lg">
        <Group position="apart" mb="xl">
          <Stack spacing={4}>
            <Title order={2}>
              {patient.firstName} {patient.lastName}
            </Title>
            <Text color="dimmed" size="sm">
              DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
            </Text>
          </Stack>
          <Group>
            <Text weight={500}>
              Risk Level: 
            </Text>
            <Text 
              weight={600}
              color={
                patient.riskLevel === 'high' ? 'red' : 
                patient.riskLevel === 'medium' ? 'yellow' : 
                'green'
              }
            >
              {patient.riskLevel?.toUpperCase()}
            </Text>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={4}>
            <RiskScoreCard patient={patient} />
          </Grid.Col>
          <Grid.Col span={8}>
            <QualityMetrics patient={patient} />
          </Grid.Col>
          <Grid.Col span={12}>
            <CareGaps patient={patient} />
          </Grid.Col>
          <Grid.Col span={12}>
            <CarePathway patient={patient} />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Additional patient details sections */}
      <Grid>
        <Grid.Col span={6}>
          <Paper p="xl" radius="md">
            <Title order={3} mb="lg">Recent Activity</Title>
            {/* Add recent activity content */}
          </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Paper p="xl" radius="md">
            <Title order={3} mb="lg">Care Plan</Title>
            {/* Add care plan content */}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default PatientDetails; 