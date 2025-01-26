import React, { useState, useEffect } from 'react';
import { Container, Title, Group, Button, Text, Stack, Badge } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import { ResourceSection } from './ResourceSection';
import { patientService } from '../../services/patientService';
import { IconArrowLeft } from '@tabler/icons-react';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await patientService.getPatientById(id);
        setPatient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <Container size="xl">
      <Group position="apart" mb="xl">
        <Button 
          leftIcon={<IconArrowLeft size={16} />}
          variant="subtle"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Title order={2}>
          {`${patient.name[0].given.join(' ')} ${patient.name[0].family}`}
        </Title>
      </Group>

      <ResourceSection title="Demographics">
        <Stack spacing="xs">
          <Group>
            <Text weight={500}>Gender:</Text>
            <Text>{patient.gender}</Text>
          </Group>
          <Group>
            <Text weight={500}>DOB:</Text>
            <Text>{new Date(patient.birthDate).toLocaleDateString()}</Text>
          </Group>
          {patient.identifier?.map((id, index) => (
            <Group key={index}>
              <Text weight={500}>{id.system}:</Text>
              <Text>{id.value}</Text>
            </Group>
          ))}
        </Stack>
      </ResourceSection>

      <ResourceSection title="Conditions" onAdd={() => console.log('Add condition')}>
        {patient.conditions?.length > 0 ? (
          <Stack spacing="xs">
            {patient.conditions.map((condition, index) => (
              <Group key={index} position="apart">
                <Text>{condition.resource.code?.text}</Text>
                <Badge>{condition.resource.clinicalStatus?.coding?.[0]?.code}</Badge>
              </Group>
            ))}
          </Stack>
        ) : (
          <Text color="dimmed">No conditions recorded</Text>
        )}
      </ResourceSection>

      <ResourceSection title="Recent Observations" onAdd={() => console.log('Add observation')}>
        {patient.observations?.length > 0 ? (
          <Stack spacing="xs">
            {patient.observations.map((obs, index) => (
              <Group key={index} position="apart">
                <Text>{obs.resource.code?.text}</Text>
                <Text>{obs.resource.valueQuantity?.value} {obs.resource.valueQuantity?.unit}</Text>
              </Group>
            ))}
          </Stack>
        ) : (
          <Text color="dimmed">No recent observations</Text>
        )}
      </ResourceSection>

      <ResourceSection title="Medications" onAdd={() => console.log('Add medication')}>
        {patient.medications?.length > 0 ? (
          <Stack spacing="xs">
            {patient.medications.map((med, index) => (
              <Group key={index} position="apart">
                <Text>{med.resource.medicationCodeableConcept?.text}</Text>
                <Badge>{med.resource.status}</Badge>
              </Group>
            ))}
          </Stack>
        ) : (
          <Text color="dimmed">No medications prescribed</Text>
        )}
      </ResourceSection>
    </Container>
  );
} 