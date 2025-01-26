import React from 'react';
import { Stack, TextInput, NumberInput, Switch, Button, Text } from '@mantine/core';

const SystemConfig = () => {
  return (
    <div>
      <Text size="lg" weight={500} mb="md">System Configuration</Text>
      <Stack spacing="md">
        <TextInput
          label="FHIR Server URL"
          placeholder="Enter FHIR server URL"
        />
        <NumberInput
          label="API Rate Limit"
          placeholder="Requests per minute"
          min={1}
        />
        <Switch
          label="Enable Debug Mode"
          description="Show detailed error messages and logging"
        />
        <Button>Save Configuration</Button>
      </Stack>
    </div>
  );
};

export default SystemConfig; 