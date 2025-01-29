import React from 'react';
import { Group, Avatar, Text, Badge, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconCalendar, IconGenderMale, IconGenderFemale } from '@tabler/icons-react';
import { formatDate } from '../../utils/formatters';

export function PatientHeader({ patient, onBack }) {
  const gender = patient.gender?.toLowerCase();
  const GenderIcon = gender === 'female' ? IconGenderFemale : IconGenderMale;

  return (
    <Group position="apart" mb="xl">
      <Group>
        {onBack && (
          <ActionIcon onClick={onBack} variant="subtle">
            <IconChevronLeft size={20} />
          </ActionIcon>
        )}
        <Avatar 
          size="lg" 
          radius="xl"
          color={gender === 'female' ? 'pink' : 'blue'}
        >
          {patient.name?.[0]?.given?.[0]?.[0] || '?'}
        </Avatar>
        <div>
          <Text size="xl" weight={500}>
            {patient.name?.[0]?.text || 'Unknown Patient'}
          </Text>
          <Group spacing="xs">
            <Badge 
              leftSection={<GenderIcon size={12} />}
              variant="outline"
            >
              {gender || 'unknown'}
            </Badge>
            {patient.birthDate && (
              <Badge 
                leftSection={<IconCalendar size={12} />}
                variant="outline"
              >
                {formatDate(patient.birthDate)}
              </Badge>
            )}
          </Group>
        </div>
      </Group>
    </Group>
  );
} 