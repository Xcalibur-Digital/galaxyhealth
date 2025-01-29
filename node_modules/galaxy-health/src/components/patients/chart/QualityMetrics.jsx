import React from 'react';
import { Paper, Title, Grid, Text, RingProgress, Group, Stack } from '@mantine/core';

const QualityMetrics = ({ patient, detailed = false }) => {
  const metrics = [
    {
      name: 'HEDIS Measures',
      completed: 12,
      total: 15,
      color: 'blue'
    },
    {
      name: 'Care Gaps',
      completed: 3,
      total: 5,
      color: 'orange'
    },
    {
      name: 'Screenings',
      completed: 8,
      total: 10,
      color: 'green'
    },
    {
      name: 'Immunizations',
      completed: 6,
      total: 8,
      color: 'violet'
    }
  ];

  return (
    <Paper p="md" radius="md">
      <Title order={3} mb="md">Quality Metrics</Title>
      
      <Grid>
        {metrics.map((metric) => (
          <Grid.Col key={metric.name} span={detailed ? 6 : 3}>
            <Group noWrap align="flex-start">
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[
                  { value: (metric.completed / metric.total) * 100, color: metric.color }
                ]}
                label={
                  <Text align="center" size="xs" weight={700}>
                    {Math.round((metric.completed / metric.total) * 100)}%
                  </Text>
                }
              />
              <Stack spacing={4}>
                <Text weight={500}>{metric.name}</Text>
                <Text size="sm" color="dimmed">
                  {metric.completed} of {metric.total} complete
                </Text>
                {detailed && (
                  <Text size="xs" color="dimmed">
                    Last updated: {new Date().toLocaleDateString()}
                  </Text>
                )}
              </Stack>
            </Group>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
};

export default QualityMetrics; 