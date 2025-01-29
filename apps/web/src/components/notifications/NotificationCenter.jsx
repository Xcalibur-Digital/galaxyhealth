import React from 'react';
import { Popover, ActionIcon, Badge, Stack, Text, Button, Group, Box } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../stores/notificationStore';

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, clearNotifications, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.patientId) {
      navigate(`/patients/${notification.patientId}`);
    }
  };

  return (
    <Popover width={400} position="bottom-end">
      <Popover.Target>
        <div style={{ position: 'relative' }}>
          <ActionIcon size="lg">
            <IconBell size={20} />
          </ActionIcon>
          {unreadCount > 0 && (
            <Badge 
              size="sm" 
              variant="filled" 
              style={{ 
                position: 'absolute', 
                top: -5, 
                right: -5 
              }}
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack spacing="md">
          <Group position="apart">
            <Text weight={500} size="lg">Notifications</Text>
            {notifications.length > 0 && (
              <Button 
                variant="subtle" 
                size="xs"
                onClick={() => clearNotifications()}
              >
                Clear All
              </Button>
            )}
          </Group>

          <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
            <Stack spacing="md">
              {notifications.length === 0 ? (
                <Text color="dimmed" size="sm" align="center" py="md">
                  No notifications
                </Text>
              ) : (
                notifications.map((notification) => (
                  <Button
                    key={notification.id}
                    variant={notification.read ? 'subtle' : 'light'}
                    color={notification.read ? 'gray' : 'blue'}
                    fullWidth
                    onClick={() => handleNotificationClick(notification)}
                    styles={{
                      root: {
                        padding: '16px',
                        height: 'auto',
                        textAlign: 'left'
                      },
                      inner: {
                        justifyContent: 'flex-start'
                      }
                    }}
                  >
                    <Stack spacing="xs" align="flex-start">
                      <Text size="sm" weight={500} lineClamp={2}>
                        {notification.title}
                      </Text>
                      <Text size="xs" color="dimmed" lineClamp={2}>
                        {notification.message}
                      </Text>
                      <Text size="xs" color="dimmed">
                        {new Date(notification.timestamp).toLocaleString()}
                      </Text>
                    </Stack>
                  </Button>
                ))
              )}
            </Stack>
          </Box>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}; 