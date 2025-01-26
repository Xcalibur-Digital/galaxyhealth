import React from 'react';
import { Timeline, Text } from '@mantine/core';
import { formatDate } from '../../utils/formatters';

export function ResourceTimeline({ items, renderIcon, renderTitle, renderContent }) {
  return (
    <Timeline active={items.length - 1} bulletSize={24} lineWidth={2}>
      {items.map((item, index) => (
        <Timeline.Item
          key={index}
          bullet={renderIcon(item)}
          title={renderTitle(item)}
        >
          <Text color="dimmed" size="sm">
            {formatDate(item.date)}
          </Text>
          {renderContent(item)}
        </Timeline.Item>
      ))}
    </Timeline>
  );
} 