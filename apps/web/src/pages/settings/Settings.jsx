import React, { useState, useEffect } from 'react';
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
  Tabs,
  useMantineColorScheme,
  Select,
  createTheme,
  rem
} from '@mantine/core';
import { 
  IconCheck, 
  IconAlertCircle, 
  IconUser, 
  IconSettings, 
  IconBell,
  IconSun,
  IconMoonStars
} from '@tabler/icons-react';
import { useUser } from '../../contexts/UserContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { showNotification } from '@mantine/notifications';

const useStyles = createTheme((theme) => ({
  container: {
    maxWidth: rem(800),
    margin: '0 auto',
    padding: theme.spacing.xl,
    '@media (max-width: theme.breakpoints.sm)': {
      padding: theme.spacing.md
    }
  },
  section: {
    marginBottom: rem(32),
    '@media (max-width: theme.breakpoints.sm)': {
      marginBottom: rem(24)
    }
  }
}));

const Settings = () => {
  const { user } = useUser();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [settings, setSettings] = useState({
    fhirServerUrl: '',
    debugMode: false,
    notifications: true,
    theme: colorScheme,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dashboardLayout: 'default',
    emailNotifications: {
      careGaps: true,
      appointments: true,
      riskScores: true
    },
    displayPreferences: {
      compactView: false,
      showMetricLabels: true,
      defaultDateRange: '30days'
    }
  });
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const settingsRef = doc(db, 'userSettings', user.uid);
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const savedSettings = settingsSnap.data();
        setSettings(prev => ({
          ...prev,
          ...savedSettings,
          theme: colorScheme
        }));
      } else {
        await updateDoc(settingsRef, {
          ...settings,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

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
        theme: colorScheme,
        updatedAt: new Date().toISOString()
      });

      showNotification({
        title: 'Settings Saved',
        message: 'Your preferences have been updated successfully',
        color: 'green'
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      showNotification({
        title: 'Error',
        message: 'Failed to save settings',
        color: 'red'
      });
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

              <Group position="apart">
                <Text>Theme Mode</Text>
                <Switch
                  checked={colorScheme === 'dark'}
                  onChange={() => toggleColorScheme()}
                  size="lg"
                  onLabel={<IconSun size={16} stroke={2.5} />}
                  offLabel={<IconMoonStars size={16} stroke={2.5} />}
                />
              </Group>

              <Divider label="Display Preferences" />
              <Switch
                label="Compact View"
                checked={settings.displayPreferences.compactView}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  displayPreferences: {
                    ...prev.displayPreferences,
                    compactView: e.currentTarget.checked
                  }
                }))}
              />

              <Switch
                label="Show Metric Labels"
                checked={settings.displayPreferences.showMetricLabels}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  displayPreferences: {
                    ...prev.displayPreferences,
                    showMetricLabels: e.currentTarget.checked
                  }
                }))}
              />

              <Select
                label="Default Date Range"
                value={settings.displayPreferences.defaultDateRange}
                onChange={(value) => setSettings(prev => ({
                  ...prev,
                  displayPreferences: {
                    ...prev.displayPreferences,
                    defaultDateRange: value
                  }
                }))}
                data={[
                  { value: '7days', label: 'Last 7 Days' },
                  { value: '30days', label: 'Last 30 Days' },
                  { value: '90days', label: 'Last 90 Days' },
                  { value: 'ytd', label: 'Year to Date' }
                ]}
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