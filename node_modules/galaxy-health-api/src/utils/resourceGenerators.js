import { v4 as uuidv4 } from 'uuid';
import { 
  LOINC_CODES, 
  SNOMED_CONDITIONS, 
  RXNORM_MEDICATIONS 
} from './constants.js';

// Helper functions
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateEncounters = (patientId, patientName, practitionerId, organizationId) => {
  // ... (keep existing encounter generation code)
};

const generateRelatedResources = (patient) => {
  const resources = [];
  const patientId = patient.id;
  const patientName = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;

  // Add Organization
  const organizationId = uuidv4();
  resources.push({
    resourceType: 'Organization',
    id: organizationId,
    name: 'Galaxy Health Medical Center',
    telecom: [{
      system: 'phone',
      value: '(555) GALAXY-1',
      use: 'work'
    }],
    address: [{
      line: ['123 Galaxy Way'],
      city: 'Universe City',
      state: 'CA',
      postalCode: '90210'
    }]
  });

  // Add Practitioner
  const practitionerId = uuidv4();
  resources.push({
    resourceType: 'Practitioner',
    id: practitionerId,
    identifier: [{
      system: 'http://galaxyhealth.com/practitioners',
      value: `PRAC${random(1000, 9999)}`
    }],
    name: [{
      use: 'official',
      family: 'House',
      given: ['Gregory']
    }],
    telecom: [{
      system: 'email',
      value: 'g.house@galaxyhealth.com'
    }]
  });

  // Add new resource types
  resources.push(...generateGoals(patientId, patientName, practitionerId));
  resources.push(...generateAllergies(patientId, patientName));
  resources.push(...generateImmunizations(patientId, patientName));
  resources.push(...generateFamilyHistory(patientId, patientName));
  resources.push(generateSocialHistory(patientId, patientName));

  // Generate encounters and related resources
  const encounters = generateEncounters(patientId, patientName, practitionerId, organizationId);
  resources.push(...encounters);

  // For each encounter, add clinical notes and diagnostic reports
  encounters.forEach(encounter => {
    if (encounter.resourceType === 'Encounter') {
      resources.push(...generateClinicalNotes(
        patientId,
        patientName,
        encounter.id,
        practitionerId,
        new Date(encounter.period.start)
      ));
      resources.push(...generateDiagnosticReports(
        patientId,
        patientName,
        encounter.id,
        new Date(encounter.period.start)
      ));
    }
  });

  return resources;
};

const calculateRelatedResourcesCount = () => {
  return {
    organization: 1,
    practitioner: 1,
    encounters: 5,
    observations: 5 * 3,
    conditions: 2,
    medications: 2,
    immunizations: 3,
    allergies: 2,
    goals: 3,
    carePlans: 1,
    documentReferences: 5,
    diagnosticReports: 10,
    familyHistory: 3,
    socialHistory: 1
  };
};

export {
  generateRelatedResources,
  generateEncounters,
  calculateRelatedResourcesCount
}; 