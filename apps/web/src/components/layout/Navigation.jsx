import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Navbar, Group, Button, Avatar, Text, Menu, UnstyledButton, Stack, Box } from '@mantine/core';
import { 
  IconHome, 
  IconUsers, 
  IconCalendar, 
  IconLogout, 
  IconUser,
  IconShieldLock 
} from '@tabler/icons-react';

export const Navigation = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

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
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Navbar 
      height="100%"
      p="md" 
      width={{ base: 250 }}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden'
      })}
    >
      <Navbar.Section 
        grow
        sx={{
          overflowY: 'auto'
        }}
      >
        <Stack spacing="xs">
          <Button
            component={Link}
            to="/"
            variant={isActiveRoute('/') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconHome size={20} />}
            styles={buttonStyles}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/patients"
            variant={isActiveRoute('/patients') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconUsers size={20} />}
            styles={buttonStyles}
          >
            Patients
          </Button>
          <Button
            component={Link}
            to="/appointments"
            variant={isActiveRoute('/appointments') ? 'filled' : 'subtle'}
            fullWidth
            leftIcon={<IconCalendar size={20} />}
            styles={buttonStyles}
          >
            Appointments
          </Button>

          {isAdmin && (
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

      <Navbar.Section 
        sx={{
          marginTop: 'auto',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'inherit',
          borderTop: '1px solid',
          borderColor: 'dark.4'
        }}
      >
        <Menu position="right" offset={12} withArrow>
          <Menu.Target>
            <UnstyledButton
              sx={(theme) => ({
                display: 'flex',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                }
              })}
            >
              <Group>
                <Avatar src={user?.photoURL} radius="xl" size={40}>
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {user?.displayName || user?.email}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {user?.role || 'User'}
                  </Text>
                </Box>
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item>
            <Menu.Item 
              color="red" 
              icon={<IconLogout size={14} />}
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Navbar.Section>
    </Navbar>
  );
}; 