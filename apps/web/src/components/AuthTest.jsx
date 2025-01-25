import React from 'react';
import { Button, Text, Box } from '@mantine/core';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';

const AuthTest = () => {
  const testAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Auth successful:', result.user);
      alert('Authentication successful! Check console for details.');
    } catch (error) {
      console.error('Auth error:', error);
      alert(`Authentication error: ${error.message}`);
    }
  };

  return (
    <Box p="md">
      <Text mb="md">Test Authentication</Text>
      <Button onClick={testAuth}>
        Test Google Sign In
      </Button>
    </Box>
  );
};

export default AuthTest; 