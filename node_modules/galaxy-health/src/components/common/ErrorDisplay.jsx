import React from 'react';
import { Alert, Container } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const ErrorDisplay = ({ error }) => {
  return (
    <Container size="sm" py="xl">
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        variant="filled"
      >
        {error?.message || 'An unexpected error occurred'}
      </Alert>
    </Container>
  );
};

export default ErrorDisplay; 