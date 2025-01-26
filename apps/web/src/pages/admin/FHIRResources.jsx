import React from 'react';
import { Stack, Button, Group, Text, Select } from '@mantine/core';

const FHIRResources = () => {
  return (
    <div>
      <Group position="apart" mb="md">
        <Text size="lg" weight={500}>FHIR Resources</Text>
        <Button>Create Resource</Button>
      </Group>
      <Stack spacing="md">
        <Select
          label="Resource Type"
          placeholder="Select a resource type"
          data={[
            { value: 'Patient', label: 'Patient' },
            { value: 'Practitioner', label: 'Practitioner' },
            { value: 'Organization', label: 'Organization' },
          ]}
        />
      </Stack>
    </div>
  );
};

export default FHIRResources; 