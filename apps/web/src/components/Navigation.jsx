import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { RoleBasedComponent } from './RoleBasedComponent';
import './Navigation.css';
import { Navbar, Stack, Button, createStyles, Box } from '@mantine/core';
import { IconHome, IconUsers, IconCalendar, IconSettings, IconChartBar, IconCoin, IconDatabase } from '@tabler/icons-react';

// Arcadia.io colors
const ARCADIA_COLORS = {
  purple: '#6E2B81',
  lightPurple: '#8A3A9B',
  green: '#00B6AD',
  lightGreen: '#45C1B9',
  red: '#B82C5D',
  darkRed: '#8A2147'
};

const useStyles = createStyles((theme) => ({
  button: {
    position: 'relative',
    border: 'none',
    background: 'transparent',
    color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7],
    '& .mantine-Button-leftIcon': {
      color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7]
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: theme.radius.sm,
      padding: '2px',
      background: `linear-gradient(135deg, ${ARCADIA_COLORS.purple} 0%, ${ARCADIA_COLORS.red} 100%)`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      opacity: 0.5,
      transition: 'opacity 0.3s ease'
    },
    '&[data-active]': {
      background: 'transparent',
      color: ARCADIA_COLORS.purple,
      '& .mantine-Button-leftIcon': {
        color: ARCADIA_COLORS.purple
      },
      '&::before': {
        opacity: 1
      },
      '&:hover': {
        background: 'transparent',
        '&::before': {
          opacity: 0.8,
          background: `linear-gradient(135deg, ${ARCADIA_COLORS.lightPurple} 0%, ${ARCADIA_COLORS.darkRed} 100%)`
        }
      }
    },
    '& .mantine-Button-inner': {
      justifyContent: 'flex-start'
    },
    '&:hover': {
      background: 'transparent',
      '&::before': {
        opacity: 0.8
      }
    },
    transition: 'all 0.3s ease'
  }
}));

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
  const { classes } = useStyles();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar width={{ base: 250 }} p="md">
      <Stack spacing="xs" align="stretch" justify="space-between" h="100%">
        <Stack spacing="xs">
          <Button
            component={Link}
            to="/dashboard"
            variant={isActiveRoute('/dashboard') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconHome size={20} />}
            className={classes.button}
            data-active={isActiveRoute('/dashboard')}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/patients"
            variant={isActiveRoute('/patients') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconUsers size={20} />}
            className={classes.button}
            data-active={isActiveRoute('/patients')}
          >
            Patients
          </Button>
          <Button
            component={Link}
            to="/performance"
            variant={isActiveRoute('/performance') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconChartBar size={20} />}
            className={classes.button}
            data-active={isActiveRoute('/performance')}
          >
            Performance
          </Button>
          <Button
            component={Link}
            to="/ehr-alerts"
            variant={isActiveRoute('/ehr-alerts') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconDatabase size={20} />}
            className={classes.button}
            data-active={isActiveRoute('/ehr-alerts')}
          >
            EHR Alerts
          </Button>
        </Stack>

        <Button
          component={Link}
          to="/settings"
          variant={isActiveRoute('/settings') ? 'filled' : 'subtle'}
          fullWidth
          leftIcon={<IconSettings size={20} />}
          className={classes.button}
          data-active={isActiveRoute('/settings')}
        >
          Settings
        </Button>
      </Stack>
    </Navbar>
  );
};

export default Navigation; 