import React, { useState } from 'react';
import { 
  TextInput, Button, Paper, Stack, Text, Avatar, Group, 
  Loader, Badge, ActionIcon, Menu, Divider 
} from '@mantine/core';
import { 
  IconSearch, IconUser, IconHistory, IconTrash, 
  IconClock, IconArrowRight 
} from '@tabler/icons-react';
import { fhirService } from '../services/fhirService';
import { useSearchHistory } from '../hooks/useSearchHistory';
import './PatientSearch.css';
import axios from 'axios';
import { auth } from '../config/firebase';

const PatientSearch = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const results = await fhirService.searchPatients(searchTerm);
      setPatients(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    addToHistory(searchTerm, patient);
    onPatientSelect(patient);
    setPatients([]); // Clear results after selection
    setSearchTerm('');
  };

  const handleHistoryItemClick = (historyItem) => {
    setSearchTerm(historyItem.term);
    handleSearch({ preventDefault: () => {} });
  };

  const handleBulkLoad = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/fhir/test/bulk-load`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
          }
        }
      );
      console.log('Bulk load results:', response.data);
      // Optionally show a success message
    } catch (error) {
      console.error('Bulk load error:', error);
      // Handle error
    }
  };

  return (
    <div className="patient-search">
      <Paper shadow="sm" p="md" radius="md" className="search-container">
        <Text size="sm" color="dimmed" mb="md">
          Search by name, medical record number, or contact information
        </Text>
        <form onSubmit={handleSearch}>
          <Group spacing="sm">
            <TextInput
              placeholder="Enter name, MRN, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<IconSearch size={16} />}
              className="search-input"
              error={error}
              disabled={loading}
            />
            {searchHistory.length > 0 && (
              <Menu shadow="md" width={300}>
                <Menu.Target>
                  <ActionIcon 
                    variant="light" 
                    color="blue"
                    disabled={loading}
                  >
                    <IconHistory size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Recent Searches</Menu.Label>
                  {searchHistory.map((item, index) => (
                    <React.Fragment key={index}>
                      <Menu.Item
                        icon={<IconClock size={14} />}
                        onClick={() => handleHistoryItemClick(item)}
                      >
                        <Group position="apart" spacing="xl">
                          <div>
                            <Text size="sm">{item.term}</Text>
                            <Text size="xs" color="dimmed">
                              {item.patientInfo.name} • {item.patientInfo.birthDate}
                            </Text>
                          </div>
                          <IconArrowRight size={14} />
                        </Group>
                      </Menu.Item>
                      {index < searchHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  <Menu.Divider />
                  <Menu.Item 
                    color="red" 
                    icon={<IconTrash size={14} />}
                    onClick={clearHistory}
                  >
                    Clear History
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
            <Button type="submit" loading={loading}>
              Search
            </Button>
          </Group>
        </form>

        <Button 
          variant="filled"
          color="blue"
          onClick={handleBulkLoad}
          mb="md"
        >
          Load Test Patients
        </Button>

        {loading && (
          <div className="search-loading">
            <Loader size="sm" />
            <Text size="sm">Searching patients...</Text>
          </div>
        )}

        {patients.length > 0 && (
          <Stack spacing="xs" mt="md" className="results-container">
            {patients.map((patient) => (
              <Paper
                key={patient.id}
                p="sm"
                className="patient-result"
                onClick={() => handlePatientClick(patient)}
              >
                <Group>
                  <Avatar 
                    radius="xl"
                    color="blue"
                  >
                    <IconUser size={24} />
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Group position="apart">
                      <div>
                        <Text weight={500}>
                          {patient.name}
                        </Text>
                        <Group spacing="xs">
                          {patient.identifiers.map((id, idx) => (
                            <Badge key={idx} size="sm">
                              {id.type}: {id.value}
                            </Badge>
                          ))}
                        </Group>
                      </div>
                      <Badge color={patient.gender === 'male' ? 'blue' : 'pink'}>
                        {patient.gender}
                      </Badge>
                    </Group>
                    <Group spacing="xs" mt="xs">
                      <Text size="sm" color="dimmed">DOB: {patient.birthDate}</Text>
                      {patient.contact.map((c, idx) => (
                        <Text key={idx} size="sm" color="dimmed">
                          • {c.system}: {c.value}
                        </Text>
                      ))}
                    </Group>
                  </div>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}

        {!loading && patients.length === 0 && searchTerm && (
          <Text color="dimmed" size="sm" mt="md" align="center">
            No patients found. Try a different search term.
          </Text>
        )}
      </Paper>
    </div>
  );
};

export default PatientSearch; 