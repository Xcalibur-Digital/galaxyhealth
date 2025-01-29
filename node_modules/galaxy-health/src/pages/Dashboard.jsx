import React from 'react';
import { Container, Grid, Title, Box, Paper, Group, Text, Button, Stack, ThemeIcon } from '@mantine/core';
import { useUser } from '../contexts/UserContext';
import { usePatient } from '../contexts/PatientContext';
import PatientAlert from '../components/patients/PatientAlert';
import { useNavigate } from 'react-router-dom';
import { SAVED_VIEWS } from '../utils/gridViews';
import NarrativeSummary from '../components/dashboard/NarrativeSummary';
import { 
  IconUserPlus, 
  IconAlertTriangle, 
  IconCalendarStats,
  IconStethoscope
} from '@tabler/icons-react';

const HighlightCard = ({ title, count, description, icon: Icon, color, onClick }) => (
  <Paper p="md" radius="md" withBorder onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
    <Group position="apart" mb="xs">
      <ThemeIcon size="xl" radius="md" color={color} variant="light">
        <Icon size={24} />
      </ThemeIcon>
      <Text size="xl" weight={700}>
        {count}
      </Text>
    </Group>
    <Text size="lg" weight={500} mb="xs">{title}</Text>
    <Text size="sm" color="dimmed">
      {description}
    </Text>
  </Paper>
);

const Dashboard = () => {
  const { activePatient } = usePatient();
  const { user } = useUser();
  const firstName = user?.displayName?.split(' ')[0] || 'there';
  const navigate = useNavigate();

  const navigateToPatientView = (viewId) => {
    navigate(`/patients?view=${viewId}`);
  };

  const highlights = [
    {
      title: 'High Risk Patients',
      count: '5',
      description: 'Patients requiring immediate attention',
      icon: IconAlertTriangle,
      color: 'red',
      view: SAVED_VIEWS.HIGH_RISK
    },
    {
      title: 'Care Gaps',
      count: '12',
      description: 'Open care gaps to address',
      icon: IconStethoscope,
      color: 'blue',
      view: SAVED_VIEWS.CARE_GAPS
    },
    {
      title: 'Due for AWV',
      count: '8',
      description: 'Annual Wellness Visits due this month',
      icon: IconCalendarStats,
      color: 'green',
      view: SAVED_VIEWS.MISSING_AWV
    },
    {
      title: 'Recent Visits',
      count: '15',
      description: 'Patients seen in the last 7 days',
      icon: IconUserPlus,
      color: 'grape',
      view: SAVED_VIEWS.RECENT_VISITS
    }
  ];

  return (
    <Container size="xl" py="xl">
      <Box pb="xl">
        <Title order={1} mb="lg" pl="md" color="dark.9">
          Welcome, {firstName}
        </Title>
        
        {activePatient && (
          <Box mb="lg">
            <PatientAlert patient={activePatient} />
          </Box>
        )}
      </Box>
      
      <Grid>
        {highlights.map((highlight, index) => (
          <Grid.Col key={index} span={3}>
            <HighlightCard
              {...highlight}
              onClick={() => navigateToPatientView(highlight.view)}
            />
          </Grid.Col>
        ))}
      </Grid>

      <NarrativeSummary />
    </Container>
  );
};

export default Dashboard; 