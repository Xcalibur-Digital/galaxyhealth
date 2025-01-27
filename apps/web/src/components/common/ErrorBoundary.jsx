import React from 'react';
import { Alert, Container, Button, Stack } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { logError } from '../../utils/logger';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logError(error, { 
      component: 'ErrorBoundary',
      info 
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Something went wrong"
            color="red"
            variant="filled"
          >
            <Stack spacing="md">
              <div>{this.state.error?.message || 'An unexpected error occurred'}</div>
              <Button 
                variant="white" 
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Stack>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Add a default export as well
export default ErrorBoundary; 