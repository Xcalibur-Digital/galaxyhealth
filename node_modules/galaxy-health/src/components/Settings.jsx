import React, { useState } from 'react';
import { Box, Switch, Group, Text, Divider, Select, Button } from '@mantine/core';
import { IconBell, IconLock, IconLanguage, IconPalette } from '@tabler/icons-react';
import './Settings.css';

const Settings = ({ onClose }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false
  });

  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    // TODO: Implement settings save
    onClose();
  };

  return (
    <Box className="settings-form">
      <Box className="settings-section">
        <Group mb="md">
          <IconBell size={20} />
          <Text weight={500}>Notifications</Text>
        </Group>
        <Box ml="xl">
          <Switch
            label="Email Notifications"
            checked={notifications.email}
            onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
            mb="sm"
          />
          <Switch
            label="Push Notifications"
            checked={notifications.push}
            onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
            mb="sm"
          />
          <Switch
            label="Product Updates"
            checked={notifications.updates}
            onChange={(e) => setNotifications(prev => ({ ...prev, updates: e.target.checked }))}
          />
        </Box>
      </Box>

      <Divider my="lg" />

      <Box className="settings-section">
        <Group mb="md">
          <IconPalette size={20} />
          <Text weight={500}>Appearance</Text>
        </Group>
        <Select
          value={theme}
          onChange={setTheme}
          data={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' }
          ]}
          ml="xl"
        />
      </Box>

      <Divider my="lg" />

      <Box className="settings-section">
        <Group mb="md">
          <IconLanguage size={20} />
          <Text weight={500}>Language</Text>
        </Group>
        <Select
          value={language}
          onChange={setLanguage}
          data={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' }
          ]}
          ml="xl"
        />
      </Box>

      <Group position="right" mt="xl">
        <Button variant="subtle" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </Group>
    </Box>
  );
};

export default Settings; 