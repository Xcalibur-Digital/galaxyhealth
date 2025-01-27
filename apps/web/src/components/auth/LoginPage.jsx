import React from 'react';
import { Container, Paper, Title } from '@mantine/core';
import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <Container size="sm" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} align="center" mb="xl">Welcome to Galaxy Health</Title>
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default LoginPage; 