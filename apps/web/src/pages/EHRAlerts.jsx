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
  Divider,
  ActionIcon,
  Tooltip,
  Box,
  Collapse
} from '@mantine/core';
import { 
  IconDatabase, 
  IconAlertCircle, 
  IconStethoscope,
  IconChecks,
  IconX,
  IconCalendarStats,
  IconReportMedical,
  IconArrowRight,
  IconInfoCircle
} from '@tabler/icons-react';

const ehrSystems = [
  { value: 'epic', label: 'Epic' },
  { value: 'cerner', label: 'Cerner' },
  { value: 'athena', label: 'Athena Health' },
  { value: 'allscripts', label: 'Allscripts' }
];

const HCCOpportunity = ({ hcc, icdCode, description, rafValue, evidence = [] }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDenied, setIsDenied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Paper 
      p="md" 
      radius="md" 
      withBorder 
      mb="sm"
      sx={(theme) => ({
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      })}
    >
      <Box>
        <Group position="apart" noWrap align="flex-start">
          <Box>
            <Group spacing="xs">
              <Text weight={500}>{hcc}</Text>
              <Badge color="blue">RAF {rafValue}</Badge>
              <Tooltip label="View ICD details">
                <ActionIcon 
                  variant="subtle" 
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <IconInfoCircle size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size="sm" color="dimmed" mt={4}>
              {description}
            </Text>
          </Box>
          <Group spacing="xs">
            <Button
              size="xs"
              color="green"
              variant={isConfirmed ? "filled" : "light"}
              leftIcon={<IconChecks size={16} />}
              onClick={() => setIsConfirmed(!isConfirmed)}
              disabled={isDenied}
            >
              Confirm
            </Button>
            <Button
              size="xs"
              color="red"
              variant={isDenied ? "filled" : "light"}
              leftIcon={<IconX size={16} />}
              onClick={() => setIsDenied(!isDenied)}
              disabled={isConfirmed}
            >
              Deny
            </Button>
          </Group>
        </Group>

        {evidence.length > 0 && (
          <Box mt="md">
            <Text size="sm" weight={500} color="dimmed">Evidence:</Text>
            <List size="sm" spacing="xs" mt={4}>
              {evidence.map((item, index) => (
                <List.Item 
                  key={index}
                  icon={
                    <ThemeIcon color="blue" size={16} radius="xl">
                      <IconChecks size={12} />
                    </ThemeIcon>
                  }
                >
                  <Text size="sm">{item.source}</Text>
                  <Text size="xs" color="dimmed">{item.detail}</Text>
                </List.Item>
              ))}
            </List>
          </Box>
        )}
      </Box>

      <Collapse in={showDetails}>
        <Box mt="md" p="xs" bg="gray.0" sx={{ borderRadius: 4 }}>
          <Text size="sm" weight={500} color="dimmed">ICD-10 Codes:</Text>
          <Group spacing="xs" mt={4}>
            {icdCode.map((code, index) => (
              <Badge key={index} variant="outline">
                {code}
              </Badge>
            ))}
          </Group>
        </Box>
      </Collapse>
    </Paper>
  );
};

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
            <HCCOpportunity
              hcc={gap.hcc}
              icdCode={gap.icdCodes}
              description={gap.description}
              rafValue={gap.rafValue}
              evidence={gap.evidence}
            />
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
          hcc: "HCC 108 - COPD",
          icdCodes: ["J44.9", "J44.1"],
          description: "Chronic Obstructive Pulmonary Disease",
          rafValue: "0.325",
          evidence: [
            {
              source: "Spirometry Results (01/15/2024)",
              detail: "FEV1/FVC ratio < 0.70, consistent with COPD"
            },
            {
              source: "Current Medications",
              detail: "Active prescription for Symbicort and Spiriva"
            },
            {
              source: "Progress Notes (12/10/2023)",
              detail: "Patient reports chronic cough and dyspnea on exertion"
            }
          ]
        },
        {
          hcc: "HCC 18 - Diabetes with Chronic Complications",
          icdCodes: ["E11.22", "E11.51"],
          description: "Type 2 Diabetes with Multiple Complications",
          rafValue: "0.302",
          evidence: [
            {
              source: "Ophthalmology Consult (11/30/2023)",
              detail: "Mild diabetic retinopathy documented with fundus photos"
            },
            {
              source: "Lab Results (01/05/2024)",
              detail: "HbA1c: 8.2%, Microalbumin elevated"
            },
            {
              source: "Medication History",
              detail: "Multiple oral diabetes medications plus insulin"
            }
          ]
        }
      ],
      qualityGaps: [
        {
          measure: "Diabetes Eye Exam",
          type: "HEDIS",
          dueDate: "12/31/2024",
          evidence: "Last exam 11/30/2023 - Due annually"
        },
        {
          measure: "Annual Wellness Visit",
          type: "Medicare",
          dueDate: "03/15/2024",
          evidence: "Last AWV 03/15/2023"
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
          hcc: "HCC 85 - Congestive Heart Failure",
          icdCodes: ["I50.22", "I50.32"],
          description: "Systolic Heart Failure",
          rafValue: "0.368",
          evidence: [
            {
              source: "Echocardiogram (02/01/2024)",
              detail: "EF 35%, consistent with reduced ejection fraction"
            },
            {
              source: "Current Medications",
              detail: "Active prescriptions for Lasix and Lisinopril"
            },
            {
              source: "Recent ED Visit (01/15/2024)",
              detail: "Presented with dyspnea and peripheral edema"
            }
          ]
        }
      ],
      qualityGaps: [
        {
          measure: "Colorectal Cancer Screening",
          type: "HEDIS",
          dueDate: "12/31/2023",
          evidence: "Last colonoscopy > 10 years ago"
        },
        {
          measure: "Fall Risk Assessment",
          type: "Medicare",
          dueDate: "12/31/2023",
          evidence: "No documented assessment in past 12 months"
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
            data={[
              { value: 'epic', label: 'Epic' },
              { value: 'cerner', label: 'Cerner' },
              { value: 'athena', label: 'Athena Health' },
              { value: 'allscripts', label: 'Allscripts' }
            ]}
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