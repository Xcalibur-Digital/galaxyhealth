import React from 'react';
import { Paper, Text, Group, ThemeIcon, Stack, Box } from '@mantine/core';
import { motion } from 'framer-motion';

const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  color = 'blue',
  trend,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <Paper
        p="xl"
        radius="md"
        shadow="sm"
        onClick={onClick}
        style={{
          cursor: onClick ? 'pointer' : 'default',
          backgroundColor: 'var(--mantine-color-body)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack justify="space-between" h="100%">
          <Group position="apart" mb="md">
            <ThemeIcon 
              size={48} 
              radius="md"
              variant="light"
              color={color}
            >
              <Icon size={24} />
            </ThemeIcon>
            {trend && (
              <Group spacing="xs">
                {React.cloneElement(trend.icon, { width: 16, height: 16 })}
                <Text 
                  size="sm" 
                  color={trend.color}
                  weight={500}
                >
                  {trend.value}
                </Text>
              </Group>
            )}
          </Group>

          <div>
            <Text 
              size="xl" 
              weight={700}
              sx={(theme) => ({
                fontSize: '2rem',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: theme.colorScheme === 'dark' ? 
                  theme.white : theme.colors.dark[8]
              })}
            >
              {value}
            </Text>
            <Text 
              size="sm" 
              weight={500}
              mt="xs"
              color="dimmed"
            >
              {title}
            </Text>
          </div>

          <Box mt="auto">
            {description && (
              <Text size="sm" color="dimmed">
                {description}
              </Text>
            )}
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};

export default MetricCard; 