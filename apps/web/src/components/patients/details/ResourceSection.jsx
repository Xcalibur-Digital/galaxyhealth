import React from 'react';
import { Paper, Title, Text, Group, Badge } from '@mantine/core';

export function ResourceSection({ title, resources, renderItem }) {
  if (!resources?.length) {
    return (
      <Paper shadow="sm" p="md" mb="md">
        <Title order={3}>{title}</Title>
        <Text color="dimmed">No {title.toLowerCase()} found</Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="md" mb="md">
      <Title order={3} mb="md">{title}</Title>
      <div className="resource-list">
        {resources.map((resource, index) => (
          <div key={index} className="resource-item">
            {renderItem(resource)}
          </div>
        ))}
      </div>
    </Paper>
  );
} 