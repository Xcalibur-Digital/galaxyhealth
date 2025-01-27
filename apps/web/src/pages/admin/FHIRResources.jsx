import React, { useState } from 'react';
import { 
  Stack, 
  Button, 
  Group, 
  Text, 
  Select,
  JsonInput,
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fhirService } from '../../services/fhirService';

const FHIRResources = () => {
  const [resourceType, setResourceType] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateResource = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate JSON
      const data = JSON.parse(jsonData);
      
      // Add resourceType if not present
      if (!data.resourceType && resourceType) {
        data.resourceType = resourceType;
      }

      await fhirService.pushResource(data);
      setJsonData('');
      setResourceType('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing="md">
      <Group position="apart">
        <Text size="lg" weight={500}>FHIR Resources</Text>
      </Group>

      {error && (
        <Alert 
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mb="md"
          onClose={() => setError('')}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <Select
        label="Resource Type"
        placeholder="Select a resource type"
        value={resourceType}
        onChange={setResourceType}
        data={[
          { value: 'Patient', label: 'Patient' },
          { value: 'Practitioner', label: 'Practitioner' },
          { value: 'Organization', label: 'Organization' },
          { value: 'Observation', label: 'Observation' },
          { value: 'Condition', label: 'Condition' },
          { value: 'CarePlan', label: 'CarePlan' },
        ]}
      />

      <JsonInput
        label="Resource Data (JSON)"
        placeholder="Enter FHIR resource data"
        validationError="Invalid JSON"
        formatOnBlur
        autosize
        minRows={4}
        value={jsonData}
        onChange={setJsonData}
      />

      <Button 
        onClick={handleCreateResource}
        loading={loading}
        disabled={!resourceType || !jsonData}
      >
        Create Resource
      </Button>
    </Stack>
  );
};

export default FHIRResources; 