import React from 'react';
import { Card, Text, Group, Badge } from '@mantine/core';

const PatientCard = ({ patient }) => {
  const getName = () => {
    const name = patient.name?.[0] || {};
    return `${name.given?.[0] || ''} ${name.family || ''}`.trim() || 'Unknown';
  };

  const getAge = () => {
    if (!patient.birthDate) return 'Unknown';
    const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
    return `${age} years`;
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder className="patient-card">
      <div className="patient-info">
        <Group position="apart">
          <Text className="patient-name">{getName()}</Text>
          <Badge>{patient.gender || 'Unknown'}</Badge>
        </Group>

        <div className="patient-details">
          <Text className="patient-detail">
            Age: {getAge()}
          </Text>
          <Text className="patient-detail">
            ID: {patient.id}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default PatientCard; 