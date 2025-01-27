import React from 'react';
import { Center, Loader, Text, Stack } from '@mantine/core';

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <Center style={{ height: '100%', minHeight: 200 }}>
    <Stack align="center" spacing="xs">
      <Loader size="lg" />
      <Text size="sm" color="dimmed">{message}</Text>
    </Stack>
  </Center>
);

export default LoadingSpinner; 