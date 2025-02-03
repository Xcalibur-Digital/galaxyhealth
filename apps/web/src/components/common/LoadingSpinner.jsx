import React from 'react';
import { Center, Loader, Text, Stack, rem } from '@mantine/core';

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <Center style={{ height: '100%', minHeight: rem(200) }}>
    <Stack align="center" spacing="xs">
      <Loader size="lg" />
      <Text size="sm" c="dimmed">{message}</Text>
    </Stack>
  </Center>
);

export default LoadingSpinner; 