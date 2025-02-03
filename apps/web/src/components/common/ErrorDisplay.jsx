import React from 'react';
import { Alert, Container } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { rem } from '@mantine/core';

const ErrorDisplay = ({ error }) => {
  return (
    <Container size="sm" py="xl">
      <Alert
        icon={<IconAlertCircle size={rem(16)} />}
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