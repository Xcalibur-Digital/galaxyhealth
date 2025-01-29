import React from 'react';
import { 
  Container, 
  Title, 
  Table, 
  Text, 
  Badge, 
  Group,
  ActionIcon,
  Menu,
  Paper,
  Button
} from '@mantine/core';
import { 
  IconDotsVertical, 
  IconBrowser, 
  IconDeviceDesktop,
  IconTrash,
  IconExternalLink 
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../stores/notificationStore';

const PatientContextHistory = () => {
  const navigate = useNavigate();
  const { notifications, clearNotifications } = useNotificationStore();
  
  console.log('Current notifications:', notifications); // Debug log

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getSourceIcon = (source) => {
    if (source === 'browser') {
      return <IconBrowser size={16} />;
    }
    return <IconDeviceDesktop size={16} />;
  };

  const getSourceBadge = (notification) => {
    const { source = 'browser', appName } = notification;
    return (
      <Badge 
        leftSection={getSourceIcon(source)}
        color={source === 'browser' ? 'blue' : 'green'}
      >
        {appName || 'Web Browser'}
      </Badge>
    );
  };

  // Add debug button for development
  const addTestNotification = () => {
    const testNotification = {
      type: 'PATIENT_CONTEXT',
      title: 'Test Patient Context',
      message: 'Test patient detected',
      patientId: 'test-123',
      patientInfo: {
        name: 'John Doe',
        mrn: 'MRN123',
        id: 'test-123'
      },
      source: 'browser',
      appName: 'Test Browser'
    };
    useNotificationStore.getState().addNotification(testNotification);
  };

  return (
    <Container size="xl" py="xl">
      <Paper p="md" radius="md">
        <Group position="apart" mb="xl">
          <Title order={2}>Patient Context History</Title>
          <Group>
            {process.env.NODE_ENV === 'development' && (
              <Button onClick={addTestNotification} size="sm">
                Add Test Notification
              </Button>
            )}
            <Badge size="lg">
              {notifications.length} Matches
            </Badge>
          </Group>
        </Group>

        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>MRN</th>
              <th>Source</th>
              <th>Detected At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td>
                  <Text weight={500}>
                    {notification.patientInfo.name}
                  </Text>
                </td>
                <td>
                  <Text color="dimmed">
                    {notification.patientInfo.mrn || 'N/A'}
                  </Text>
                </td>
                <td>
                  {getSourceBadge(notification)}
                </td>
                <td>
                  <Text size="sm" color="dimmed">
                    {formatDate(notification.timestamp)}
                  </Text>
                </td>
                <td>
                  <Menu position="bottom-end">
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item 
                        icon={<IconExternalLink size={16} />}
                        onClick={() => navigate(`/patients/${notification.patientId}`)}
                      >
                        View Patient
                      </Menu.Item>
                      <Menu.Item 
                        icon={<IconTrash size={16} />}
                        color="red"
                        onClick={() => clearNotifications()}
                      >
                        Clear History
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <Text align="center" color="dimmed" py="xl">
                    No patient context history found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Paper>
    </Container>
  );
};

export default PatientContextHistory; 