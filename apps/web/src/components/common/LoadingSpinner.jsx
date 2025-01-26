import React from 'react';
import { Center, Loader } from '@mantine/core';

const LoadingSpinner = () => {
  return (
    <Center style={{ height: '100%', minHeight: 200 }}>
      <Loader size="lg" />
    </Center>
  );
};

export default LoadingSpinner; 