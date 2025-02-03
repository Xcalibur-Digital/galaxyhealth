import React from 'react';
import { Paper, Text, Group, Stack, Badge, Button } from '@mantine/core';
import { IconCalendarPlus } from '@tabler/icons-react';

const CareGaps = ({ patient }) => {
  const careGaps = [
    {
      measure: 'Diabetes Eye Exam',
      dueDate: '2024-06-30',
      status: 'overdue',
      type: 'HEDIS'
    },
    {
      measure: 'Colorectal Cancer Screening',
      dueDate: '2024-12-31',
      status: 'due',
      type: 'Medicare'
    },
    {
      measure: 'Annual Wellness Visit',
      dueDate: '2024-03-15',
      status: 'upcoming',
      type: 'Medicare'
    }
  ];

  return (
    <Paper p="md" radius="md" withBorder>
      <Group position="apart" mb="lg">
        <Text size="lg" weight={500}>Care Gaps</Text>
        <Button 
          variant="light"
          leftIcon={<IconCalendarPlus size={16} />}
          size="sm"
        >
          Schedule Visit
        </Button>
      </Group>

      <Stack spacing="md">
        {careGaps.map((gap, index) => (
          <Group key={index} position="apart">
            <Stack spacing={4}>
              <Text weight={500}>{gap.measure}</Text>
              <Text size="sm" color="dimmed">
                Due by {new Date(gap.dueDate).toLocaleDateString()}
              </Text>
            </Stack>
            <Group spacing="xs">
              <Badge
                color={
                  gap.status === 'overdue' ? 'red' : 
                  gap.status === 'due' ? 'yellow' : 
                  'blue'
                }
              >
                {gap.status.toUpperCase()}
              </Badge>
              <Badge variant="outline">{gap.type}</Badge>
            </Group>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
};

export default CareGaps; 