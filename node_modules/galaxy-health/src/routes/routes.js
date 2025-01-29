import PatientList from '../components/patients/PatientList';
import PatientDetails from '../components/patients/PatientDetails';
import PatientDashboard from '../components/patients/PatientDashboard';
import Dashboard from '../components/Dashboard';
import MainLayout from '../components/MainLayout';
import LoginPage from '../components/auth/LoginPage';

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
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
    private: false
  },
  {
    path: '/',
    element: <MainLayout />,
    private: true,
    children: [
      {
        path: 'patients',
        children: [
          {
            path: '',
            element: <PatientList />
          },
          {
            path: ':id',
            element: <PatientDetails />
          }
        ]
      },
      {
        path: 'dashboard',
        element: <PatientDashboard />
      }
    ]
  }
]; 