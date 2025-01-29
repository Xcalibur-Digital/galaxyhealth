import React from 'react';
import Dashboard from '../components/Dashboard';
import MainLayout from '../components/MainLayout';
import LoginPage from '../components/auth/LoginPage';
import PatientList from '../components/patients/PatientList';
import PatientDetails from '../components/patients/PatientDetails';
import PatientDashboard from '../components/patients/PatientDashboard';

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    private: true,
    children: [
      {
        path: '/',
        element: <Dashboard />,
        private: true
      },
      {
        path: 'patients',
        children: [
          {
            path: '',
            element: <PatientList />,
            private: true
          },
          {
            path: ':id',
            element: <PatientDetails />,
            private: true
          }
        ]
      },
      {
        path: 'dashboard',
        element: <PatientDashboard />,
        private: true
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
    private: false
  }
]; 