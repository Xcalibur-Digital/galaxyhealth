import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  Text, 
  Avatar, 
  Group, 
  Stack,
  Button,
  TextInput,
  Divider,
  Badge,
  Alert,
  Menu,
  ActionIcon,
  Select
} from '@mantine/core';
import { useUser } from '../../contexts/UserContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IconCheck, IconAlertCircle, IconDots } from '@tabler/icons-react';
import { storageService } from '../../services/storageService';
import { USER_ROLES, ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';

const ProfilePage = () => {
  const { user } = useUser();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [editingRole, setEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.role || 'user');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        updatedAt: new Date().toISOString()
      });
      
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const oldStatus = user.accountStatus || 'unknown';
      
      await updateDoc(userRef, {
        accountStatus: newStatus,
        statusUpdatedAt: new Date().toISOString(),
        isActive: newStatus === 'active',
        lastUpdated: new Date().toISOString()
      });

      // Log status change
      await storageService.logAuditEvent({
        type: 'ACCOUNT_STATUS_CHANGE',
        userId: user.uid,
        email: user.email,
        details: {
          oldStatus,
          newStatus,
          timestamp: new Date().toISOString(),
          action: 'ACCOUNT_STATUS_UPDATED'
        }
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update account status');
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const oldRole = user.role;
      
      await updateDoc(userRef, {
        role: newRole,
        roleUpdatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        permissions: newRole === 'admin' ? ['all'] : ['basic']
      });

      // Log role change
      await storageService.logAuditEvent({
        type: 'ROLE_CHANGE',
        userId: user.uid,
        email: user.email,
        details: {
          oldRole,
          newRole,
          timestamp: new Date().toISOString(),
          action: 'ROLE_UPDATED'
        }
      });

      setSuccess(true);
      setEditingRole(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update role');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'suspended': return 'yellow';
      case 'inactive': return 'gray';
      case 'locked': return 'red';
      default: return 'blue';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  return (
    <Container size="md" py="xl">
      <Paper p="xl" radius="md" withBorder>
        <Stack spacing="xl">
          <Group position="apart">
            <Group>
              <Avatar 
                src={user?.photoURL} 
                size="xl" 
                radius="xl"
              />
              <div>
                {editing ? (
                  <TextInput
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    size="lg"
                  />
                ) : (
                  <Title order={2}>{user?.displayName}</Title>
                )}
                <Text color="dimmed">{user?.email}</Text>
              </div>
            </Group>
          </Group>

          {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="filled"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              icon={<IconCheck size={16} />}
              title="Success"
              color="green"
              variant="filled"
            >
              Profile updated successfully
            </Alert>
          )}

          <Divider />

          <Stack spacing="md">
            <Group position="apart">
              <Text weight={500}>Role</Text>
              <Badge 
                size="lg"
                color={ROLE_COLORS[user?.role] || 'gray'}
              >
                {user?.role?.toUpperCase() || 'USER'}
              </Badge>
            </Group>

            <Group position="apart">
              <Text weight={500}>Account Status</Text>
              <Badge 
                size="lg"
                color={getStatusColor(user?.accountStatus)}
              >
                {user?.accountStatus?.toUpperCase() || 'ACTIVE'}
              </Badge>
            </Group>

            <Group position="apart">
              <Text weight={500}>Member Since</Text>
              <Text>
                {formatDate(user?.registeredAt || user?.createdAt)}
              </Text>
            </Group>
          </Stack>

          <Group position="right">
            {editing ? (
              <>
                <Button 
                  onClick={handleSave}
                  loading={saving}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="light" 
                  color="gray"
                  onClick={() => {
                    setEditing(false);
                    setDisplayName(user?.displayName || '');
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 