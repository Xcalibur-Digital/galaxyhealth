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
  Box,
  Timeline,
  Card,
  Badge,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconRobot, 
  IconArrowRight, 
  IconStethoscope,
  IconAlertCircle,
  IconChecks,
  IconTrendingUp,
  IconCalendarEvent,
  IconPill,
  IconHeartbeat,
  IconRefresh
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import useRecommendationsStore from '../../stores/recommendationsStore';
import { motion } from 'framer-motion';

// Define pulsing animation for the robot icon
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const NarrativeSummary = () => {
  // This would come from your AI service in production
  const summary = {
    overview: "Here's your daily patient care summary and recommended actions:",
    keyPoints: [
      {
        type: 'alert',
        text: '1 high-risk diabetes patient needs medication review',
        icon: IconAlertCircle,
        color: 'red'
      },
      {
        type: 'opportunity',
        text: '3 Annual Wellness Visits can be scheduled this week',
        icon: IconStethoscope,
        color: 'blue'
      },
      {
        type: 'success',
        text: '2 patients improved their blood pressure control this month',
        icon: IconChecks,
        color: 'green'
      }
    ],
    recommendation: {
      priority: 'high',
      action: 'Focus on High-Risk Diabetes Patients',
      impact: 'Early intervention could prevent complications for 1 patient with HbA1c > 9.0',
      nextSteps: [
        'Review medication adherence reports',
        'Schedule follow-up appointments',
        'Update care management plans'
      ]
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
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
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
    >
    <Card shadow="sm" radius="lg" p="xl" mt="xl">
      <Group position="apart" mb="lg">
        <Group>
          <Avatar 
            size="lg" 
            radius="xl"
            sx={(theme) => ({
              background: theme.fn.linearGradient(45, 
                theme.colors.indigo[7], 
                theme.colors.indigo[9]
              ),
              border: `2px solid ${theme.colors.indigo[5]}`,
              boxShadow: theme.shadows.md
            })}
          >
            <IconRobot 
              size={24} 
              style={{ animation: `${pulse} 2s infinite` }} 
            />
          </Avatar>
          <Stack spacing={0}>
            <Title order={3}>AI Recommendations</Title>
            <Group spacing="xs">
              <Text size="sm" color="dimmed">Updated just now</Text>
              <Tooltip label="Refresh recommendations">
                <ActionIcon 
                  variant="subtle" 
                  size="sm"
                  onClick={() => {/* Refresh logic */}}
                >
                  <IconRefresh size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Stack>
        </Group>
      </Group>

      <Box 
        sx={(theme) => ({
          padding: theme.spacing.md,
          backgroundColor: theme.colorScheme === 'dark' ? 
            theme.colors.dark[7] : theme.colors.gray[0],
          borderRadius: theme.radius.md,
          marginBottom: theme.spacing.lg,
          border: `1px solid ${
            theme.colorScheme === 'dark' ? 
              theme.colors.dark[6] : theme.colors.gray[2]
          }`
        })}
      >
        <Text size="md">{summary.overview}</Text>
      </Box>

      <Timeline active={1} bulletSize={24} lineWidth={2} mb="xl">
        {summary.keyPoints.map((point, index) => (
          <Timeline.Item
            key={index}
            bullet={
              <ThemeIcon
                size={24}
                radius="xl"
                color={point.color}
                variant="light"
              >
                <point.icon size={12} stroke={1.5} />
              </ThemeIcon>
            }
            title={
              <Group spacing="xs">
                <Text size="sm" weight={500}>{point.text}</Text>
                <Badge 
                  size="sm" 
                  color={point.color}
                  variant="dot"
                >
                  {point.type}
                </Badge>
              </Group>
            }
          />
        ))}
      </Timeline>

      <Divider my="lg" />

      <Stack spacing="md">
        <Title order={4}>Recommended Action</Title>
        <Card 
          p="md" 
          radius="md"
          sx={(theme) => ({
            backgroundColor: theme.colors.indigo[7],
            color: theme.white
          })}
        >
          <Stack spacing="xs">
            <Group position="apart">
              <Text weight={500}>{summary.recommendation.action}</Text>
              <Badge color="red">High Priority</Badge>
            </Group>
            <Text size="sm" style={{ opacity: 0.9 }}>
              {summary.recommendation.impact}
            </Text>
          </Stack>
        </Card>

        <Box 
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? 
              theme.colors.dark[7] : theme.colors.gray[0],
            borderRadius: theme.radius.md,
            padding: theme.spacing.md
          })}
        >
          <Stack spacing="xs">
            {summary.recommendation.nextSteps.map((step, index) => (
              <Group key={index} spacing="xs">
                <Text size="sm" color="dimmed">{index + 1}.</Text>
                <Text size="sm">{step}</Text>
              </Group>
            ))}
          </Stack>
        </Box>

        <Group position="right" mt="md">
          <Button 
            variant="light"
            rightSection={<IconArrowRight size={16} stroke={1.5} />}
            onClick={() => {/* Navigate to relevant view */}}
            color="indigo"
          >
            Take Action
          </Button>
        </Group>
      </Stack>
    </Card>
    </motion.div>
  );
};

export default NarrativeSummary; 