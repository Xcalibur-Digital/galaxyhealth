import React from 'react';
import { Paper, Text, Group } from '@mantine/core';
import LoadingSpinner from './LoadingSpinner';

const ResourceList = ({ 
  title,
  items,
  loading,
  error,
  renderItem,
  emptyMessage = 'No items found',
  className
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <Text color="red">{error}</Text>;
  
  return (
    <Paper shadow="sm" p="md" className={className}>
      {title && (
        <Group position="apart" mb="md">
          <Text size="xl" weight={500}>{title}</Text>
        </Group>
      )}
      
      {items?.length ? (
        <div className="resource-list">
          {items.map((item, index) => (
            <div key={index} className="resource-item">
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <Text color="dimmed" align="center">{emptyMessage}</Text>
      )}
    </Paper>
  );
};

export default ResourceList; 