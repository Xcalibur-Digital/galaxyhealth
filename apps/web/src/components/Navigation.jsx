import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { usePatient } from '../contexts/PatientContext';
import useRecommendationsStore from '../stores/recommendationsStore';
import { 
  AppShell, 
  Stack, 
  Box, 
  Text, 
  Group, 
  Divider,
  NavLink,
  ThemeIcon,
  Badge
} from '@mantine/core';
import { 
  IconHome, 
  IconUsers, 
  IconCalendar, 
  IconSettings, 
  IconChartBar, 
  IconCoin, 
  IconDatabase, 
  IconHistory 
} from '@tabler/icons-react';

const navLinkStyles = (theme) => ({
  navLink: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xs,
    '&[data-active]': {
      backgroundColor: theme.fn.rgba(theme.colors.blue[7], 0.1)
    },
    '&:hover': {
      backgroundColor: theme.fn.rgba(theme.colors.blue[7], 0.05)
    }
  }
});

const Navigation = () => {
  const location = useLocation();
  const { user } = useUser();
  const { patients } = usePatient();
  const { metrics } = useRecommendationsStore();

  const vbcScore = metrics?.vbcScore || 0;

  const navigationItems = [
    { id: 'dashboard', icon: IconHome, label: 'Home', to: '/dashboard' },
    { 
      id: 'patients', 
      icon: IconUsers, 
      label: 'Patient Panel', 
      to: '/patients',
      rightSection: (
        <Badge 
          size="sm" 
          variant="filled" 
          color="blue"
          sx={{ width: 'auto' }}
        >
          {patients?.length || 0}
        </Badge>
      )
    },
    { 
      id: 'performance', 
      icon: IconChartBar, 
      label: 'Performance', 
      to: '/performance',
      rightSection: (
        <Badge 
          size="sm" 
          variant="filled" 
          color={vbcScore >= 75 ? 'green' : vbcScore >= 50 ? 'yellow' : 'red'}
          sx={{ width: 'auto' }}
        >
          {vbcScore}%
        </Badge>
      )
    },
    { id: 'ehr-alerts', icon: IconDatabase, label: 'EHR Alerts', to: '/ehr-alerts' },
    { id: 'admin', icon: IconHistory, label: 'Admin', to: '/patient-context' },
  ];

  const settingsItem = {
    id: 'settings',
    icon: IconSettings,
    label: 'Settings',
    to: '/settings'
  };

  return (
    <AppShell.Navbar 
      p="md" 
      w={260}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        borderRight: `1px solid ${
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
        }`,
        zIndex: 100
      })}
    >
      <Stack spacing="xs" h="100%">
        <Box sx={{ flex: 1 }}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              component={Link}
              to={item.to}
              label={item.label}
              active={location.pathname === item.to}
              leftSection={
                <ThemeIcon variant="light" size="lg">
                  <item.icon size={20} style={{ width: 20, height: 20 }} stroke={1.5} />
                </ThemeIcon>
              }
              rightSection={item.rightSection}
              sx={(theme) => ({
                borderRadius: theme.radius.md,
                marginBottom: theme.spacing.xs,
                transition: 'all 200ms ease',
                '&[data-active=true]': {
                  background: theme.colorScheme === 'dark'
                    ? 'linear-gradient(45deg, rgba(110, 43, 129, 0.5), rgba(184, 44, 93, 0.5))'
                    : 'linear-gradient(45deg, rgba(66, 99, 235, 0.5), rgba(59, 91, 219, 0.5))',
                  color: 'white',
                  '& .mantine-ThemeIcon-root': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  },
                  '& .mantine-Badge-root': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }
                },
                '&:hover': {
                  background: theme.colorScheme === 'dark'
                    ? 'linear-gradient(45deg, rgba(110, 43, 129, 0.2), rgba(184, 44, 93, 0.2))'
                    : 'linear-gradient(45deg, rgba(66, 99, 235, 0.2), rgba(59, 91, 219, 0.2))'
                }
              })}
            />
          ))}
        </Box>

        <Divider />

        <NavLink
          component={Link}
          to={settingsItem.to}
          label={settingsItem.label}
          active={location.pathname === settingsItem.to}
          leftSection={
            <ThemeIcon variant="light" size="lg">
              <settingsItem.icon size={20} style={{ width: 20, height: 20 }} stroke={1.5} />
            </ThemeIcon>
          }
          sx={(theme) => ({
            borderRadius: theme.radius.md,
            marginBottom: theme.spacing.xs,
            transition: 'all 200ms ease',
            '&[data-active=true]': {
              background: theme.colorScheme === 'dark'
                ? 'linear-gradient(45deg, rgba(110, 43, 129, 0.5), rgba(184, 44, 93, 0.5))'
                : 'linear-gradient(45deg, rgba(66, 99, 235, 0.5), rgba(59, 91, 219, 0.5))',
              color: 'white',
              '& .mantine-ThemeIcon-root': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              },
              '& .mantine-Badge-root': {
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              }
            },
            '&:hover': {
              background: theme.colorScheme === 'dark'
                ? 'linear-gradient(45deg, rgba(110, 43, 129, 0.2), rgba(184, 44, 93, 0.2))'
                : 'linear-gradient(45deg, rgba(66, 99, 235, 0.2), rgba(59, 91, 219, 0.2))'
            }
          })}
        />
      </Stack>
    </AppShell.Navbar>
  );
};

export default Navigation; 