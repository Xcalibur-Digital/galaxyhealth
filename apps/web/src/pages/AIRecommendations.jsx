import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Paper, 
  Text, 
  Group, 
  Stack, 
  Badge, 
  Select,
  Tabs,
  Card,
  List,
  ThemeIcon,
  Button,
  Divider,
  Grid,
  Progress,
  ActionIcon,
  Tooltip,
  Alert
} from '@mantine/core';
import { 
  IconBrain, 
  IconStethoscope,
  IconHeart,
  IconLungs,
  IconBottle,
  IconActivity,
  IconArrowRight,
  IconAlertCircle,
  IconChecks,
  IconUsers,
  IconInfoCircle,
  IconChartBar
} from '@tabler/icons-react';
import { cohortService } from '../services/cohortService.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useUser } from '../contexts/UserContext';

const CohortCard = ({ cohort }) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    <Stack spacing="md">
      <Group position="apart">
        <Group>
          <ThemeIcon size="xl" radius="md" variant="light">
            <cohort.icon size={24} />
          </ThemeIcon>
          <div>
            <Title order={4}>{cohort.name}</Title>
            <Text size="sm" color="dimmed">
              {cohort.patientCount} Patients
            </Text>
          </div>
        </Group>
        <Tooltip label="View cohort details">
          <ActionIcon variant="light" size="lg">
            <IconInfoCircle size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <div>
        <Group position="apart" mb={5}>
          <Text size="sm">Risk Profile</Text>
          <Text size="xs" color="dimmed">
            {cohort.riskProfile.high} High Risk
          </Text>
        </Group>
        <Progress
          size="lg"
          sections={[
            { value: (cohort.riskProfile.high/cohort.patientCount)*100, color: 'red' },
            { value: (cohort.riskProfile.medium/cohort.patientCount)*100, color: 'yellow' },
            { value: (cohort.riskProfile.low/cohort.patientCount)*100, color: 'green' }
          ]}
        />
      </div>

      <Group grow>
        <div>
          <Text size="sm">Care Gaps</Text>
          <Text weight={700} size="xl" color="red">
            {cohort.careGaps}
          </Text>
        </div>
        <div>
          <Text size="sm">Adherence</Text>
          <Text weight={700} size="xl" color={cohort.adherence >= 80 ? 'green' : 'yellow'}>
            {cohort.adherence}%
          </Text>
        </div>
      </Group>

      <Divider />

      <Stack spacing="xs">
        <Text weight={500}>AI Recommendations:</Text>
        {cohort.recommendations.map((rec, index) => (
          <Paper key={index} p="xs" radius="md" withBorder>
            <Group position="apart" mb={4}>
              <Text size="sm" weight={500}>{rec.title}</Text>
              <Badge 
                color={rec.priority === 'high' ? 'red' : 'yellow'}
                variant="light"
              >
                {rec.priority}
              </Badge>
            </Group>
            <Text size="xs" color="dimmed" mb={4}>{rec.description}</Text>
            <Text size="xs" color="blue" weight={500}>{rec.impact}</Text>
          </Paper>
        ))}
      </Stack>

      <Button 
        variant="light" 
        rightIcon={<IconArrowRight size={16} />}
        fullWidth
      >
        View Care Pathways
      </Button>
    </Stack>
  </Card>
);

const AIRecommendations = () => {
  const { user, loading: authLoading } = useUser();
  const [activeTab, setActiveTab] = useState('cohorts');
  const [cohortMetrics, setCohortMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCohortData = async () => {
      try {
        setLoading(true);
        if (user) {
          const metrics = await cohortService.getCohortMetrics();
          setCohortMetrics(metrics);
        }
      } catch (error) {
        console.error('Error loading cohort data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadCohortData();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <Container size="xl" py="xl">
        <LoadingSpinner message="Checking authentication..." />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="xl" py="xl">
        <Alert color="red" title="Authentication Required">
          Please log in to view this page.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <LoadingSpinner message="Loading cohort data..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert color="red" title="Error loading data">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Group position="apart">
          <Group>
            <ThemeIcon size="xl" radius="md" variant="light" color="violet">
              <IconBrain size={24} />
            </ThemeIcon>
            <Title order={2}>AI Care Recommendations</Title>
          </Group>
          <Badge 
            variant="dot" 
            color="green"
            size="lg"
          >
            Updated 5 minutes ago
          </Badge>
        </Group>

        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab 
              value="cohorts" 
              icon={<IconUsers size={14} />}
            >
              Condition Cohorts
            </Tabs.Tab>
            <Tabs.Tab 
              value="pathways" 
              icon={<IconStethoscope size={14} />}
            >
              Care Pathways
            </Tabs.Tab>
            <Tabs.Tab 
              value="metrics" 
              icon={<IconChartBar size={14} />}
            >
              Quality Metrics
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="cohorts" pt="xl">
            <Grid>
              {cohortMetrics.map((cohort) => (
                <Grid.Col key={cohort.id} md={6}>
                  <CohortCard cohort={cohort} />
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="pathways" pt="xl">
            {/* Care Pathways content */}
          </Tabs.Panel>

          <Tabs.Panel value="metrics" pt="xl">
            {/* Quality Metrics content */}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default AIRecommendations; 