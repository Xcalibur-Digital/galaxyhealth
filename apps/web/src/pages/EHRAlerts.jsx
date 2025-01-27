import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Paper, 
  Text, 
  Group, 
  Stack, 
  Badge, 
  Select,
  Tabs,
  Card,
  List,
  ThemeIcon,
  Button,
  Divider
} from '@mantine/core';
import { 
  IconDatabase, 
  IconAlertCircle, 
  IconStethoscope,
  IconChecks,
  IconCalendarStats,
  IconReportMedical,
  IconArrowRight
} from '@tabler/icons-react';

const ehrSystems = [
  { value: 'epic', label: 'Epic' },
  { value: 'cerner', label: 'Cerner' },
  { value: 'athena', label: 'Athena Health' },
  { value: 'allscripts', label: 'Allscripts' }
];

const PatientAlert = ({ patient, hccGaps, qualityGaps }) => (
  <Card shadow="sm" p="md" radius="md" withBorder mb="md">
    <Stack spacing="xs">
      <Group position="apart">
        <Group>
          <Title order={4}>{patient.name}</Title>
          <Text size="sm" color="dimmed">DOB: {patient.dob}</Text>
        </Group>
        <Badge 
          color={patient.riskLevel === 'high' ? 'red' : 'yellow'}
          variant="light"
        >
          {patient.riskLevel.toUpperCase()} Risk
        </Badge>
      </Group>

      <Divider my="xs" />

      <Text weight={500} size="sm">HCC Opportunities:</Text>
      <List spacing="xs" size="sm">
        {hccGaps.map((gap, index) => (
          <List.Item 
            key={index}
            icon={
              <ThemeIcon color="blue" size={20} radius="xl">
                <IconReportMedical size={12} />
              </ThemeIcon>
            }
          >
            <Group position="apart">
              <Text>{gap.condition}</Text>
              <Badge color="blue" variant="light">RAF: {gap.rafValue}</Badge>
            </Group>
            <Text size="xs" color="dimmed">{gap.lastDocumented}</Text>
          </List.Item>
        ))}
      </List>

      <Text weight={500} size="sm" mt="sm">Quality Gaps:</Text>
      <List spacing="xs" size="sm">
        {qualityGaps.map((gap, index) => (
          <List.Item 
            key={index}
            icon={
              <ThemeIcon color="violet" size={20} radius="xl">
                <IconChecks size={12} />
              </ThemeIcon>
            }
          >
            <Group position="apart">
              <Text>{gap.measure}</Text>
              <Badge color="violet" variant="light">{gap.type}</Badge>
            </Group>
            <Text size="xs" color="dimmed">Due by: {gap.dueDate}</Text>
          </List.Item>
        ))}
      </List>

      <Divider my="xs" />

      <Group position="apart">
        <Text size="sm" color="dimmed">
          Next Visit: {patient.nextVisit}
        </Text>
        <Button 
          variant="light"
          size="xs"
          rightIcon={<IconArrowRight size={16} />}
        >
          View Patient Details
        </Button>
      </Group>
    </Stack>
  </Card>
);

const EHRAlerts = () => {
  const [selectedEHR, setSelectedEHR] = useState('epic');
  const [activeTab, setActiveTab] = useState('active');

  const activePatients = [
    {
      name: "John Smith",
      dob: "05/15/1955",
      riskLevel: "high",
      nextVisit: "Today @ 2:30 PM",
      hccGaps: [
        {
          condition: "Diabetes with Complications",
          rafValue: "0.307",
          lastDocumented: "Last documented 12 months ago"
        },
        {
          condition: "Chronic Heart Failure",
          rafValue: "0.368",
          lastDocumented: "Suspected based on medications"
        }
      ],
      qualityGaps: [
        {
          measure: "Diabetes Eye Exam",
          type: "HEDIS",
          dueDate: "12/31/2023"
        },
        {
          measure: "Annual Wellness Visit",
          type: "Medicare",
          dueDate: "03/15/2024"
        }
      ]
    },
    {
      name: "Mary Johnson",
      dob: "08/22/1948",
      riskLevel: "high",
      nextVisit: "Today @ 3:45 PM",
      hccGaps: [
        {
          condition: "COPD",
          rafValue: "0.325",
          lastDocumented: "Needs annual assessment"
        }
      ],
      qualityGaps: [
        {
          measure: "Colorectal Cancer Screening",
          type: "HEDIS",
          dueDate: "12/31/2023"
        },
        {
          measure: "Fall Risk Assessment",
          type: "Medicare",
          dueDate: "12/31/2023"
        }
      ]
    }
  ];

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Group position="apart">
          <Group>
            <ThemeIcon size="xl" radius="md" color="blue">
              <IconDatabase size={24} />
            </ThemeIcon>
            <Title order={2}>EHR Integration Alerts</Title>
          </Group>
          <Select
            value={selectedEHR}
            onChange={setSelectedEHR}
            data={ehrSystems}
            style={{ width: 200 }}
          />
        </Group>

        <Paper p="md" withBorder>
          <Group mb="md">
            <IconAlertCircle size={20} />
            <Text>
              Showing alerts for patients currently open in {
                ehrSystems.find(ehr => ehr.value === selectedEHR)?.label
              }
            </Text>
          </Group>

          <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab 
                value="active" 
                icon={<IconStethoscope size={14} />}
              >
                Active Patients
              </Tabs.Tab>
              <Tabs.Tab 
                value="upcoming" 
                icon={<IconCalendarStats size={14} />}
              >
                Upcoming Visits
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="active" pt="md">
              {activePatients.map((patient, index) => (
                <PatientAlert 
                  key={index}
                  patient={patient}
                  hccGaps={patient.hccGaps}
                  qualityGaps={patient.qualityGaps}
                />
              ))}
            </Tabs.Panel>

            <Tabs.Panel value="upcoming" pt="md">
              <Text color="dimmed">No upcoming visits today</Text>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
};

export default EHRAlerts; 