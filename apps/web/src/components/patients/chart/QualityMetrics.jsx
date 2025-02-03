import React from 'react';
import { Paper, Text, Progress, Group, Stack, Grid } from '@mantine/core';

const QualityMetrics = ({ patient }) => {
  const metrics = [
    { name: 'Care Gap Closure', value: 85, color: 'blue' },
    { name: 'AWV Completion', value: 100, color: 'green' },
    { name: 'Medication Adherence', value: 92, color: 'violet' },
    { name: 'Preventive Screening', value: 75, color: 'orange' }
  ];

  return (
    <Paper p="md" radius="md" withBorder h="100%">
      <Text size="lg" weight={500} mb="md">Quality Metrics</Text>
      
      <Grid>
        {metrics.map((metric, index) => (
          <Grid.Col key={index} span={6}>
            <Stack spacing="xs" mb="md">
              <Group position="apart">
                <Text size="sm">{metric.name}</Text>
                <Text size="sm" weight={500}>{metric.value}%</Text>
              </Group>
              <Progress 
                value={metric.value} 
                color={metric.color}
                size="md"
                radius="xl"
              />
            </Stack>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
};

export default QualityMetrics; 