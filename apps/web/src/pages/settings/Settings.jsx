import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Paper, 
  Stack, 
  TextInput, 
  Switch, 
  Button, 
  Alert,
  Text,
  Group,
  Avatar,
  Divider,
  Tabs
} from '@mantine/core';
import { 
  IconCheck, 
  IconAlertCircle, 
  IconUser, 
  IconSettings, 
  IconBell 
} from '@tabler/icons-react';
import { useUser } from '../../contexts/UserContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Settings = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState({
    fhirServerUrl: '',
    debugMode: false,
    darkMode: true,
    notifications: true
  });
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        updatedAt: new Date().toISOString()
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const settingsRef = doc(db, 'userSettings', user.uid);
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Tabs defaultValue="profile">
        <Tabs.List mb="xl">
          <Tabs.Tab value="profile" icon={<IconUser size={14} />}>Profile</Tabs.Tab>
          <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>Application Settings</Tabs.Tab>
          <Tabs.Tab value="notifications" icon={<IconBell size={14} />}>Notifications</Tabs.Tab>
        </Tabs.List>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            mb="md"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            icon={<IconCheck size={16} />}
            title="Success"
            color="green"
            mb="md"
          >
            Changes saved successfully
          </Alert>
        )}

        <Tabs.Panel value="profile">
          <Paper p="xl" radius="md" withBorder>
            <Stack spacing="xl">
              <Group>
                <Avatar 
                  src={user?.photoURL} 
                  size="xl" 
                  radius="xl"
                />
                <div>
                  <TextInput
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    size="md"
                  />
                  <Text size="sm" color="dimmed" mt={4}>{user?.email}</Text>
                </div>
              </Group>

              <Divider />

              <Group position="right">
                <Button 
                  onClick={handleSaveProfile}
                  loading={saving}
                >
                  Save Profile
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="settings">
          <Paper p="xl" radius="md" withBorder>
            <Stack spacing="md">
              <TextInput
                label="FHIR Server URL"
                description="The URL of your FHIR server"
                value={settings.fhirServerUrl}
                onChange={(e) => setSettings({
                  ...settings,
                  fhirServerUrl: e.target.value
                })}
              />

              <Switch
                label="Debug Mode"
                description="Enable detailed logging"
                checked={settings.debugMode}
                onChange={(e) => setSettings({
                  ...settings,
                  debugMode: e.target.checked
                })}
              />

              <Switch
                label="Dark Mode"
                description="Use dark theme"
                checked={settings.darkMode}
                onChange={(e) => setSettings({
                  ...settings,
                  darkMode: e.target.checked
                })}
              />

              <Group position="right" mt="xl">
                <Button 
                  onClick={handleSaveSettings}
                  loading={saving}
                >
                  Save Settings
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="notifications">
          <Paper p="xl" radius="md" withBorder>
            <Stack spacing="md">
              <Switch
                label="Enable Notifications"
                description="Receive system notifications"
                checked={settings.notifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: e.target.checked
                })}
              />

              <Group position="right" mt="xl">
                <Button 
                  onClick={handleSaveSettings}
                  loading={saving}
                >
                  Save Notification Settings
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default Settings; 