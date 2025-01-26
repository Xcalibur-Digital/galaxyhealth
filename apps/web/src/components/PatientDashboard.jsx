import React, { useState, useEffect } from 'react';
import { Grid, Paper, Text, RingProgress, Group, Stack, Title, Card, Loader, Badge, Tabs, ScrollArea } from '@mantine/core';
import { 
  IconHeartbeat, IconLungs, IconActivity, IconPill, IconCalendarEvent,
  IconAlertTriangle, IconVaccine, IconTestPipe, IconStethoscope
} from '@tabler/icons-react';
import { fhirService } from '../services/fhirService';
import './PatientDashboard.css';

export default function PatientDashboard({ user }) {
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Using a test patient ID from HAPI FHIR
        const data = await fhirService.getPatientData('example');
        setHealthMetrics(data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError(err.response?.data?.message || 'Failed to load health data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  if (loading) return <div className="dashboard-container loading"><Loader size="xl" /></div>;
  if (error) return <div className="dashboard-container error"><Text color="red" size="xl">{error}</Text></div>;
  if (!healthMetrics) return null;

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'red';
      case 'moderate': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="dashboard-container">
      <Title order={2} mb="xl">Welcome back, {user.firstName}!</Title>
      
      <Tabs defaultValue="overview">
        <Tabs.List mb="md">
          <Tabs.Tab value="overview" icon={<IconHeartbeat size={14} />}>Overview</Tabs.Tab>
          <Tabs.Tab value="conditions" icon={<IconStethoscope size={14} />}>Conditions</Tabs.Tab>
          <Tabs.Tab value="medications" icon={<IconPill size={14} />}>Medications</Tabs.Tab>
          <Tabs.Tab value="labs" icon={<IconTestPipe size={14} />}>Lab Results</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Grid gutter="md">
            {/* Vitals Section */}
            <Grid.Col span={12} md={6}>
              <Paper shadow="sm" p="md" radius="md" className="dashboard-card">
                <Title order={3} mb="md" className="card-title">
                  <IconHeartbeat size={24} />
                  <span>Vital Signs</span>
                </Title>
                <Grid>
                  <Grid.Col span={6}>
                    <RingProgress
                      sections={[{ value: healthMetrics.vitals.heartRate || 0, color: 'blue' }]}
                      label={
                        <Text size="xl" align="center">
                          {healthMetrics.vitals.heartRate || '--'}
                          <Text size="xs">BPM</Text>
                        </Text>
                      }
                    />
                    <Text align="center" mt="sm">Heart Rate</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <RingProgress
                      sections={[{ value: healthMetrics.vitals.oxygenSaturation || 0, color: 'green' }]}
                      label={
                        <Text size="xl" align="center">
                          {healthMetrics.vitals.oxygenSaturation || '--'}
                          <Text size="xs">%</Text>
                        </Text>
                      }
                    />
                    <Text align="center" mt="sm">O2 Saturation</Text>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Grid.Col>

            {/* Allergies Section */}
            <Grid.Col span={12} md={6}>
              <Paper shadow="sm" p="md" radius="md" className="dashboard-card">
                <Title order={3} mb="md" className="card-title">
                  <IconAlertTriangle size={24} />
                  <span>Allergies</span>
                </Title>
                <ScrollArea h={200}>
                  <Stack spacing="md">
                    {healthMetrics.allergies.map((allergy, index) => (
                      <Card key={index} p="sm" radius="sm" className="allergy-card">
                        <Group position="apart">
                          <div>
                            <Text weight={500}>{allergy.substance}</Text>
                            <Badge color={getSeverityColor(allergy.severity)}>{allergy.severity}</Badge>
                          </div>
                          <Badge>{allergy.type}</Badge>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </ScrollArea>
              </Paper>
            </Grid.Col>

            {/* Recent Lab Results */}
            <Grid.Col span={12}>
              <Paper shadow="sm" p="md" radius="md" className="dashboard-card">
                <Title order={3} mb="md" className="card-title">
                  <IconTestPipe size={24} />
                  <span>Recent Lab Results</span>
                </Title>
                <ScrollArea>
                  <Grid>
                    {healthMetrics.labResults.slice(0, 4).map((lab, index) => (
                      <Grid.Col key={index} span={12} md={6}>
                        <Card p="sm" radius="sm" className="lab-card">
                          <Group position="apart">
                            <div>
                              <Text weight={500}>{lab.test}</Text>
                              <Text size="sm" color="dimmed">{lab.date}</Text>
                            </div>
                            <div>
                              <Text weight={500}>{lab.result}</Text>
                              <Badge>{lab.interpretation}</Badge>
                            </div>
                          </Group>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                </ScrollArea>
              </Paper>
            </Grid.Col>

            {/* Upcoming Appointments */}
            <Grid.Col span={12} md={6}>
              <Paper shadow="sm" p="md" radius="md" className="dashboard-card">
                <Title order={3} mb="md" className="card-title">
                  <IconCalendarEvent size={24} />
                  <span>Upcoming Appointments</span>
                </Title>
                <Stack spacing="md">
                  {healthMetrics.appointments.map((apt, index) => (
                    <Card key={index} p="sm" radius="sm" className="appointment-card">
                      <Group position="apart">
                        <div>
                          <Text weight={500}>{apt.type}</Text>
                          <Text size="sm" color="dimmed">{apt.date}</Text>
                        </div>
                        <Text size="sm">{apt.time}</Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Grid.Col>

            {/* Recent Procedures */}
            <Grid.Col span={12} md={6}>
              <Paper shadow="sm" p="md" radius="md" className="dashboard-card">
                <Title order={3} mb="md" className="card-title">
                  <IconStethoscope size={24} />
                  <span>Recent Procedures</span>
                </Title>
                <Stack spacing="md">
                  {healthMetrics.procedures.map((procedure, index) => (
                    <Card key={index} p="sm" radius="sm" className="procedure-card">
                      <Group position="apart">
                        <div>
                          <Text weight={500}>{procedure.name}</Text>
                          <Text size="sm" color="dimmed">{procedure.date}</Text>
                        </div>
                        <Badge>{procedure.status}</Badge>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Additional tab panels will be added in the next message */}
      </Tabs>
    </div>
  );
} 