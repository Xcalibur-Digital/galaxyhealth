import React from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  List, 
  ThemeIcon, 
  Group, 
  Badge, 
  Stack,
  Button,
  Divider
} from '@mantine/core';
import { 
  IconBrain, 
  IconStethoscope,
  IconAlertCircle,
  IconCheckbox,
  IconArrowRight,
  IconCalendar,
  IconReportMedical,
  IconActivity,
  IconAlertTriangle
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const PriorityBadge = ({ level }) => {
  const colors = {
    high: 'red',
    medium: 'yellow',
    low: 'green'
  };
  
  return (
    <Badge color={colors[level]} variant="light">
      {level.charAt(0).toUpperCase() + level.slice(1)} Priority
    </Badge>
  );
};

const AIGuidance = () => {
  const recommendations = [
    {
      title: "Schedule AWVs for High-Risk Patients",
      description: "10 patients with multiple chronic conditions haven't had an AWV in the last 12 months",
      priority: "high",
      impact: "$2,500 potential revenue",
      action: "View Patient List",
      icon: IconCalendar
    },
    {
      title: "Review HCC Recapture Opportunities",
      description: "15 patients have suspected HCC conditions requiring documentation",
      priority: "high",
      impact: "$3,750 RAF adjustment opportunity",
      action: "Review HCC Gaps",
      icon: IconReportMedical
    },
    {
      title: "Close Pre-Visit Care Gaps",
      description: "25 patients scheduled next week have open care gaps",
      priority: "medium",
      impact: "$1,875 in quality incentives",
      action: "View Care Gaps",
      icon: IconCheckbox
    },
    {
      title: "Monitor At-Risk Patients",
      description: "5 patients show rising risk scores based on recent vitals",
      priority: "high",
      impact: "Prevent potential ED visits",
      action: "View Risk Scores",
      icon: IconActivity
    }
  ];

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack spacing="md">
        <Group position="apart" align="center">
          <Group>
            <ThemeIcon size="lg" radius="md" variant="light" color="violet">
              <IconBrain size={20} />
            </ThemeIcon>
            <Title order={3}>AI Care Navigator</Title>
          </Group>
          <Badge 
            variant="dot" 
            color="green"
            size="lg"
          >
            Updated Just Now
          </Badge>
        </Group>

        <Text color="dimmed" size="sm">
          Based on your patient population and value-based contract requirements, 
          here are your recommended focus areas:
        </Text>

        <List spacing="lg">
          {recommendations.map((rec, index) => (
            <List.Item
              key={index}
              icon={
                <ThemeIcon size="lg" radius="xl" variant="light">
                  <rec.icon size={20} />
                </ThemeIcon>
              }
            >
              <Stack spacing="xs">
                <Group position="apart">
                  <Text weight={500}>{rec.title}</Text>
                  <PriorityBadge level={rec.priority} />
                </Group>
                <Text size="sm" color="dimmed">{rec.description}</Text>
                <Group position="apart">
                  <Text size="sm" color="violet" weight={500}>
                    {rec.impact}
                  </Text>
                  <Button 
                    variant="light" 
                    size="xs" 
                    rightIcon={<IconArrowRight size={16} />}
                  >
                    {rec.action}
                  </Button>
                </Group>
              </Stack>
            </List.Item>
          ))}
        </List>

        <Divider />

        <Group position="apart">
          <Text size="sm" color="dimmed">
            <IconStethoscope size={16} style={{ verticalAlign: 'middle' }} /> 
            {' '}VBC Success Score: 85/100
          </Text>
          <Button 
            variant="subtle" 
            rightIcon={<IconArrowRight size={16} />}
            component={Link}
            to="/ai-recommendations"
          >
            View All Recommendations
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default AIGuidance; 