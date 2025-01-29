import React from 'react';
import { Paper, Title, Text, Group, Stack, Progress, ThemeIcon, Badge } from '@mantine/core';
import { IconTrendingUp, IconAlertTriangle } from '@tabler/icons-react';

const RiskScoreCard = ({ patient }) => {
  const riskFactors = [
    { name: 'Chronic Conditions', score: 3.2 },
    { name: 'Utilization History', score: 2.1 },
    { name: 'Medication Adherence', score: 1.8 },
    { name: 'Social Determinants', score: 1.3 }
  ];

  return (
    <Paper p="md" radius="md">
      <Title order={3} mb="md">Risk Profile</Title>
      
      <Stack spacing="md">
        <Group position="apart">
          <Text size="xl" weight={700}>8.4</Text>
          <Badge color="red">High Risk</Badge>
        </Group>

        <Group spacing="xs">
          <ThemeIcon color="red" variant="light">
            <IconTrendingUp size={16} />
          </ThemeIcon>
          <Text size="sm">+2.1 from last month</Text>
        </Group>

        <Stack spacing="xs">
          {riskFactors.map((factor) => (
            <div key={factor.name}>
              <Group position="apart" mb={4}>
                <Text size="sm">{factor.name}</Text>
                <Text size="sm" weight={500}>{factor.score}</Text>
              </Group>
              <Progress 
                value={factor.score * 10} 
                color="red" 
                size="sm" 
              />
            </div>
          ))}
        </Stack>

        <Group spacing="xs">
          <ThemeIcon color="yellow" variant="light">
            <IconAlertTriangle size={16} />
          </ThemeIcon>
          <Text size="sm">Intervention recommended</Text>
        </Group>
      </Stack>
    </Paper>
  );
};

export default RiskScoreCard; 