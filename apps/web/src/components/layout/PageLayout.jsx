import React from 'react';
import { Container, Title, Paper, Group, Text } from '@mantine/core';

export const PageLayout = ({ 
  title, 
  subtitle, 
  actions, 
  children 
}) => {
  return (
    <Container size="xl" py="xl">
      <Group position="apart" mb="xl">
        <div>
          <Title order={1} mb={subtitle ? 'xs' : 0}>
            {title}
          </Title>
          {subtitle && (
            <Text color="dimmed" size="sm">
              {subtitle}
            </Text>
          )}
        </div>
        {actions && (
          <Group>
            {actions}
          </Group>
        )}
      </Group>

      <Paper p="xl" radius="lg" withBorder>
        {children}
      </Paper>
    </Container>
  );
}; 