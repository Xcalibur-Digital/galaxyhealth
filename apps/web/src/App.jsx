import React from 'react';
import { AppShell, Header, Text, Group } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import PatientList from './components/patients/PatientList';
import LoginPage from './components/auth/LoginPage';
import { UserProvider, useUser } from './contexts/UserContext';
import './styles/index.css';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/auth/AdminRoute';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppContent = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <AppShell
      padding="md"
      navbar={<Navigation />}
      header={
        <Header height={60} p="xs">
          <Group position="apart">
            <Text size="xl" weight={700}>Galaxy Health</Text>
          </Group>
        </Header>
      }
    >
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/patients" element={
          <PrivateRoute>
            <PatientList />
          </PrivateRoute>
        } />
        <Route path="/appointments" element={
          <PrivateRoute>
            <Text>Appointments Coming Soon</Text>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <Text>Settings Coming Soon</Text>
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </PrivateRoute>
        } />
      </Routes>
    </AppShell>
  );
};

const App = () => {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
};

export default App; 