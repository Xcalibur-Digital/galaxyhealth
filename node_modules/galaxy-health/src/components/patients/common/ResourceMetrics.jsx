import React from 'react';
import { Group, Paper, RingProgress, Text } from '@mantine/core';
import { 
  IconStethoscope, 
  IconPill, 
  IconAlertTriangle, 
  IconVaccine, 
  IconChartLine 
} from '@tabler/icons-react';

const METRICS = [
  { key: 'condition', icon: IconStethoscope, label: 'Conditions', color: 'blue' },
  { key: 'medication', icon: IconPill, label: 'Medications', color: 'green' },
  { key: 'allergyintolerance', icon: IconAlertTriangle, label: 'Allergies', color: 'red' },
  { key: 'immunization', icon: IconVaccine, label: 'Immunizations', color: 'grape' },
  { key: 'observation', icon: IconChartLine, label: 'Observations', color: 'cyan' }
];

export function ResourceMetrics({ counts }) {
  return (
    <Paper shadow="sm" p="md">
      <Group grow>
        {METRICS.map(({ key, icon: Icon, label, color }) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <RingProgress
              sections={[{ value: counts[key] || 0, color }]}
              label={
                <Text align="center">
                  <Icon size={16} />
                  <Text size="xl" weight={700}>{counts[key] || 0}</Text>
                </Text>
              }
            />
            <Text size="sm" mt="xs">{label}</Text>
          </div>
        ))}
      </Group>
    </Paper>
  );
} 