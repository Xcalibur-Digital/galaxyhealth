import React, { useState } from 'react';
import { Button, Stack, Text, Code, Alert, Paper, ScrollArea } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { db } from '../../config/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import { logError } from '../../utils/logger';
import { fhirService } from '../../services/fhirService';
import { fhirConfig } from '../../config/fhirConfig';

const samplePatient = {
  "resourceType": "Patient",
  "id": "sample-patient-1",
  "identifier": [{
    "system": "http://example.org/fhir/sid/mrn",
    "value": "12345"
  }],
  "active": true,
  "name": [{
    "use": "official",
    "family": "Smith",
    "given": ["John", "Jacob"]
  }],
  "gender": "male",
  "birthDate": "1964-07-15",
  "address": [{
    "use": "home",
    "line": ["123 Main St"],
    "city": "Anytown",
    "state": "CA",
    "postalCode": "12345"
  }]
};

const sampleConditions = [
  {
    "resourceType": "Condition",
    "id": "diabetes-type2",
    "clinicalStatus": {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
        "code": "active",
        "display": "Active"
      }]
    },
    "verificationStatus": {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
        "code": "confirmed",
        "display": "Confirmed"
      }]
    },
    "category": [{
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/condition-category",
        "code": "problem-list-item",
        "display": "Problem List Item"
      }]
    }],
    "code": {
      "coding": [{
        "system": "http://hl7.org/fhir/sid/icd-10-cm",
        "code": "E11.9",
        "display": "Type 2 diabetes mellitus without complications"
      }],
      "text": "Type 2 diabetes mellitus without complications"
    },
    "subject": {
      "reference": "Patient/sample-patient-1"
    },
    "onsetDateTime": "2025-01-26",
    "meta": {
      "tag": [{
        "system": "http://terminology.hl7.org/CodeSystem/cmshcc",
        "code": "19",
        "display": "Diabetes without Complication"
      }]
    }
  },
  {
    "resourceType": "Condition",
    "id": "chf",
    "clinicalStatus": {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
        "code": "active",
        "display": "Active"
      }]
    },
    "verificationStatus": {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
        "code": "confirmed",
        "display": "Confirmed"
      }]
    },
    "category": [{
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/condition-category",
        "code": "problem-list-item",
        "display": "Problem List Item"
      }]
    }],
    "code": {
      "coding": [{
        "system": "http://hl7.org/fhir/sid/icd-10-cm",
        "code": "I50.9",
        "display": "Heart failure, unspecified"
      }],
      "text": "Congestive Heart Failure"
    },
    "subject": {
      "reference": "Patient/sample-patient-1"
    },
    "onsetDateTime": "2025-01-26",
    "meta": {
      "tag": [{
        "system": "http://terminology.hl7.org/CodeSystem/cmshcc",
        "code": "85",
        "display": "Congestive Heart Failure"
      }]
    }
  }
];

const sampleObservations = [
  {
    "resourceType": "Observation",
    "id": "blood-pressure",
    "status": "final",
    "category": [{
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
        "code": "vital-signs",
        "display": "Vital Signs"
      }]
    }],
    "code": {
      "coding": [{
        "system": "http://loinc.org",
        "code": "85354-9",
        "display": "Blood pressure panel with all children optional"
      }]
    },
    "subject": {
      "reference": "Patient/sample-patient-1"
    },
    "effectiveDateTime": "2025-01-26T09:30:00Z",
    "component": [
      {
        "code": {
          "coding": [{
            "system": "http://loinc.org",
            "code": "8480-6",
            "display": "Systolic blood pressure"
          }]
        },
        "valueQuantity": {
          "value": 140,
          "unit": "mmHg",
          "system": "http://unitsofmeasure.org",
          "code": "mm[Hg]"
        }
      },
      {
        "code": {
          "coding": [{
            "system": "http://loinc.org",
            "code": "8462-4",
            "display": "Diastolic blood pressure"
          }]
        },
        "valueQuantity": {
          "value": 90,
          "unit": "mmHg",
          "system": "http://unitsofmeasure.org",
          "code": "mm[Hg]"
        }
      }
    ]
  }
];

const SampleDataLoader = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = user?.email === 'brendansmithelion@gmail.com' || user?.role === 'admin';

  const loadSampleData = async () => {
    if (!isAdmin) {
      setError('Unauthorized: Admin access required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Push all resources in a single batch
      console.log('Pushing resources to FHIR server...');
      const allResources = [
        samplePatient,
        ...sampleConditions,
        ...sampleObservations
      ];
      
      const result = await fhirService.pushBatch(allResources);
      console.log('FHIR batch response:', result);

      // Store metadata in Firestore
      const batch = writeBatch(db);
      const timestamp = new Date().toISOString();

      const loadRef = doc(db, 'sampleDataLoads', timestamp);
      batch.set(loadRef, {
        loadedBy: user.uid,
        loadedAt: timestamp,
        fhirServer: {
          projectId: fhirConfig.projectId,
          location: fhirConfig.location,
          dataset: fhirConfig.dataset,
          fhirStore: fhirConfig.fhirStore
        },
        resources: {
          patients: [samplePatient.id],
          conditions: sampleConditions.map(c => c.id),
          observations: sampleObservations.map(o => o.id)
        }
      });

      await batch.commit();
      console.log('Sample data loaded successfully');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      logError(err, {
        component: 'SampleDataLoader',
        action: 'loadSampleData',
        user: user?.email
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={16} />}>
        You don't have permission to load sample data.
      </Alert>
    );
  }

  return (
    <Paper p="xl" radius="md">
      <Stack spacing="md">
        <Text size="xl" weight={700}>Sample FHIR Data Loader</Text>
        
        <Text size="sm" color="dimmed">
          Connected to FHIR Store: {fhirConfig.fhirStore}
        </Text>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            mb="md"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            icon={<IconCheck size={16} />}
            title="Success"
            color="green"
            mb="md"
          >
            Sample data loaded successfully to FHIR server
          </Alert>
        )}

        <Button 
          onClick={loadSampleData} 
          loading={loading}
          disabled={!isAdmin}
          size="lg"
        >
          Load Sample Data
        </Button>

        <Text size="sm" color="dimmed">
          This will load sample FHIR resources to the configured FHIR server:
        </Text>
        <ul>
          <li>Patient demographics</li>
          <li>Conditions with CMS HCC risk data</li>
          <li>Vital sign observations</li>
        </ul>

        <Text size="sm" weight={700} mt="md">Sample Data Preview:</Text>
        <ScrollArea h={300}>
          <Code block>
            {JSON.stringify({
              patient: samplePatient,
              conditions: sampleConditions,
              observations: sampleObservations
            }, null, 2)}
          </Code>
        </ScrollArea>
      </Stack>
    </Paper>
  );
};

export default SampleDataLoader; 