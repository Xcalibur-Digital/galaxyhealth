import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { 
  Container, 
  Title, 
  Paper, 
  Group, 
  Button, 
  Menu, 
  Text,
  Stack,
  Box,
  TextInput,
  ActionIcon,
  Badge,
  ScrollArea,
  Table,
  Center,
  Loader,
  Switch
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter,
  IconAdjustments,
  IconPlus,
  IconChevronUp,
  IconChevronDown,
  IconSelector
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import RiskLevelCell from './gridRenderers/RiskLevelCell';
import { usePatient } from '../../contexts/PatientContext';
import { useUser } from '../../contexts/UserContext';
import { gridViewService } from '../../services/gridViewService';
import { SAVED_VIEWS, getFilterModelForView } from '../../utils/gridViews';
import { motion } from 'framer-motion';
import { DataTable } from 'mantine-datatable';
import 'mantine-datatable/styles.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { searchFHIRPatients } from '../../utils/fhirService';

const containerStyles = (theme) => ({
  container: {
    padding: theme.spacing.md,
    '@media (max-width: theme.breakpoints.sm)': {
      padding: theme.spacing.sm
    }
  },
  searchBar: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    '@media (max-width: theme.breakpoints.sm)': {
      flexDirection: 'column'
    }
  }
});

const PatientList = () => {
  const { loading } = usePatient();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState({ field: null, direction: null });
  const [currentView, setCurrentView] = useState(SAVED_VIEWS.HIGH_RISK);
  const [savedViews, setSavedViews] = useState(
    Object.values(SAVED_VIEWS).map(view => ({
      id: view,
      label: view.replace(/_/g, ' ').toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase())
    }))
  );
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const [useFHIR, setUseFHIR] = useState(false);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Update records when patients change
  useEffect(() => {
    if (!loading && patients) {
      const mappedData = patients.map(patient => ({
        id: patient.id,
        name: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'N/A',
        dateOfBirth: patient.dob || patient.dateOfBirth || patient.birthDate || 'N/A',
        gender: patient.gender || 'N/A',
        riskLevel: patient.riskLevel || 'low',
        lastVisit: patient.lastVisit || 'N/A'
      }));
      setPatients(mappedData);
    }
  }, [patients, loading]);

  // Filter records based on search term
  const filteredRecords = patients.filter(record => 
    (record?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false) ||
    (record?.riskLevel?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false)
  );

  const columns = [
    {
      accessor: 'name',
      title: 'Patient Name',
      sortable: true,
      width: '25%',
    },
    {
      accessor: 'dateOfBirth',
      title: 'Date of Birth',
      sortable: true,
      render: ({ dateOfBirth }) => 
        dateOfBirth === 'N/A' ? 'N/A' : new Date(dateOfBirth).toLocaleDateString()
    },
    {
      accessor: 'gender',
      title: 'Gender',
      sortable: true,
      width: '15%',
    },
    {
      accessor: 'riskLevel',
      title: 'Risk Level',
      sortable: true,
      width: '20%',
      render: ({ riskLevel }) => <RiskLevelCell value={riskLevel} />
    },
    {
      accessor: 'lastVisit',
      title: 'Last Visit',
      sortable: true,
      render: ({ lastVisit }) => 
        lastVisit === 'N/A' ? 'N/A' : new Date(lastVisit).toLocaleDateString()
    }
  ];

  // Load view data
  const loadView = useCallback(async (viewId) => {
    try {
      const defaultView = Object.values(SAVED_VIEWS).find(v => v === viewId);
      let viewData;
      
      if (defaultView) {
        viewData = getFilterModelForView(viewId);
      } else {
        const userViews = await gridViewService.getViews(user.uid);
        viewData = userViews.find(v => v.id === viewId);
      }

      if (viewData && gridRef.current) {
        gridRef.current.api.setFilterModel(viewData.filterModel);
        gridRef.current.columnApi.applyColumnState({
          state: viewData.columnState,
          applyOrder: true
        });
        gridRef.current.api.setSortModel(viewData.sortModel);
      }
    } catch (error) {
      console.error('Error loading view:', error);
    }
  }, [user?.uid]);

  // Handle view changes
  const handleViewChange = useCallback((viewId) => {
    setCurrentView(viewId);
    loadView(viewId);
  }, [loadView]);

  // Load saved views
  useEffect(() => {
    const loadSavedViews = async () => {
      if (!user) return;
      
      try {
        const userViews = await gridViewService.getViews(user.uid);
        setSavedViews(prev => [
          ...prev,
          ...userViews.map(view => ({
            id: view.id,
            label: view.label || view.id
          }))
        ]);
      } catch (error) {
        console.error('Error loading saved views:', error);
      }
    };

    loadSavedViews();
  }, [user]);

  const fetchFirestorePatients = async () => {
    try {
      setLoading(true);
      const patientsRef = collection(db, 'patients');
      const snapshot = await getDocs(patientsRef);
      const patientData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientData);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      if (useFHIR) {
        const fhirPatients = await searchFHIRPatients();
        setPatients(fhirPatients);
      } else {
        await fetchFirestorePatients();
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [useFHIR]);

  return (
    <Container size="xl" py="xl">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <Box pb="xl">
          <motion.div variants={itemVariants}>
            <Group position="apart" mb="lg">
              <Stack spacing={4}>
                <Title 
                  order={1}
                  sx={(theme) => ({
                    color: theme.colorScheme === 'dark' ? 
                      theme.white : theme.colors.dark[8]
                  })}
                >
                  Patient Panel
                </Title>
                <Text color="dimmed">
                  Manage and monitor your patient population
                </Text>
              </Stack>
              <Group>
                <TextInput
                  placeholder="Search patients..."
                  icon={<IconSearch size={16} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ minWidth: 280 }}
                />
                <Menu>
                  <Menu.Target>
                    <Button 
                      variant="light" 
                      leftIcon={<IconPlus size={16} />}
                    >
                      Add Patient
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item 
                      onClick={() => navigate('/patients/new')}
                    >
                      Add Patient
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper p="md" radius="md" withBorder>
              <Group position="apart" mb="md">
                <Title order={2}>Patients</Title>
                <Group>
                  <Switch
                    label="Use FHIR Data"
                    checked={useFHIR}
                    onChange={(event) => setUseFHIR(event.currentTarget.checked)}
                  />
                  {!useFHIR && (
                    <Button onClick={fetchPatients} color="blue">
                      Refresh
                    </Button>
                  )}
                </Group>
              </Group>

              <DataTable
                striped
                highlightOnHover
                records={filteredRecords}
                columns={[
                  { 
                    accessor: 'name',
                    title: 'Name',
                    render: (patient) => `${patient.firstName} ${patient.lastName}`
                  },
                  { accessor: 'dateOfBirth', title: 'Date of Birth' },
                  { accessor: 'gender', title: 'Gender' },
                  { 
                    accessor: 'contact',
                    title: 'Contact',
                    render: (patient) => patient.phone || patient.email
                  },
                  { 
                    accessor: 'lastVisit',
                    title: 'Last Visit',
                    render: (patient) => patient.lastVisit || 'N/A'
                  }
                ]}
                totalRecords={patients.length}
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={setPage}
                fetching={isLoading}
                noRecordsText="No patients found"
                loadingText="Loading patients..."
                sx={(theme) => ({
                  border: `1px solid ${
                    theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                  }`,
                  borderRadius: theme.radius.sm,
                  '& th': {
                    borderRight: `1px solid ${
                      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                    }`
                  },
                  '& td': {
                    borderRight: `1px solid ${
                      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                    }`
                  }
                })}
              />

              {error && (
                <Text color="red" mt="md" align="center">
                  Error: {error}
                </Text>
              )}
            </Paper>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default PatientList;

// Helper function to calculate age
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Update the RiskLevelRenderer component
const RiskLevelRenderer = ({ value }) => {
  const getStyle = () => {
    switch(value?.toLowerCase()) {
      case 'high':
        return {
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: '1px solid #fa5252'
        };
      case 'medium':
        return {
          backgroundColor: '#ffd43b',
          color: '#212529',
          border: '1px solid #fab005'
        };
      case 'low':
        return {
          backgroundColor: '#51cf66',
          color: 'white',
          border: '1px solid #40c057'
        };
      default:
        return {
          backgroundColor: '#868e96',
          color: 'white',
          border: '1px solid #495057'
        };
    }
  };

  return value ? (
    <Box
      sx={(theme) => ({
        ...getStyle(),
        padding: '4px 12px',
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        display: 'inline-block',
        textTransform: 'capitalize'
      })}
    >
      {value}
    </Box>
  ) : null;
};

// Animation variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}; 