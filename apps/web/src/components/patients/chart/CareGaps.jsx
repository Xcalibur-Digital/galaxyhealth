import React, { useState } from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Group, 
  Stack, 
  Badge, 
  Button, 
  ActionIcon,
  FileButton,
  Progress,
  Modal,
  TextInput,
  Textarea,
  Divider
} from '@mantine/core';
import { 
  IconAlertCircle, 
  IconUpload, 
  IconPaperclip, 
  IconX,
  IconDownload,
  IconEye
} from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';

const CareGaps = ({ patient }) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedGap, setSelectedGap] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [note, setNote] = useState('');

  const careGaps = [
    {
      id: 1,
      title: 'Annual Wellness Visit',
      priority: 'high',
      dueDate: '2024-03-15',
      status: 'overdue',
      description: 'Patient has not completed annual wellness visit for 2024',
      attachments: [
        { name: 'Previous_Visit_Summary.pdf', date: '2023-03-10' }
      ]
    },
    {
      id: 2,
      title: 'Diabetes A1C Test',
      priority: 'medium',
      dueDate: '2024-02-28',
      status: 'pending',
      description: 'Regular A1C monitoring required',
      attachments: [
        { name: 'Lab_Results_2023.pdf', date: '2023-12-15' },
        { name: 'Care_Plan.pdf', date: '2024-01-10' }
      ]
    }
  ];

  const handleFileUpload = (files) => {
    // Simulate file upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Add the file to attachments
        const newAttachment = {
          name: files[0].name,
          date: new Date().toISOString().split('T')[0]
        };
        // Update care gap attachments
        setTimeout(() => {
          setUploadProgress(0);
          setUploadModalOpen(false);
          setNote('');
        }, 500);
      }
    }, 200);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <>
      <Paper p="md" radius="md">
        <Group position="apart" mb="md">
          <Title order={3}>Care Gaps</Title>
          <Badge size="lg">{careGaps.length} Open</Badge>
        </Group>

        <Stack spacing="md">
          {careGaps.map((gap) => (
            <Paper key={gap.id} p="md" radius="md" withBorder>
              <Group position="apart" mb="xs">
                <Group>
                  <ThemeIcon 
                    color={getPriorityColor(gap.priority)} 
                    variant="light"
                    size="lg"
                  >
                    <IconAlertCircle size={20} />
                  </ThemeIcon>
                  <div>
                    <Text weight={500}>{gap.title}</Text>
                    <Text size="sm" color="dimmed">Due: {gap.dueDate}</Text>
                  </div>
                </Group>
                <Badge color={getPriorityColor(gap.priority)}>
                  {gap.priority.toUpperCase()}
                </Badge>
              </Group>

              <Text size="sm" mb="md">{gap.description}</Text>

              <Group position="apart">
                <Group spacing="xs">
                  {gap.attachments.map((file, index) => (
                    <Button
                      key={index}
                      variant="light"
                      size="xs"
                      leftIcon={<IconPaperclip size={14} />}
                      rightIcon={<IconDownload size={14} />}
                    >
                      {file.name}
                    </Button>
                  ))}
                </Group>
                <Button
                  size="xs"
                  leftIcon={<IconUpload size={14} />}
                  onClick={() => {
                    setSelectedGap(gap);
                    setUploadModalOpen(true);
                  }}
                >
                  Upload
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Paper>

      <Modal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Documentation"
        size="lg"
      >
        <Stack spacing="md">
          <Text weight={500}>
            Uploading for: {selectedGap?.title}
          </Text>
          
          <Dropzone
            onDrop={handleFileUpload}
            maxSize={5 * 1024 ** 2} // 5MB
            accept={['application/pdf', 'image/*']}
          >
            <Group position="center" spacing="xl" style={{ minHeight: 120, pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload size={50} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconUpload size={50} stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag files here or click to select
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  Files should not exceed 5MB
                </Text>
              </div>
            </Group>
          </Dropzone>

          {uploadProgress > 0 && (
            <Progress 
              value={uploadProgress} 
              label={`${uploadProgress}%`} 
              size="xl" 
              radius="xl"
            />
          )}

          <Divider />

          <Textarea
            label="Additional Notes"
            placeholder="Add any relevant notes about this documentation"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
            minRows={3}
          />

          <Group position="right">
            <Button variant="default" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button>
              Upload
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default CareGaps; 