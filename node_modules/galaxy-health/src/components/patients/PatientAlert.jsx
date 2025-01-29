import React from 'react';
import { Paper, Text, Group, Button, Stack, Badge } from '@mantine/core';
import { IconUserCheck, IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const PatientAlert = ({ patient }) => {
  if (!patient) return null;

  return (
    <Paper 
      p="md" 
      radius="md" 
      shadow="sm"
      sx={(theme) => ({
        backgroundColor: theme.colors.blue[1],
        border: `1px solid ${theme.colors.blue[3]}`
      })}
    >
      <Stack spacing="xs">
        <Group position="apart">
          <Group>
            <IconUserCheck size={24} />
            <div>
              <Text size="sm" color="dimmed">Active Patient</Text>
              <Text weight={500}>
                {patient.name[0].given.join(' ')} {patient.name[0].family}
              </Text>
            </div>
          </Group>
          <Badge color="blue">
            Context Active
          </Badge>
        </Group>

        <Group position="right">
          <Button
            component={Link}
            to={`/patients/${patient.id}`}
            variant="light"
            size="xs"
            rightIcon={<IconArrowRight size={16} />}
          >
            View Details
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default PatientAlert; 