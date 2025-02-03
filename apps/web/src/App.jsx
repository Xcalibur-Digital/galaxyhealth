import React, { useEffect } from 'react';
import { MantineProvider, AppShell, Text, Box, Group, rem } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate, useLocation, createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import PatientContextHistory from './pages/PatientContextHistory';
import './styles/Header.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { Notifications } from '@mantine/notifications';
import { PatientProvider } from './contexts/PatientContext';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/transitions/PageTransition';
import useNotificationStore from './stores/notificationStore';
import PatientDetails from './components/patients/PatientDetails';
import { Header as CustomHeader } from './components/layout/Header';
import './styles/global.css';

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
  const location = useLocation();
  const initializeNotifications = useNotificationStore(state => state.initialize);

  useEffect(() => {
    // Initialize notifications when app loads
    const unsubscribe = initializeNotifications();
    return () => unsubscribe?.();
  }, [initializeNotifications]);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppShell
      header={{ height: rem(60) }}
      navbar={{ width: rem(250), breakpoint: 'sm' }}
      padding="md"
      layout="alt"
    >
      <AppShell.Header>
        <CustomHeader />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation />
      </AppShell.Navbar>
      <AppShell.Main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={
              <PrivateRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </PrivateRoute>
            } />
            <Route path="/patients" element={
              <PrivateRoute>
                <PageTransition>
                  <PatientList />
                </PageTransition>
              </PrivateRoute>
            } />
            <Route path="/patients/:id" element={
              <PrivateRoute>
                <PageTransition>
                  <PatientDetails />
                </PageTransition>
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
            <Route path="/patient-context" element={
              <PrivateRoute>
                <PageTransition>
                  <PatientContextHistory />
                </PageTransition>
              </PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </AppShell.Main>
    </AppShell>
  );
};

const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <UserProvider>
        <PatientProvider>
          <AppLayout />
        </PatientProvider>
      </UserProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <PrivateRoute><PageTransition><Dashboard /></PageTransition></PrivateRoute>
      },
      {
        path: "patients",
        element: <PrivateRoute><PageTransition><PatientList /></PageTransition></PrivateRoute>
      },
      {
        path: "patients/:id",
        element: <PrivateRoute><PageTransition><PatientDetails /></PageTransition></PrivateRoute>
      },
      {
        path: "settings",
        element: <PrivateRoute><Settings /></PrivateRoute>
      },
      {
        path: "performance",
        element: <PrivateRoute><Performance /></PrivateRoute>
      },
      {
        path: "ehr-alerts",
        element: <PrivateRoute><EHRAlerts /></PrivateRoute>
      },
      {
        path: "ai-recommendations",
        element: <PrivateRoute><AIRecommendations /></PrivateRoute>
      },
      {
        path: "patient-context",
        element: <PrivateRoute><PageTransition><PatientContextHistory /></PageTransition></PrivateRoute>
      },
      {
        path: "",
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

const App = () => {
  return (
    <ThemeProvider>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <RouterProvider router={router} />
      </MantineProvider>
    </ThemeProvider>
  );
};

export default App; 