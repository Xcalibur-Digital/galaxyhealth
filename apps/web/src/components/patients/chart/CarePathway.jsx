import React from 'react';
import { Paper, Text, Timeline, Group, ThemeIcon } from '@mantine/core';
import { 
  IconStethoscope, 
  IconPill, 
  IconReportMedical,
  IconCalendarEvent 
} from '@tabler/icons-react';

const CarePathway = ({ patient }) => {
  const pathwayEvents = [
    {
      title: 'Annual Wellness Visit',
      date: '2024-03-15',
      description: 'Comprehensive health assessment and care planning',
      icon: IconStethoscope,
      color: 'blue'
    },
    {
      title: 'Medication Review',
      date: '2024-04-01',
      description: 'Review and optimize current medications',
      icon: IconPill,
      color: 'green'
    },
    {
      title: 'Lab Tests',
      date: '2024-04-15',
      description: 'HbA1c, Lipid Panel, Comprehensive Metabolic Panel',
      icon: IconReportMedical,
      color: 'violet'
    },
    {
      title: 'Follow-up Visit',
      date: '2024-05-01',
      description: 'Review lab results and adjust care plan',
      icon: IconCalendarEvent,
      color: 'orange'
    }
  ];

  return (
    <Paper p="md" radius="md" withBorder>
      <Text size="lg" weight={500} mb="xl">Care Pathway</Text>

      <Timeline active={1} bulletSize={24} lineWidth={2}>
        {pathwayEvents.map((event, index) => (
          <Timeline.Item
            key={index}
            bullet={
              <ThemeIcon
                size={24}
                radius="xl"
                color={event.color}
              >
                <event.icon size={12} />
              </ThemeIcon>
            }
            title={
              <Group spacing="xs">
                <Text weight={500}>{event.title}</Text>
                <Text size="sm" color="dimmed">
                  {new Date(event.date).toLocaleDateString()}
                </Text>
              </Group>
            }
          >
            <Text color="dimmed" size="sm">
              {event.description}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Paper>
  );
};

export default CarePathway; 