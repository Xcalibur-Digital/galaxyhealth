import React from 'react';
import { Container, Title, Tabs, Paper } from '@mantine/core';
import { IconUsers, IconDatabase, IconSettings } from '@tabler/icons-react';
import UserManagement from './UserManagement';
import FHIRResources from './FHIRResources';
import SystemConfig from './SystemConfig';

const AdminDashboard = () => {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Admin Dashboard</Title>
      
      <Paper p="md">
        <Tabs defaultValue="users">
          <Tabs.List>
            <Tabs.Tab value="users" icon={<IconUsers size={14} />}>
              Users
            </Tabs.Tab>
            <Tabs.Tab value="fhir" icon={<IconDatabase size={14} />}>
              FHIR Resources
            </Tabs.Tab>
            <Tabs.Tab value="config" icon={<IconSettings size={14} />}>
              System Config
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="users" pt="xl">
            <UserManagement />
          </Tabs.Panel>

          <Tabs.Panel value="fhir" pt="xl">
            <FHIRResources />
          </Tabs.Panel>

          <Tabs.Panel value="config" pt="xl">
            <SystemConfig />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 