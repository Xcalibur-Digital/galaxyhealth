import React from 'react';
import { Paper, Title } from '@mantine/core';

const PatientChart = ({ patient }) => {
  return (
    <Paper p="md">
      <Title order={2}>Patient Chart</Title>
      {/* Add chart content here */}
    </Paper>
  );
};

export default PatientChart; 