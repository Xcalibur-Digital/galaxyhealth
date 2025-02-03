import React from 'react';
import { 
  Group, 
  ActionIcon, 
  Menu, 
  Avatar, 
  Text,
  Divider,
  UnstyledButton,
  Box
} from '@mantine/core';
import { 
  IconBell, 
  IconSettings, 
  IconLogout,
  IconUser
} from '@tabler/icons-react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { NotificationCenter } from '../notifications/NotificationCenter';

export const Header = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box 
      h="60px"
      className="animated-header"
      px="xl"
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? 
          theme.colors.dark[4] : theme.colors.gray[2]
        }`,
        background: theme.colorScheme === 'dark' ? 
          'linear-gradient(-45deg, #6E2B81, #B82C5D)' : 
          'linear-gradient(-45deg, #4263EB, #3B5BDB)',
        position: 'relative',
        zIndex: 200
      })}
    >
      <Group 
        position="apart" 
        h="100%" 
      >
        <Box>
          <Group 
            spacing={0} 
            align="center" 
            sx={{ 
              height: '100%',
              '& > *': {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          >
            <Box
              sx={(theme) => ({
                filter: theme.colorScheme === 'dark' ? 'none' : 'brightness(0) invert(1)',
                display: 'flex',
                alignItems: 'center',
                marginRight: 24
              })}
            >
              <img 
                src="/arcadia-logo.svg" 
                alt="Arcadia.io" 
                style={{ height: 24 }}
              />
            </Box>
            <Text 
              size="xl" 
              weight={700} 
              color="white"
              sx={(theme) => ({
                letterSpacing: '-0.5px',
                lineHeight: 1,
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              })}
            >
              Galaxy Health
            </Text>
          </Group>
        </Box>

        <Group spacing="xl" align="center" ml="auto">
          <NotificationCenter />
          
          <Menu
            width={200}
            position="bottom-end"
            shadow="md"
            withArrow
          >
            <Menu.Target>
              <UnstyledButton>
                <Avatar 
                  size="md" 
                  radius="xl"
                  src={user?.photoURL}
                  sx={(theme) => ({
                    border: `2px solid ${theme.white}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  })}
                >
                  {user?.displayName?.charAt(0)}
                </Avatar>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Text size="sm" weight={500}>{user?.displayName}</Text>
                <Text size="xs" color="dimmed">{user?.email}</Text>
              </Menu.Label>
              
              <Divider my="xs" />
              
              <Menu.Item 
                icon={<IconUser size={14} />}
                onClick={() => navigate('/settings/profile')}
              >
                Profile
              </Menu.Item>
              
              <Menu.Item 
                icon={<IconSettings size={14} />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Menu.Item>
              
              <Divider my="xs" />
              
              <Menu.Item 
                color="red" 
                icon={<IconLogout size={14} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Box>
  );
};

export default Header; 