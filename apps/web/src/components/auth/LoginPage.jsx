import React from 'react';
import { Container, Paper, Title, Tabs } from '@mantine/core';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const LoginPage = () => {
  const [activeTab, setActiveTab] = React.useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  const handleAuthSuccess = async (user) => {
    await login(user);
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return (
    <Container size="sm" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} align="center" mb="md">
          Welcome to Galaxy Health
        </Title>

        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List grow mb="md">
            <Tabs.Tab value="login">Login</Tabs.Tab>
            <Tabs.Tab value="register">Register</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login">
            <LoginForm onSuccess={handleAuthSuccess} />
          </Tabs.Panel>

          <Tabs.Panel value="register">
            <RegisterForm onSuccess={handleAuthSuccess} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default LoginPage; 