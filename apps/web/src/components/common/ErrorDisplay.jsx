import React from 'react';
import { Alert, Button, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Error"
      color="red"
      variant="filled"
    >
      {error.message || 'An unexpected error occurred'}
      {onRetry && (
        <Group position="right" mt="md">
          <Button variant="white" size="xs" onClick={onRetry}>
            Retry
          </Button>
        </Group>
      )}
    </Alert>
  );
};

export default ErrorDisplay; 