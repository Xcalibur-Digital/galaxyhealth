import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Title, 
  Text, 
  Group, 
  Stack,
  RingProgress,
  ThemeIcon,
  Badge,
  Tabs,
  List,
  Loader,
  Center
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
import { getFHIRPatient } from '../../services/fhirService';

import RiskScoreCard from './chart/RiskScoreCard';
import QualityMetrics from './chart/QualityMetrics';
import CareGaps from './chart/CareGaps';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const data = await getFHIRPatient(id);
        setPatient(data);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container>
        <Text color="red" align="center">Error loading patient: {error}</Text>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container>
        <Text align="center">No patient found</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Patient Header */}
      <Paper p="xl" mb="xl" radius="md" withBorder>
        <Grid>
          <Grid.Col span={8}>
            <Stack spacing="xs">
              <Group position="apart">
                <Title order={2}>
                  {patient.name[0].given.join(' ')} {patient.name[0].family}
                </Title>
                <Badge size="lg" color="blue">Active</Badge>
              </Group>
              <Group spacing="xl">
                <Text color="dimmed">MRN: {patient.identifier?.[0]?.value || 'N/A'}</Text>
                <Text color="dimmed">DOB: {patient.birthDate}</Text>
                <Text color="dimmed">Gender: {patient.gender}</Text>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={4}>
            <Paper p="md" radius="md" withBorder>
              <Stack spacing="xs">
                <Text size="sm" color="dimmed">Next Visit</Text>
                <Text weight={500}>March 15, 2024</Text>
                <Text size="xs" color="dimmed">Annual Wellness Visit</Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <Tabs.List mb="xl">
          <Tabs.Tab value="overview" icon={<IconHeartbeat size={14} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="quality" icon={<IconChartBar size={14} />}>
            Quality & Risk
          </Tabs.Tab>
          <Tabs.Tab value="cost" icon={<IconCurrencyDollar size={14} />}>
            Cost & Utilization
          </Tabs.Tab>
          <Tabs.Tab value="care" icon={<IconStethoscope size={14} />}>
            Care Plan
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
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
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="quality">
          <Grid>
            <Grid.Col span={6}>
              <Paper p="md" radius="md" withBorder>
                <Title order={3} mb="md">HCC Risk Factors</Title>
                <List spacing="md">
                  <List.Item icon={
                    <ThemeIcon color="red" size={24} radius="xl">
                      <IconAlertCircle size={16} />
                    </ThemeIcon>
                  }>
                    <Text weight={500}>Diabetes with Complications (HCC 18)</Text>
                    <Text size="sm" color="dimmed">RAF Score: 0.368</Text>
                  </List.Item>
                  <List.Item icon={
                    <ThemeIcon color="orange" size={24} radius="xl">
                      <IconAlertCircle size={16} />
                    </ThemeIcon>
                  }>
                    <Text weight={500}>Congestive Heart Failure (HCC 85)</Text>
                    <Text size="sm" color="dimmed">RAF Score: 0.323</Text>
                  </List.Item>
                </List>
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper p="md" radius="md" withBorder>
                <Title order={3} mb="md">Quality Measures</Title>
                <Stack spacing="md">
                  <Group position="apart">
                    <Text>Diabetes Eye Exam</Text>
                    <Badge color="red">Due</Badge>
                  </Group>
                  <Group position="apart">
                    <Text>Blood Pressure Control</Text>
                    <Badge color="green">Met</Badge>
                  </Group>
                  <Group position="apart">
                    <Text>Annual Wellness Visit</Text>
                    <Badge color="yellow">Scheduled</Badge>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="cost">
          <Grid>
            <Grid.Col span={6}>
              <Paper p="md" radius="md" withBorder>
                <Title order={3} mb="md">Utilization Metrics</Title>
                <Stack spacing="md">
                  <Group position="apart">
                    <Text>ED Visits (Last 12 months)</Text>
                    <Text weight={500}>2</Text>
                  </Group>
                  <Group position="apart">
                    <Text>Inpatient Admissions</Text>
                    <Text weight={500}>1</Text>
                  </Group>
                  <Group position="apart">
                    <Text>Readmission Risk</Text>
                    <Badge color="yellow">Medium</Badge>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper p="md" radius="md" withBorder>
                <Title order={3} mb="md">Cost Analysis</Title>
                <Stack spacing="md">
                  <Group position="apart">
                    <Text>Total Cost of Care (YTD)</Text>
                    <Text weight={500}>$12,450</Text>
                  </Group>
                  <Group position="apart">
                    <Text>Pharmacy Spend</Text>
                    <Text weight={500}>$3,200</Text>
                  </Group>
                  <Group position="apart">
                    <Text>Cost Trend</Text>
                    <Badge color="red">+15% YoY</Badge>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="care">
          <Grid>
            <Grid.Col span={12}>
              <Paper p="md" radius="md" withBorder>
                <Title order={3} mb="md">Care Plan</Title>
                <List spacing="md">
                  <List.Item icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCalendarStats size={16} />
                    </ThemeIcon>
                  }>
                    <Text weight={500}>Care Management Enrollment</Text>
                    <Text size="sm" color="dimmed">
                      Enrolled in Diabetes Management Program
                    </Text>
                  </List.Item>
                  <List.Item icon={
                    <ThemeIcon color="green" size={24} radius="xl">
                      <IconReportMedical size={16} />
                    </ThemeIcon>
                  }>
                    <Text weight={500}>Medication Review</Text>
                    <Text size="sm" color="dimmed">
                      Scheduled for next visit
                    </Text>
                  </List.Item>
                </List>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default PatientDetails; 