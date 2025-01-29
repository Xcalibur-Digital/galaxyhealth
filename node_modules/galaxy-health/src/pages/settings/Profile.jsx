import React from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Avatar, 
  Group, 
  Stack, 
  Button, 
  Divider,
  Box 
} from '@mantine/core';
import { useUser } from '../../contexts/UserContext';
import { IconLogout, IconEdit } from '@tabler/icons-react';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
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
    <Paper p="xl" radius="md" withBorder>
      <Stack spacing="xl">
        <Group position="apart">
          <Title order={3}>Profile Settings</Title>
          <Button 
            variant="light" 
            color="red" 
            leftIcon={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Group>

        <Divider />

        <Group>
          <Avatar 
            src={user?.photoURL} 
            size="xl" 
            radius="xl"
            sx={(theme) => ({
              border: `2px solid ${theme.colors.blue[5]}`
            })}
          >
            {user?.displayName?.charAt(0)}
          </Avatar>
          <Box>
            <Text size="xl" weight={500}>{user?.displayName}</Text>
            <Text size="sm" color="dimmed">{user?.email}</Text>
          </Box>
        </Group>

        <Stack spacing="md">
          <Group position="apart">
            <div>
              <Text weight={500}>Role</Text>
              <Text size="sm" color="dimmed">Your system access level</Text>
            </div>
            <Text>{user?.role || 'Provider'}</Text>
          </Group>

          <Group position="apart">
            <div>
              <Text weight={500}>Last Login</Text>
              <Text size="sm" color="dimmed">Your most recent sign in</Text>
            </div>
            <Text>{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</Text>
          </Group>

          <Button 
            variant="light"
            leftIcon={<IconEdit size={16} />}
            mt="md"
          >
            Edit Profile
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Profile; 