import React, { useEffect } from 'react';
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
  Divider,
  Box,
  Loader
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
  IconAlertTriangle,
  IconPill,
  IconBuildingHospital
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import useRecommendationsStore from '../../stores/recommendationsStore';

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

// Add icon mapping
const iconMap = {
  'calendar': IconCalendar,
  'report-medical': IconReportMedical,
  'checkbox': IconCheckbox,
  'pill': IconPill,
  'hospital': IconBuildingHospital
};

const AIGuidance = () => {
  const { recommendations, metrics, loading, error } = useRecommendationsStore();

  useEffect(() => {
    console.log('AIGuidance mounted, current state:', { recommendations, metrics, loading, error });
    const unsubscribe = useRecommendationsStore.getState().initialize();
    return () => unsubscribe();
  }, []);

  if (loading) {
    console.log('Loading recommendations...');
    return <Loader />;
  }

  if (error) {
    console.error('Error in AIGuidance:', error);
    return <Text color="red">Error loading recommendations: {error}</Text>;
  }

  console.log('Rendering recommendations:', recommendations);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const pulse = keyframes`
    0% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.5;
      transform: scale(1);
    }
  `;

  return (
    <Paper p="md" radius={0} sx={(theme) => ({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderLeft: 'none',
      borderRight: 'none',
      borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
    })}>
      <Stack spacing="md">
        <Group position="apart" align="center">
          <Group>
            <ThemeIcon 
              size="lg" 
              radius="md" 
              variant="light" 
              color="violet"
              sx={(theme) => ({
                backgroundColor: theme.fn.rgba(theme.colors.violet[theme.colorScheme === 'dark' ? 9 : 3], 0.15),
                color: theme.colors.violet[theme.colorScheme === 'dark' ? 4 : 7]
              })}
            >
              <IconBrain size={20} />
            </ThemeIcon>
            <Title order={3} color={theme => theme.colorScheme === 'dark' ? 'gray.3' : 'dark.9'}>
              Highlights
            </Title>
          </Group>
          <Group spacing="xs" align="center">
            <Box
              sx={(theme) => ({
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: theme.colors.green[theme.colorScheme === 'dark' ? 4 : 6],
                animation: `${pulse} 3s ease-in-out infinite`,
                boxShadow: `0 0 10px ${theme.fn.rgba(theme.colors.green[theme.colorScheme === 'dark' ? 4 : 6], 0.5)}`
              })}
            />
            <Text 
              size="xs" 
              color={theme => theme.colorScheme === 'dark' ? 'dark.2' : 'gray.6'}
              sx={{ userSelect: 'none' }}
            >
              Live
            </Text>
          </Group>
        </Group>

        <Text color={theme => theme.colorScheme === 'dark' ? 'dark.2' : 'dark.6'} size="sm">
          Based on your patient population and value-based contract requirements, 
          here are your recommended focus areas:
        </Text>

        <List spacing="lg">
          {recommendations.map((rec, index) => {
            const IconComponent = iconMap[rec.icon] || IconBrain; // Fallback to IconBrain
            
            return (
              <List.Item
                key={index}
                icon={
                  <ThemeIcon 
                    size="lg" 
                    radius="xl" 
                    variant="light" 
                    color="blue"
                    sx={(theme) => ({
                      backgroundColor: theme.fn.rgba(theme.colors.blue[theme.colorScheme === 'dark' ? 9 : 6], 0.1),
                      color: theme.colors.blue[theme.colorScheme === 'dark' ? 4 : 6]
                    })}
                  >
                    <IconComponent size={20} />
                  </ThemeIcon>
                }
              >
                <Stack spacing="xs">
                  <Group position="apart">
                    <Text weight={500} color={theme => theme.colorScheme === 'dark' ? 'gray.3' : 'dark.9'}>
                      {rec.title}
                    </Text>
                    <Badge color={getPriorityColor(rec.priority)} variant="light">
                      {rec.priority.toUpperCase()}
                    </Badge>
                  </Group>
                  <Text size="sm" color={theme => theme.colorScheme === 'dark' ? 'dark.2' : 'dark.6'}>
                    {rec.description}
                  </Text>
                  <Group position="apart">
                    <Text 
                      size="sm" 
                      sx={(theme) => ({
                        color: theme.colors.violet[theme.colorScheme === 'dark' ? 4 : 6],
                        opacity: theme.colorScheme === 'dark' ? 1 : 0.85
                      })}
                      weight={500}
                    >
                      {rec.impact}
                    </Text>
                    <Button 
                      component={Link}
                      to={rec.title.includes("AWV") ? "/patients" : "#"}
                      variant="subtle" 
                      size="xs" 
                      rightIcon={<IconArrowRight size={16} />}
                      sx={(theme) => ({
                        color: theme.colors.blue[theme.colorScheme === 'dark' ? 4 : 6],
                        '&:hover': {
                          backgroundColor: theme.fn.rgba(theme.colors.blue[theme.colorScheme === 'dark' ? 9 : 1], 0.35)
                        }
                      })}
                    >
                      {rec.action}
                    </Button>
                  </Group>
                </Stack>
              </List.Item>
            );
          })}
        </List>

        <Divider color={theme => theme.colorScheme === 'dark' ? 'dark.5' : 'gray.2'} />

        <Group position="apart">
          <Text size="sm" color={theme => theme.colorScheme === 'dark' ? 'dark.2' : 'dark.6'}>
            <IconStethoscope 
              size={16} 
              style={{ 
                verticalAlign: 'middle',
                opacity: 0.75
              }}
            /> 
            {' '}VBC Success Score: <Text 
              component="span" 
              sx={(theme) => ({
                color: theme.colors.violet[theme.colorScheme === 'dark' ? 4 : 7],
                opacity: theme.colorScheme === 'dark' ? 1 : 0.85
              })} 
              weight={500}
            >
              {metrics?.vbcScore}%
            </Text>
          </Text>
          <Button 
            variant="subtle" 
            rightIcon={<IconArrowRight size={16} />}
            sx={(theme) => ({
              color: theme.colors.violet[theme.colorScheme === 'dark' ? 4 : 7],
              '&:hover': {
                backgroundColor: theme.fn.rgba(theme.colors.violet[theme.colorScheme === 'dark' ? 9 : 1], 0.35)
              }
            })}
          >
            View All Recommendations
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default AIGuidance; 