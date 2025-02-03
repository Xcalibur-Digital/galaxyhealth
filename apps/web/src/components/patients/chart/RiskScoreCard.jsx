import React from 'react';
import { Paper, Text, RingProgress, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

const RiskScoreCard = ({ patient }) => {
  const riskScore = 8.4; // This would come from patient data in production
  const riskLevel = riskScore > 7 ? 'high' : riskScore > 4 ? 'medium' : 'low';
  
  return (
    <Paper p="md" radius="md" withBorder h="100%">
      <Stack spacing="xs">
        <Text size="lg" weight={500}>Risk Score</Text>
        
        <Group position="apart" align="flex-start">
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: (riskScore / 10) * 100, color: 'red' }]}
            label={
              <Text size="lg" align="center" weight={700}>
                {riskScore}
              </Text>
            }
          />
          
          <Stack spacing={0}>
            <Group spacing="xs">
              <ThemeIcon 
                color="red" 
                variant="light"
                size="lg"
                radius="xl"
              >
                <IconAlertTriangle size={20} />
              </ThemeIcon>
              <Text size="xl" weight={700}>
                High Risk
              </Text>
            </Group>
            <Text size="sm" color="dimmed">
              HCC RAF Score
            </Text>
          </Stack>
        </Group>

        <Text size="sm" color="dimmed" mt="md">
          Patient's risk score indicates need for care management intervention
        </Text>
      </Stack>
    </Paper>
  );
};

export default RiskScoreCard; 