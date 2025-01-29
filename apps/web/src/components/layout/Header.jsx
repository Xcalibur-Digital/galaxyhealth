import React from 'react';
import { 
  Header as MantineHeader, 
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
    <MantineHeader height={60}>
      <Box className="animated-header">
        <Group position="apart" px="md" h="100%" w="100%">
          <Group spacing="xs" align="left" ml="0">
            <img 
              src="/arcadia-logo.svg" 
              alt="Arcadia.io" 
              style={{ height: 24 }}
              className="arcadia-logo"
            />
          </Group>
          
          <Text size="xl" weight={700} className="header-content" color="white">
            Galaxy Health
          </Text>

          <Group spacing="md">
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
                      cursor: 'pointer'
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
    </MantineHeader>
  );
};

export default Header; 