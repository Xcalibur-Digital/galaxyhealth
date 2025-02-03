import React from 'react';
import { Container, Paper, Title, Text, Button, Group, rem, Box } from '@mantine/core';
import LoginForm from './LoginForm';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful:', result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('Please allow popups for this site');
      } else {
        alert('Error signing in with Google');
      }
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} align="center" mb="xl">Welcome to Galaxy Health</Title>
        <LoginForm onGoogleSignIn={handleGoogleSignIn} />
      </Paper>
    </Container>
  );
};

export default LoginPage; 