import React from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Group, 
  Avatar, 
  Stack,
  Button,
  Divider,
  ThemeIcon,
  Box
} from '@mantine/core';
import { 
  IconRobot, 
  IconArrowRight, 
  IconStethoscope,
  IconAlertCircle,
  IconChecks
} from '@tabler/icons-react';

const NarrativeSummary = () => {
  // This would come from your AI service in production
  const summary = {
    overview: "Here's your daily patient care summary and recommended actions:",
    keyPoints: [
      {
        type: 'alert',
        text: '3 high-risk diabetes patients need medication review',
        icon: IconAlertCircle,
        color: 'red'
      },
      {
        type: 'opportunity',
        text: '8 Annual Wellness Visits can be scheduled this week',
        icon: IconStethoscope,
        color: 'blue'
      },
      {
        type: 'success',
        text: '4 patients improved their blood pressure control this month',
        icon: IconChecks,
        color: 'green'
      }
    ],
    recommendation: {
      priority: 'high',
      action: 'Focus on High-Risk Diabetes Patients',
      impact: 'Early intervention could prevent complications for 3 patients with HbA1c > 9.0',
      nextSteps: [
        'Review medication adherence reports',
        'Schedule follow-up appointments',
        'Update care management plans'
      ]
    }
  };

  return (
    <Paper p="xl" radius="md" withBorder mt="xl">
      <Group position="apart" mb="lg">
        <Group>
          <Avatar 
            size="lg" 
            radius="xl"
            sx={(theme) => ({
              background: theme.fn.linearGradient(45, '#6E2B81', '#B82C5D'),
            })}
          >
            <IconRobot size={24} />
          </Avatar>
          <div>
            <Title order={3}>AI Summary</Title>
            <Text size="sm" color="dimmed">Updated just now</Text>
          </div>
        </Group>
      </Group>

      <Box 
        sx={(theme) => ({
          padding: theme.spacing.md,
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
          borderRadius: theme.radius.md,
          marginBottom: theme.spacing.lg
        })}
      >
        <Text size="md">{summary.overview}</Text>
      </Box>

      <Stack spacing="md" mb="xl">
        {summary.keyPoints.map((point, index) => (
          <Group key={index} spacing="sm">
            <ThemeIcon color={point.color} size="lg" radius="xl">
              <point.icon size={18} />
            </ThemeIcon>
            <Text size="sm">{point.text}</Text>
          </Group>
        ))}
      </Stack>

      <Divider my="lg" />

      <Stack spacing="md">
        <Title order={4}>Recommended Action</Title>
        <Box 
          sx={(theme) => ({
            padding: theme.spacing.md,
            backgroundColor: theme.colors.blue[7],
            color: 'white',
            borderRadius: theme.radius.md
          })}
        >
          <Text weight={500}>{summary.recommendation.action}</Text>
          <Text size="sm" mt={4} style={{ opacity: 0.9 }}>
            {summary.recommendation.impact}
          </Text>
        </Box>

        <Stack spacing="xs">
          {summary.recommendation.nextSteps.map((step, index) => (
            <Group key={index} spacing="xs">
              <Text size="sm" color="dimmed">{index + 1}.</Text>
              <Text size="sm">{step}</Text>
            </Group>
          ))}
        </Stack>

        <Group position="right" mt="md">
          <Button 
            variant="light"
            rightIcon={<IconArrowRight size={16} />}
            onClick={() => {/* Navigate to relevant view */}}
          >
            Take Action
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default NarrativeSummary; 