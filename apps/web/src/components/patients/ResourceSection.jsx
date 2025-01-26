import React from 'react';
import { Paper, Title, Text, Group, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export function ResourceSection({ title, children, onAdd, loading, error }) {
  return (
    <Paper shadow="sm" p="md" mb="md">
      <Group position="apart" mb="md">
        <Title order={3}>{title}</Title>
        {onAdd && (
          <Button 
            leftIcon={<IconPlus size={16} />} 
            size="sm"
            onClick={onAdd}
          >
            Add
          </Button>
        )}
      </Group>

      {loading && <Text>Loading...</Text>}
      {error && <Text color="red">{error}</Text>}
      {!loading && !error && children}
    </Paper>
  );
} 