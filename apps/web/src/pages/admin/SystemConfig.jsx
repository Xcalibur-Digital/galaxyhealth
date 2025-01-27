import React, { useState, useEffect } from 'react';
import { Stack, TextInput, NumberInput, Switch, Button, Text, Alert } from '@mantine/core';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useUser } from '../../contexts/UserContext';
import { logError } from '../../utils/logger';

const SystemConfig = () => {
  const { user } = useUser();
  const [config, setConfig] = useState({
    fhirServerUrl: '',
    apiRateLimit: 100,
    debugMode: false,
    maintenanceMode: false
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === 'brendansmithelion@gmail.com' || user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadConfig();
    }
  }, [isAdmin]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const configRef = doc(db, 'system', 'config');
      const docSnap = await getDoc(configRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig({
          fhirServerUrl: data.fhirServerUrl || '',
          apiRateLimit: data.apiRateLimit || 100,
          debugMode: data.debugMode || false,
          maintenanceMode: data.maintenanceMode || false
        });
      } else {
        // Create default config
        const defaultConfig = {
          fhirServerUrl: '',
          apiRateLimit: 100,
          debugMode: false,
          maintenanceMode: false,
          createdBy: user.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (isAdmin) {
          await setDoc(configRef, defaultConfig);
          setConfig(defaultConfig);
        }
      }
    } catch (err) {
      logError(err, {
        component: 'SystemConfig',
        action: 'loadConfig',
        user: user?.email
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      const configRef = doc(db, 'system', 'config');
      await setDoc(configRef, {
        ...config,
        updatedBy: user.email,
        updatedAt: new Date().toISOString()
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      logError(err, { 
        component: 'SystemConfig', 
        action: 'handleSave',
        user: user?.email 
      });
      setError(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={16} />}>
        You don't have permission to access system configuration.
      </Alert>
    );
  }

  if (loading) {
    return <Text>Loading configuration...</Text>;
  }

  return (
    <div>
      <Text size="lg" weight={500} mb="md">System Configuration</Text>

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

      {saved && (
        <Alert 
          icon={<IconCheck size={16} />}
          title="Success"
          color="green"
          mb="md"
        >
          Configuration saved successfully
        </Alert>
      )}

      <Stack spacing="md">
        <TextInput
          label="FHIR Server URL"
          placeholder="Enter FHIR server URL"
          value={config.fhirServerUrl}
          onChange={(e) => setConfig({
            ...config,
            fhirServerUrl: e.target.value
          })}
        />
        <NumberInput
          label="API Rate Limit"
          placeholder="Requests per minute"
          min={1}
          value={config.apiRateLimit}
          onChange={(value) => setConfig({
            ...config,
            apiRateLimit: value
          })}
        />
        <Switch
          label="Enable Debug Mode"
          description="Show detailed error messages and logging"
          checked={config.debugMode}
          onChange={(e) => setConfig({
            ...config,
            debugMode: e.target.checked
          })}
        />
        <Button 
          onClick={handleSave}
          disabled={!isAdmin}
        >
          Save Configuration
        </Button>
      </Stack>
    </div>
  );
};

export default SystemConfig; 