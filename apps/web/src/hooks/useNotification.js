import { useCallback } from 'react';
import { showNotification } from '@mantine/notifications';

export function useNotification() {
  const success = useCallback((message) => {
    showNotification({
      title: 'Success',
      message,
      color: 'green'
    });
  }, []);

  const error = useCallback((message) => {
    showNotification({
      title: 'Error',
      message,
      color: 'red'
    });
  }, []);

  const info = useCallback((message) => {
    showNotification({
      title: 'Info',
      message,
      color: 'blue'
    });
  }, []);

  return { success, error, info };
} 