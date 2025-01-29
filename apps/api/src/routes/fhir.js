import express from 'express';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { createAuthenticatedClient, fhirStorePath } from '../config/googleCloud.js';
import { verifyAuthToken } from '../middleware/auth.js';
import { 
  generateRelatedResources, 
  calculateRelatedResourcesCount 
} from '../utils/resourceGenerators.js';
import admin from 'firebase-admin';
import { auth } from '../config/firebase.js';

const router = express.Router();

// Using Google Healthcare API with FHIR R4
const FHIR_SOURCE = process.env.FHIR_SOURCE || 'GOOGLE'; // 'GOOGLE' or 'HAPI'
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Simple request queue
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const { fn, resolve, reject } = this.queue.shift();
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      setTimeout(() => this.process(), 1000); // Wait 1 second between requests
    }
  }
}

const requestQueue = new RequestQueue();

const makeGoogleRequest = async (options) => {
  try {
    const client = await createAuthenticatedClient();
    console.log('Making FHIR request:', {
      resource: options.resource,
      params: options.params
    });

    const response = await client.get(`/Patient`, {
      params: {
        _count: options.params._count,
        _sort: options.params._sort
      }
    });

    console.log('FHIR response:', {
      status: response.status,
      data: response.data
    });

    // Transform the FHIR Bundle response
    if (response.data && response.data.entry) {
      return {
        patients: response.data.entry.map(entry => entry.resource),
        total: response.data.total || response.data.entry.length,
        pageSize: options.params._count || 10
      };
    } else {
      console.warn('No entries in FHIR response:', response.data);
      return {
        patients: [],
        total: 0,
        pageSize: options.params._count || 10
      };
    }
  } catch (error) {
    console.error('FHIR request failed:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

// Helper function to format patient name
function formatPatientName(names) {
  if (!names || !names.length) return 'Unknown';
  
  const primaryName = names.find(n => n.use === 'official') || names[0];
  const given = primaryName.given ? primaryName.given.join(' ') : '';
  const family = primaryName.family || '';
  
  return `${given} ${family}`.trim() || 'Unknown';
}

// Helper function to format patient identifier
function formatPatientIdentifier(identifiers) {
  if (!identifiers || !identifiers.length) return 'No ID';
  
  // Try to find MRN first, then fall back to first identifier
  const primaryId = identifiers.find(id => 
    id.system?.toLowerCase().includes('mrn') || 
    id.type?.coding?.some(coding => coding.code === 'MR')
  ) || identifiers[0];
  
  return primaryId.value || 'No ID';
}

async function makeHapiRequest(url, params, retries = 0) {
  const makeAxiosRequest = async () => {
    try {
      const response = await axios.get(url, {
        params,
        headers: {
          'Accept': 'application/fhir+json; fhirVersion=5.0'
        },
        timeout: REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
        return makeHapiRequest(url, params, retries + 1);
      }
      throw error;
    }
  };

  // Add request to queue
  return requestQueue.add(makeAxiosRequest);
}

// Add auth middleware to protect FHIR routes
router.use(verifyAuthToken);

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: process.env.GOOGLE_HEALTHCARE_RATE_LIMIT || 50 // limit each IP to 50 requests per windowMs
});

// Configure speed limiting
const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: Math.floor((process.env.GOOGLE_HEALTHCARE_RATE_LIMIT || 50) * 0.8),
  delayMs: () => 500
});

// Apply rate limiting to all FHIR routes
router.use(limiter);
router.use(speedLimiter);

// Get single patient by ID
router.get('/Patient/:id', verifyAuthToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching patient:', id);

    const client = await createAuthenticatedClient();
    const response = await client.get(`/Patient/${id}`);

    if (!response.data) {
      return res.status(404).json({
        error: {
          message: 'Patient not found'
        }
      });
    }

    console.log('Found patient:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch patient',
        details: error.message
      }
    });
  }
});

// Existing search patients endpoint
router.get('/Patient', verifyAuthToken, async (req, res) => {
  try {
    const client = await createAuthenticatedClient();
    const response = await client.get('/Patient');
    res.json(response.data);
  } catch (error) {
    console.error('FHIR request failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test connection endpoint
router.get('/test/connection', async (req, res) => {
  try {
    const client = await createAuthenticatedClient();
    const response = await client.get('/Patient?_count=1&_summary=true');

    res.json({
      status: 'success',
      message: 'Successfully connected to Google FHIR store',
      data: response.data
    });
  } catch (error) {
    console.error('Google FHIR test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Google FHIR store',
      error: {
        message: error.message,
        details: error.response?.data || error
      }
    });
  }
});

// Add progress tracking
let loadingProgress = {
  message: '',
  current: 0,
  total: 0
};

// Add SSE endpoint for progress updates
router.get('/test/bulk-load/progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial progress
  res.write(`data: ${JSON.stringify(loadingProgress)}\n\n`);

  // Keep connection alive
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify(loadingProgress)}\n\n`);
  }, 1000);

  // Clean up on close
  req.on('close', () => {
    clearInterval(interval);
  });
});

const bulkLoadResources = async (client) => {
  const results = { success: 0, failed: 0, errors: [] };
  
  try {
    // Calculate total resources to load
    const resourceCounts = calculateRelatedResourcesCount();
    const resourcesPerPatient = Object.values(resourceCounts).reduce((a, b) => a + b, 0);
    const totalResources = samplePatients.length + 
      (samplePatients.length * resourcesPerPatient);
    
    console.log('Resource calculation:', {
      patientsCount: samplePatients.length,
      resourcesPerPatient,
      totalResources,
      breakdown: resourceCounts
    });

    loadingProgress = {
      message: 'Starting bulk load...',
      current: 0,
      total: totalResources
    };

    // Load patients
    for (const patient of samplePatients) {
      try {
        loadingProgress.message = `Creating patient: ${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
        
        const response = await client.post('/Patient', patient);
        results.success++;
        loadingProgress.current++;
        
        // Load related resources
        const relatedResources = generateRelatedResources(patient);
        for (const resource of relatedResources) {
          try {
            loadingProgress.message = `Creating ${resource.resourceType} for ${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
            
            await client.post(`/${resource.resourceType}`, resource);
            results.success++;
            loadingProgress.current++;
          } catch (error) {
            results.failed++;
            loadingProgress.current++;
            results.errors.push({
              resourceType: resource.resourceType,
              error: error.message
            });
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        results.failed++;
        loadingProgress.current++;
        results.errors.push({
          resourceType: 'Patient',
          error: error.message
        });
      }
    }

    loadingProgress.message = 'Bulk load complete!';
    return results;
  } catch (error) {
    console.error('Bulk load error:', error);
    loadingProgress.message = 'Error: ' + error.message;
    throw error;
  }
};

// Bulk load endpoint
router.post('/test/bulk-load', async (req, res) => {
  try {
    const client = await createAuthenticatedClient();
    console.log('Starting bulk load of sample patients...');

    const results = await bulkLoadResources(client);

    console.log('Bulk load completed:', {
      total: results.success + results.failed,
      successful: results.success,
      failed: results.failed
    });

    res.json({
      status: 'completed',
      summary: {
        total: results.success + results.failed,
        successful: results.success,
        failed: results.failed
      },
      results: results
    });

  } catch (error) {
    console.error('Bulk load error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to complete bulk load',
      error: {
        message: error.message,
        details: error.response?.data || error
      }
    });
  }
});

// Add a test endpoint to create a sample patient
router.post('/test/patient', async (req, res) => {
  try {
    const parent = `${fhirStorePath}/fhir`;
    
    const testPatient = {
      resourceType: 'Patient',
      name: [{
        use: 'official',
        family: 'Test',
        given: ['Patient']
      }],
      gender: 'unknown',
      birthDate: '2000-01-01'
    };

    const response = await createAuthenticatedClient().post('/Patient', testPatient);

    res.json({
      status: 'success',
      message: 'Successfully created test patient',
      data: response.data
    });
  } catch (error) {
    console.error('Google FHIR create patient error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create test patient',
      error: {
        message: error.message,
        details: error.response?.data || error
      }
    });
  }
});

// Add a test endpoint to create Donald Duck
router.post('/test/create-sample', async (req, res) => {
  try {
    const parent = fhirStorePath;
    
    console.log('Creating sample patient with:', {
      parent,
      fhirStorePath,
      env: {
        project: process.env.GOOGLE_CLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION,
        dataset: process.env.GOOGLE_HEALTHCARE_DATASET,
        store: process.env.GOOGLE_HEALTHCARE_FHIR_STORE
      }
    });

    const samplePatient = {
      resourceType: 'Patient',
      id: 'pat1',
      identifier: [{
        system: 'http://galaxyhealth.com/fhir/identifier',
        value: 'pat1'
      }],
      name: [{
        use: 'official',
        family: 'Duck',
        given: ['Donald']
      }],
      gender: 'male',
      birthDate: '1934-06-09',
      telecom: [{
        system: 'phone',
        value: '555-123-4567',
        use: 'home'
      }]
    };

    console.log('Sample patient data:', samplePatient);

    const response = await createAuthenticatedClient().post('/Patient', samplePatient);

    console.log('Create response:', {
      status: response.status,
      data: response.data
    });

    res.json({
      status: 'success',
      message: 'Successfully created Donald Duck patient',
      data: response.data
    });
  } catch (error) {
    console.error('Create sample patient error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to create sample patient',
      error: {
        message: error.message,
        details: error.response?.data || error
      }
    });
  }
});

// Add sample patients data
const samplePatients = [
  {
    resourceType: 'Patient',
    id: 'pat1',
    identifier: [{ system: 'http://galaxyhealth.com/fhir/identifier', value: 'pat1' }],
    name: [{ use: 'official', family: 'Duck', given: ['Donald'] }],
    gender: 'male',
    birthDate: '1934-06-09',
    telecom: [{ system: 'phone', value: '555-123-4567', use: 'home' }]
  },
  {
    resourceType: 'Patient',
    id: 'pat2',
    identifier: [{ system: 'http://galaxyhealth.com/fhir/identifier', value: 'pat2' }],
    name: [{ use: 'official', family: 'Mouse', given: ['Mickey'] }],
    gender: 'male',
    birthDate: '1928-11-18',
    telecom: [{ system: 'phone', value: '555-987-6543', use: 'home' }]
  },
  {
    resourceType: 'Patient',
    id: 'pat3',
    identifier: [{ system: 'http://galaxyhealth.com/fhir/identifier', value: 'pat3' }],
    name: [{ use: 'official', family: 'Mouse', given: ['Minnie'] }],
    gender: 'female',
    birthDate: '1928-11-18',
    telecom: [{ system: 'phone', value: '555-246-8135', use: 'home' }]
  },
  {
    resourceType: 'Patient',
    id: 'pat4',
    identifier: [
      { system: 'http://galaxyhealth.com/fhir/identifier', value: 'pat4' },
      { system: 'http://galaxyhealth.com/fhir/mrn', value: 'MRN123456' }
    ],
    name: [
      { use: 'official', family: 'Duck', given: ['Daisy'] },
      { use: 'nickname', given: ['Daze'] }
    ],
    gender: 'female',
    birthDate: '1937-01-10',
    telecom: [
      { system: 'phone', value: '555-789-0123', use: 'mobile' },
      { system: 'email', value: 'daisy.duck@email.com', use: 'work' }
    ],
    address: [{
      use: 'home',
      line: ['123 Duck Lane'],
      city: 'Duckburg',
      state: 'CA',
      postalCode: '90210'
    }]
  },
  {
    resourceType: 'Patient',
    id: 'pat5',
    identifier: [
      { system: 'http://galaxyhealth.com/fhir/identifier', value: 'pat5' },
      { system: 'http://galaxyhealth.com/fhir/ssn', value: '123-45-6789' }
    ],
    name: [
      { use: 'official', family: 'McDuck', given: ['Scrooge'] },
      { use: 'nickname', given: ['Uncle Scrooge'] }
    ],
    gender: 'male',
    birthDate: '1867-12-24',
    telecom: [
      { system: 'phone', value: '555-MONEY', use: 'work' },
      { system: 'email', value: 'scrooge@moneybins.com', use: 'work' }
    ],
    address: [{
      use: 'work',
      line: ['1 Money Bin Way'],
      city: 'Duckburg',
      state: 'CA',
      postalCode: '90210'
    }]
  },
  {
    resourceType: 'Patient',
    id: 'pat6',
    identifier: [
      { system: 'http://galaxyhealth.com/fhir/identifier', value: 'pat6' },
      { system: 'http://galaxyhealth.com/fhir/passport', value: 'PP123456' }
    ],
    name: [
      { use: 'official', family: 'Duck', given: ['Hubert', 'Dewey', 'Louie'] }
    ],
    gender: 'male',
    birthDate: '1940-10-17',
    telecom: [
      { system: 'phone', value: '555-DUCK', use: 'home' },
      { system: 'email', value: 'triplets@junior.com', use: 'home' }
    ],
    address: [{
      use: 'home',
      line: ['42 Duck Street'],
      city: 'Duckburg',
      state: 'CA',
      postalCode: '90210'
    }]
  },
  {
    resourceType: 'Patient',
    id: 'pat7',
    identifier: [
      { system: 'http://galaxyhealth.com/fhir/identifier', value: 'pat7' },
      { system: 'http://galaxyhealth.com/fhir/mrn', value: 'MRN789012' }
    ],
    name: [
      { use: 'official', family: 'Gearloose', given: ['Gyro'] }
    ],
    gender: 'male',
    birthDate: '1952-05-21',
    telecom: [
      { system: 'phone', value: '555-TECH', use: 'work' },
      { system: 'email', value: 'inventor@gearloose.com', use: 'work' }
    ],
    address: [{
      use: 'work',
      line: ['789 Innovation Ave'],
      city: 'Duckburg',
      state: 'CA',
      postalCode: '90210'
    }]
  }
];

// Add this near your other test endpoints
router.get('/test/list', async (req, res) => {
  try {
    const client = await createAuthenticatedClient();
    console.log('Testing FHIR store connection...');

    const response = await client.get('/Patient?_count=1');
    
    console.log('Test response:', {
      status: response.status,
      resourceType: response.data?.resourceType,
      total: response.data?.total,
      hasEntries: !!response.data?.entry?.length
    });

    res.json({
      status: 'success',
      data: response.data
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      details: error.response?.data
    });
  }
});

router.get('/test/patients', async (req, res) => {
  try {
    const client = await createAuthenticatedClient();
    console.log('Testing patient fetch...');

    const response = await client.get('/Patient?_count=5');
    
    console.log('Raw FHIR response:', {
      status: response.status,
      resourceType: response.data?.resourceType,
      total: response.data?.total,
      hasEntries: !!response.data?.entry?.length
    });

    if (response.data?.entry?.[0]) {
      console.log('Sample patient:', response.data.entry[0].resource);
    }

    res.json({
      status: 'success',
      data: response.data
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      details: error.response?.data
    });
  }
});

// Add this new route for batch requests
router.post('/batch', async (req, res) => {
  try {
    const { patientIds, resources } = req.body;
    const client = await createAuthenticatedClient();

    // Construct the batch bundle
    const bundle = {
      resourceType: 'Bundle',
      type: 'batch',
      entry: patientIds.flatMap(patientId => 
        resources.map(resourceType => ({
          request: {
            method: 'GET',
            url: `${resourceType}?patient=${patientId}&_summary=count`
          }
        }))
      )
    };

    // Make single batch request
    const response = await client.post('', bundle);

    // Process the response bundle
    const results = {};
    if (response.data && response.data.entry) {
      patientIds.forEach(patientId => {
        results[patientId] = {};
        resources.forEach(resourceType => {
          const entry = response.data.entry.find(e => 
            e.response?.location?.includes(`${resourceType}?patient=${patientId}`)
          );
          results[patientId][resourceType.toLowerCase()] = 
            entry?.response?.total || 0;
        });
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Batch request failed:', error);
    res.status(500).json({
      error: {
        message: 'Failed to process batch request',
        details: error.message
      }
    });
  }
});

// Update SAMPLE_RESOURCES to include Encounters and RiskAssessments
const SAMPLE_RESOURCES = {
  Patient: [
    {
      resourceType: 'Patient',
      id: 'sample-pat1',
      identifier: [{ system: 'http://hospital.com/mrn', value: 'MRN12345' }],
      name: [{ use: 'official', family: 'Smith', given: ['John'] }],
      gender: 'male',
      birthDate: '1970-01-01',
      active: true
    }
  ],
  Encounter: [
    {
      resourceType: 'Encounter',
      id: 'sample-enc1',
      status: 'finished',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'ambulatory'
      },
      type: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '308335008',
          display: 'Patient encounter procedure'
        }]
      }],
      subject: { reference: 'Patient/sample-pat1' },
      period: {
        start: '2023-01-15T09:00:00Z',
        end: '2023-01-15T09:30:00Z'
      },
      serviceType: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '185389009',
          display: 'Follow-up visit'
        }]
      }
    },
    {
      resourceType: 'Encounter',
      id: 'sample-enc2',
      status: 'finished',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'EMER',
        display: 'emergency'
      },
      type: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '50849002',
          display: 'Emergency room admission'
        }]
      }],
      subject: { reference: 'Patient/sample-pat1' },
      period: {
        start: '2023-02-20T15:00:00Z',
        end: '2023-02-20T18:45:00Z'
      }
    }
  ],
  RiskAssessment: [
    {
      resourceType: 'RiskAssessment',
      id: 'sample-risk1',
      status: 'final',
      subject: { reference: 'Patient/sample-pat1' },
      occurrenceDateTime: '2023-01-15',
      method: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/risk-assessment-method',
          code: 'CMS-HCC',
          display: 'CMS Hierarchical Condition Category'
        }]
      },
      prediction: [
        {
          outcome: {
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/risk-assessment-prediction',
              code: 'risk-score',
              display: 'Risk Score'
            }]
          },
          probabilityDecimal: 1.234,
          whenPeriod: {
            start: '2023-01-01',
            end: '2023-12-31'
          }
        }
      ],
      basis: [
        { reference: 'Condition/sample-cond1' }
      ]
    },
    {
      resourceType: 'RiskAssessment',
      id: 'sample-risk2',
      status: 'final',
      subject: { reference: 'Patient/sample-pat1' },
      occurrenceDateTime: '2023-07-15',
      method: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/risk-assessment-method',
          code: 'CMS-HCC',
          display: 'CMS Hierarchical Condition Category'
        }]
      },
      prediction: [
        {
          outcome: {
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/risk-assessment-prediction',
              code: 'risk-score',
              display: 'Risk Score'
            }]
          },
          probabilityDecimal: 1.567,
          whenPeriod: {
            start: '2023-07-01',
            end: '2023-12-31'
          }
        }
      ],
      basis: [
        { reference: 'Condition/sample-cond1' },
        { reference: 'Encounter/sample-enc2' }
      ]
    }
  ],
  Condition: [
    {
      resourceType: 'Condition',
      id: 'sample-cond1',
      subject: { reference: 'Patient/sample-pat1' },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '73211009', display: 'Diabetes mellitus' }]
      },
      clinicalStatus: { coding: [{ code: 'active' }] },
      verificationStatus: { coding: [{ code: 'confirmed' }] }
    }
  ],
  Observation: [
    {
      resourceType: 'Observation',
      id: 'sample-obs1',
      subject: { reference: 'Patient/sample-pat1' },
      code: {
        coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }]
      },
      valueQuantity: {
        value: 80,
        unit: 'beats/minute'
      },
      status: 'final'
    }
  ],
  MedicationRequest: [
    {
      resourceType: 'MedicationRequest',
      id: 'sample-med1',
      subject: { reference: 'Patient/sample-pat1' },
      medicationCodeableConcept: {
        coding: [{ system: 'http://www.nlm.nih.gov/rxnorm', code: '855332', display: 'Metformin' }]
      },
      status: 'active',
      intent: 'order'
    }
  ],
  AllergyIntolerance: [
    {
      resourceType: 'AllergyIntolerance',
      id: 'sample-allergy1',
      patient: { reference: 'Patient/sample-pat1' },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '419474003', display: 'Allergy to penicillin' }]
      },
      type: 'allergy',
      criticality: 'high'
    }
  ],
  Immunization: [
    {
      resourceType: 'Immunization',
      id: 'sample-imm1',
      patient: { reference: 'Patient/sample-pat1' },
      vaccineCode: {
        coding: [{ system: 'http://hl7.org/fhir/sid/cvx', code: '08', display: 'Hepatitis B vaccine' }]
      },
      status: 'completed',
      occurrenceDateTime: '2023-01-15'
    }
  ]
};

// Update the bulk load endpoint
router.get('/test/bulk-load', async (req, res) => {
  try {
    const client = await createAuthenticatedClient();
    let progress = 0;
    const totalResources = Object.values(SAMPLE_RESOURCES).flat().length;

    // Reset progress
    loadingProgress = {
      message: 'Starting bulk load...',
      current: 0,
      total: totalResources
    };

    // Load all resource types
    for (const [resourceType, resources] of Object.entries(SAMPLE_RESOURCES)) {
      for (const resource of resources) {
        try {
          await client.post(`/${resourceType}`, resource);
          loadingProgress.current++;
          loadingProgress.message = `Loaded ${resourceType}: ${resource.id}`;
        } catch (error) {
          console.error(`Error loading ${resourceType}:`, error);
          // Continue with other resources even if one fails
        }
      }
    }

    loadingProgress.message = 'Bulk load completed';
    
    res.json({ 
      message: 'Bulk load completed',
      status: 'success',
      totalLoaded: loadingProgress.current
    });

  } catch (error) {
    console.error('Bulk load error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to start bulk load',
        details: error.message
      }
    });
  }
});

router.get('/test/bulk-load/progress', async (req, res) => {
  try {
    // Return the current progress (stored in memory)
    const progress = global.bulkLoadProgress || 0;
    const status = progress >= 100 ? 'completed' : 'in-progress';

    res.json({
      status,
      progress: Math.min(progress, 100)
    });

    // Reset progress if completed
    if (status === 'completed') {
      global.bulkLoadProgress = 0;
    }

  } catch (error) {
    console.error('Progress check error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to check progress',
        details: error.message
      }
    });
  }
});

// Add this near the top of your routes
router.get('/test', (req, res) => {
  res.json({ message: 'FHIR API is working' });
});

export { router as fhir }; 