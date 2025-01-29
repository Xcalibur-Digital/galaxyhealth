import React from 'react';
import { 
  Grid, 
  Paper, 
  Title, 
  Text, 
  Group, 
  Badge, 
  Stack,
  Tabs,
  Progress,
  ThemeIcon,
  ActionIcon,
  Menu,
  Tooltip
} from '@mantine/core';
import {
  IconHeartbeat,
  IconStethoscope,
  IconReportMedical,
  IconAlertCircle,
  IconCalendarStats,
  IconChartLine,
  IconDotsVertical,
  IconPrinter,
  IconDownload,
  IconShare
} from '@tabler/icons-react';
import RiskScoreCard from './chart/RiskScoreCard';
import QualityMetrics from './chart/QualityMetrics';
import CareGaps from './chart/CareGaps';
import UtilizationMetrics from './chart/UtilizationMetrics';
import ClinicalTimeline from './chart/ClinicalTimeline';
import CostAnalysis from './chart/CostAnalysis';

const PatientChart = ({ patient }) => {
  return (
    <div>
      {/* Header Section */}
      <Paper p="md" mb="md" radius="md">
        <Group position="apart" mb="xs">
          <Group>
            <Title order={2}>
              {patient.name[0].given.join(' ')} {patient.name[0].family}
            </Title>
            <Badge size="lg" color={patient.active ? 'green' : 'gray'}>
              {patient.active ? 'Active' : 'Inactive'}
            </Badge>
          </Group>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconPrinter size={14} />}>Print Chart</Menu.Item>
              <Menu.Item icon={<IconDownload size={14} />}>Export Data</Menu.Item>
              <Menu.Item icon={<IconShare size={14} />}>Share</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Grid>
          <Grid.Col span={4}>
            <Stack spacing="xs">
              <Text size="sm" color="dimmed">MRN</Text>
              <Text>{patient.identifier?.[0]?.value || 'N/A'}</Text>
              <Text size="sm" color="dimmed">DOB</Text>
              <Text>{patient.birthDate || 'N/A'}</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={4}>
            <Stack spacing="xs">
              <Text size="sm" color="dimmed">Primary Care</Text>
              <Text>{patient.generalPractitioner?.[0]?.display || 'Unassigned'}</Text>
              <Text size="sm" color="dimmed">Insurance</Text>
              <Text>{patient.insurance?.[0]?.coverage?.display || 'Unknown'}</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={4}>
            <Stack spacing="xs">
              <Text size="sm" color="dimmed">Risk Score</Text>
              <Group spacing="xs">
                <ThemeIcon 
                  color="red" 
                  variant="light"
                  size="lg"
                  radius="xl"
                >
                  <IconAlertCircle size={20} />
                </ThemeIcon>
                <Text size="xl" weight={700}>8.4</Text>
                <Text size="sm" color="dimmed">High Risk</Text>
              </Group>
              <Progress 
                value={84} 
                color="red" 
                size="sm" 
                radius="xl"
              />
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <Tabs.List mb="md">
          <Tabs.Tab 
            value="overview" 
            icon={<IconHeartbeat size={14} />}
          >
            Overview
          </Tabs.Tab>
          <Tabs.Tab 
            value="quality" 
            icon={<IconChartLine size={14} />}
          >
            Quality & Gaps
          </Tabs.Tab>
          <Tabs.Tab 
            value="utilization" 
            icon={<IconStethoscope size={14} />}
          >
            Utilization
          </Tabs.Tab>
          <Tabs.Tab 
            value="timeline" 
            icon={<IconCalendarStats size={14} />}
          >
            Timeline
          </Tabs.Tab>
          <Tabs.Tab 
            value="cost" 
            icon={<IconReportMedical size={14} />}
          >
            Cost Analysis
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Grid>
            <Grid.Col span={4}>
              <RiskScoreCard patient={patient} />
            </Grid.Col>
            <Grid.Col span={8}>
              <QualityMetrics patient={patient} />
            </Grid.Col>
            <Grid.Col span={12}>
              <CareGaps patient={patient} />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="quality">
          <QualityMetrics patient={patient} detailed />
        </Tabs.Panel>

        <Tabs.Panel value="utilization">
          <UtilizationMetrics patient={patient} />
        </Tabs.Panel>

        <Tabs.Panel value="timeline">
          <ClinicalTimeline patient={patient} />
        </Tabs.Panel>

        <Tabs.Panel value="cost">
          <CostAnalysis patient={patient} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default PatientChart; 