import React from 'react';
import { Paper, Group, Text, Badge } from '@mantine/core';
import { 
  IconStethoscope, 
  IconPill, 
  IconAlertTriangle, 
  IconVaccine, 
  IconChartLine 
} from '@tabler/icons-react';

export function PatientCard({ patient, onClick }) {
  const { 
    name, 
    identifier, 
    birthDate, 
    gender, 
    resourceCounts 
  } = patient;

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      className="patient-card"
      onClick={() => onClick(patient)}
    >
      <Group position="apart">
        <div>
          <Text weight={500}>{name}</Text>
          <Text size="sm" color="dimmed">{identifier}</Text>
        </div>
        <Badge>{gender}</Badge>
      </Group>

      <Group spacing="xs" mt="md">
        <Badge 
          leftSection={<IconStethoscope size={14} />}
          variant="outline"
        >
          {resourceCounts.condition}
        </Badge>
        <Badge 
          leftSection={<IconPill size={14} />}
          variant="outline"
        >
          {resourceCounts.medication}
        </Badge>
        {/* Add other resource badges */}
      </Group>
    </Paper>
  );
} 