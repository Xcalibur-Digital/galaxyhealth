import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { RoleBasedComponent } from './RoleBasedComponent';
import './Navigation.css';
import { Navbar, Group, Button } from '@mantine/core';
import { IconHome, IconUsers, IconCalendar, IconSettings } from '@tabler/icons-react';

const ROLE_MENU_ITEMS = {
  nurse: [
    { to: '/patients', label: 'Patients', icon: 'users' },
    { to: '/appointments', label: 'Appointments', icon: 'calendar' },
    { to: '/tasks', label: 'Tasks', icon: 'checklist' }
  ],
  physician: [
    { to: '/patients', label: 'Patients', icon: 'users' },
    { to: '/appointments', label: 'Schedule', icon: 'calendar' },
    { to: '/prescriptions', label: 'Prescriptions', icon: 'prescription' },
    { to: '/lab-results', label: 'Lab Results', icon: 'lab' }
  ],
  practice_staff: [
    { to: '/appointments', label: 'Scheduling', icon: 'calendar' },
    { to: '/patients', label: 'Patient Records', icon: 'folder' },
    { to: '/billing', label: 'Billing', icon: 'dollar' }
  ],
  analyst: [
    { to: '/analytics', label: 'Analytics', icon: 'chart' },
    { to: '/reports', label: 'Reports', icon: 'document' },
    { to: '/exports', label: 'Data Exports', icon: 'download' }
  ]
};

const Navigation = () => {
  const { user } = useUser();
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar height="100vh" p="md" width={{ base: 250 }}>
      <Navbar.Section>
        <Group direction="column" spacing="xs" style={{ width: '100%' }}>
          <Button
            component={Link}
            to="/"
            variant={isActiveRoute('/') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconHome size={20} />}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/patients"
            variant={isActiveRoute('/patients') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconUsers size={20} />}
          >
            Patients
          </Button>
          <Button
            component={Link}
            to="/appointments"
            variant={isActiveRoute('/appointments') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconCalendar size={20} />}
          >
            Appointments
          </Button>
          <Button
            component={Link}
            to="/settings"
            variant={isActiveRoute('/settings') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconSettings size={20} />}
          >
            Settings
          </Button>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
};

export default Navigation; 