import React from 'react';
import { MantineProvider, AppShell, Header, Text, Box, Group } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { theme } from './styles/theme';
import Navigation from './components/Navigation';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './pages/Dashboard';
import { LoadingSpinner } from './components/common';
import PatientList from './components/patients/PatientList';
import Settings from './pages/settings/Settings';
import Performance from './pages/Performance';
import EHRAlerts from './pages/EHRAlerts';
import AIRecommendations from './pages/AIRecommendations';
import './styles/Header.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { Notifications } from '@mantine/notifications';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppLayout = () => {
  const { user } = useUser();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppShell
      padding="md"
      navbar={<Navigation />}
      header={
        <Header height={60}>
          <Box className="animated-header">
            <Group position="apart" px="md" h="100%" w="100%">
              <Text size="xl" weight={700} className="header-content">
                Galaxy Health
              </Text>
              <Group spacing="xs" align="center" ml="auto">
                <img 
                  src="/arcadia-logo.svg" 
                  alt="Arcadia.io" 
                  style={{ height: 24 }}
                  className="arcadia-logo"
                />
                <Text 
                  size="sm" 
                  weight={500} 
                  color="white" 
                  sx={{ opacity: 0.9 }}
                >
                  Powered by Arcadia.io
                </Text>
              </Group>
            </Group>
          </Box>
        </Header>
      }
    >
      <Routes>
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/patients" element={
          <PrivateRoute>
            <PatientList />
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />
        <Route path="/performance" element={
          <PrivateRoute>
            <Performance />
          </PrivateRoute>
        } />
        <Route path="/ehr-alerts" element={
          <PrivateRoute>
            <EHRAlerts />
          </PrivateRoute>
        } />
        <Route path="/ai-recommendations" element={
          <PrivateRoute>
            <AIRecommendations />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Notifications />
      <BrowserRouter>
        <UserProvider>
          <AppLayout />
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App; 