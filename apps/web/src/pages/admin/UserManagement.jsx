import React from 'react';
import { Table, Button, Group, Text } from '@mantine/core';

const UserManagement = () => {
  return (
    <div>
      <Group position="apart" mb="md">
        <Text size="lg" weight={500}>User Management</Text>
        <Button>Add User</Button>
      </Group>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* User list will go here */}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement; 