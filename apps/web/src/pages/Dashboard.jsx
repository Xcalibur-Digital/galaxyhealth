import React from 'react';
import { 
  Container, 
  Grid, 
  Title, 
  Box, 
  Paper, 
  Group, 
  Text, 
  Button, 
  Stack,
  ThemeIcon,
  Divider,
  createTheme,
  rem
} from '@mantine/core';
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
  IconStethoscope,
  IconChartBar,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
  IconArrowRight
} from '@tabler/icons-react';
import MetricCard from '../components/dashboard/MetricCard';
import { motion } from 'framer-motion';

const useStyles = createTheme((theme) => ({
  container: {
    padding: theme.spacing.xl,
    '@media (max-width: theme.breakpoints.sm)': {
      padding: theme.spacing.md
    }
  },
  welcomeCard: {
    backgroundColor: theme.colors.blue[6],
    color: theme.white,
    padding: rem(24),
    borderRadius: theme.radius.md,
    '@media (max-width: theme.breakpoints.sm)': {
      padding: rem(16)
    }
  }
}));

const Dashboard = () => {
  const { activePatient } = usePatient();
  const { user } = useUser();
  const firstName = user?.displayName?.split(' ')[0] || 'there';
  const navigate = useNavigate();

  const metrics = [
    {
      title: 'High Risk Patients',
      value: '5',
      description: 'Patients requiring immediate attention',
      icon: IconAlertTriangle,
      color: 'red',
      trend: {
        value: '+12%',
        color: 'red',
        icon: <IconArrowUpRight size={16} stroke={2} />
      },
      view: SAVED_VIEWS.HIGH_RISK
    },
    {
      title: 'Care Gaps',
      value: '12',
      description: 'Open care gaps to address',
      icon: IconStethoscope,
      color: 'blue',
      trend: {
        value: '-5%',
        color: 'green',
        icon: <IconArrowDownRight size={16} stroke={2} />
      },
      view: SAVED_VIEWS.CARE_GAPS
    },
    {
      title: 'Due for AWV',
      value: '8',
      description: 'Annual Wellness Visits due this month',
      icon: IconCalendarStats,
      color: 'green',
      trend: {
        value: '+3%',
        color: 'red',
        icon: <IconArrowUpRight size={16} stroke={2} />
      },
      view: SAVED_VIEWS.MISSING_AWV
    },
    {
      title: 'Shared Savings',
      value: '$15.2K',
      description: 'Projected monthly savings',
      icon: IconCoin,
      color: 'yellow',
      trend: {
        value: '+8%',
        color: 'green',
        icon: <IconArrowUpRight size={16} stroke={2} />
      }
    }
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <Container size="xl" py="xl">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <Box pb="xl">
          <motion.div variants={itemVariants}>
            <Group position="apart" mb="lg">
              <Stack spacing={4}>
                <Title order={1}>Dashboard</Title>
                <Text color="dimmed">
                  Overview of your value-based care performance
                </Text>
              </Stack>
              <Button 
                variant="light"
                leftSection={<IconChartBar size={20} />}
                onClick={() => navigate('/performance')}
              >
                View Performance
              </Button>
            </Group>
          </motion.div>

          <Grid grow gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="High Risk Patients"
                value="5"
                description="Patients requiring attention"
                icon={IconAlertTriangle}
                color="red"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Care Gaps"
                value="12"
                description="Open care opportunities"
                icon={IconStethoscope}
                color="blue"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Due for AWV"
                value="8"
                description="Annual Wellness Visits needed"
                icon={IconCalendarStats}
                color="green"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Shared Savings"
                value="$52.2k"
                description="Projected annual savings"
                icon={IconCoin}
                color="violet"
              />
            </Grid.Col>
          </Grid>
        </Box>

        <motion.div variants={itemVariants}>
          <NarrativeSummary />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Grid mt="xl" gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="xl" radius="md" withBorder>
                <Group position="apart" mb="lg">
                  <Title order={3}>Recent Activity</Title>
                  <Button 
                    variant="subtle"
                    rightSection={<IconArrowRight size={20} />}
                    onClick={() => navigate('/patient-context')}
                  >
                    View All
                  </Button>
                </Group>
                {/* Add recent activity content */}
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="xl" radius="md" withBorder>
                <Group position="apart" mb="lg">
                  <Title order={3}>Care Gaps</Title>
                  <Button 
                    variant="subtle"
                    rightSection={<IconArrowRight size={20} />}
                    onClick={() => navigate(`/patients?view=${SAVED_VIEWS.CARE_GAPS}`)}
                  >
                    View All
                  </Button>
                </Group>
                {/* Add care gaps content */}
              </Paper>
            </Grid.Col>
          </Grid>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Dashboard;