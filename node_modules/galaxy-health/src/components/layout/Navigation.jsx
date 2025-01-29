import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Navbar, Group, Button, Avatar, Text, Menu, UnstyledButton, Stack, Box, Divider, Badge } from '@mantine/core';
import { 
  IconHome, 
  IconUsers, 
  IconCalendar, 
  IconLogout, 
  IconUser,
  IconShieldLock,
  IconSettings,
  IconChevronRight,
  IconChartBar,
  IconDatabase,
  IconHistory,
  IconBell
} from '@tabler/icons-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { USER_ROLES, ROLE_LABELS } from '../../constants/roles';
import { usePatient } from '../../contexts/PatientContext';
import { useNotificationStore } from '../../contexts/NotificationContext';
import { motion } from 'framer-motion';
import { useStyles } from '../../styles/useStyles';
import { auth } from '../../config/firebase';

export const Navigation = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const { classes } = useStyles();
  const { patients } = usePatient();
  const { notifications } = useNotificationStore();
  const [systemAlerts, setSystemAlerts] = useState(0);

  const navCounts = {
    patients: patients?.length || 0,
    'ehr-alerts': notifications.filter(n => !n.read).length,
    admin: systemAlerts
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: IconHome,
      to: '/dashboard'
    },
    {
      label: 'My Patients',
      icon: IconUsers,
      to: '/patients'
    },
    {
      label: 'Performance',
      icon: IconChartBar,
      to: '/performance'
    },
    {
      label: 'EHR Alerts',
      icon: IconBell,
      to: '/ehr-alerts'
    },
    {
      label: 'Settings',
      icon: IconSettings,
      to: '/settings'
    },
    {
      type: 'divider'
    },
    {
      label: 'Admin',
      icon: IconShieldLock,
      to: '/admin',
      roles: ['admin']
    }
  ];

  const bottomItems = [
    {
      label: 'Logout',
      icon: IconLogout,
      onClick: handleLogout,
      color: 'red'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const buttonStyles = {
    root: {
      justifyContent: 'flex-start',
      padding: '8px 12px'
    },
    inner: {
      justifyContent: 'flex-start'
    },
    leftIcon: {
      marginRight: '12px'
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const makeAdmin = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        role: 'admin',
        updatedAt: new Date()
      });
      window.location.reload(); // Refresh to update UI
    } catch (error) {
      console.error('Error making user admin:', error);
    }
  };

  const getRoleMenuItems = (role) => {
    switch (role) {
      case USER_ROLES.NURSE:
        return [
          { to: '/patients', label: 'Patients', icon: IconUsers },
          { to: '/appointments', label: 'Appointments', icon: IconCalendar },
          { to: '/tasks', label: 'Tasks', icon: IconChecklist }
        ];
      case USER_ROLES.PHYSICIAN:
        return [
          { to: '/patients', label: 'Patients', icon: IconUsers },
          { to: '/appointments', label: 'Schedule', icon: IconCalendar },
          { to: '/prescriptions', label: 'Prescriptions', icon: IconPrescription }
        ];
      case USER_ROLES.PRACTICE_STAFF:
        return [
          { to: '/appointments', label: 'Scheduling', icon: IconCalendar },
          { to: '/patients', label: 'Patient Records', icon: IconFolder }
        ];
      case USER_ROLES.ANALYST:
        return [
          { to: '/analytics', label: 'Analytics', icon: IconChart },
          { to: '/reports', label: 'Reports', icon: IconDocument }
        ];
      default:
        return [
          { to: '/dashboard', label: 'Dashboard', icon: IconHome },
          { to: '/patients', label: 'Patients', icon: IconUsers }
        ];
    }
  };

  const menuItems = getRoleMenuItems(user?.role);

  const NavItem = ({ icon: Icon, label, to, index, id, count }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Box
        sx={(theme) => ({
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          transition: 'background-color 150ms ease',
          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' 
              ? theme.colors.dark[5] 
              : theme.colors.gray[0]
          }
        })}
      >
        <Group spacing="sm" noWrap>
          <Icon size={20} className={classes.navIcon + ' nav-icon'} />
          <Group spacing="xs" align="center">
            <Text className={classes.navLabel}>{label}</Text>
            {count > 0 && (
              <Badge 
                size="sm" 
                variant="filled" 
                sx={{ 
                  backgroundColor: 'transparent',
                  border: `1px solid ${isActiveRoute(to) ? 'currentColor' : 'transparent'}`,
                  color: isActiveRoute(to) ? 'inherit' : '#868e96'
                }}
              >
                {count}
              </Badge>
            )}
          </Group>
        </Group>
      </Box>
    </motion.div>
  );

  return (
    <Navbar 
      height="100%"
      p="md" 
      width={{ base: 250 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <Navbar.Section 
        grow
        sx={{
          overflowY: 'auto'
        }}
      >
        <Stack spacing="xs">
          {navigationItems.map((item, index) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              to={item.to}
              index={index}
              id={item.id}
              count={item.count}
            />
          ))}
          {user?.role === 'admin' && (
            <Button
              component={Link}
              to="/admin"
              variant={isActiveRoute('/admin') ? 'filled' : 'subtle'}
              fullWidth
              leftIcon={<IconShieldLock size={20} />}
              styles={buttonStyles}
            >
              Admin
            </Button>
          )}
        </Stack>
      </Navbar.Section>

      <Box
        sx={(theme) => ({
          borderTop: `1px solid ${theme.colors.dark[4]}`,
          marginTop: 'auto',
          padding: theme.spacing.xs
        })}
      >
        <Menu 
          position="right-end"
          offset={0}
          withArrow
          width={200}
          transitionProps={{ transition: 'pop' }}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              sx={(theme) => ({
                display: 'flex',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                transition: 'background-color 150ms ease',
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' 
                    ? theme.colors.dark[5] 
                    : theme.colors.gray[0]
                }
              })}
            >
              <Group spacing="xs">
                <Avatar 
                  src={user?.photoURL} 
                  radius="xl" 
                  size={40}
                >
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500} lineClamp={1}>
                    {user?.displayName || user?.email}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {user?.role || 'User'}
                  </Text>
                </Box>
                <IconChevronRight size={16} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item 
              icon={<IconUser size={16} />}
              component={Link}
              to="/profile"
            >
              Profile
            </Menu.Item>
            <Menu.Item icon={<IconSettings size={16} />}>
              Settings
            </Menu.Item>
            
            {!isAdmin && (
              <>
                <Divider my="xs" />
                <Menu.Item 
                  icon={<IconShieldLock size={16} />}
                  onClick={makeAdmin}
                >
                  Make Admin
                </Menu.Item>
              </>
            )}
            
            <Divider my="xs" />
            <Menu.Item 
              color="red" 
              icon={<IconLogout size={16} />}
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Navbar>
  );
};

export default Navigation; 