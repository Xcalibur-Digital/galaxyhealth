import { auth } from '../config/firebase';
import { fhirConfig } from '../config/fhirConfig';

console.log('FHIR Config:', fhirConfig);

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is signed in');
  }
  return user.getIdToken();
};

export const fhirService = {
  async getPatientData(patientId) {
    try {
      // Fetch data sequentially instead of all at once
      const vitals = await this.getVitals(patientId);
      const medications = await this.getMedications(patientId);
      const appointments = await this.getAppointments(patientId);
      const conditions = await this.getConditions(patientId);
      const allergies = await this.getAllergies(patientId);
      const immunizations = await this.getImmunizations(patientId);
      const labResults = await this.getLabResults(patientId);
      const procedures = await this.getProcedures(patientId);

      return {
        vitals,
        medications,
        appointments,
        conditions,
        allergies,
        immunizations,
        labResults,
        procedures
      };
    } catch (error) {
      console.error('Error fetching patient data:', error);
      throw error;
    }
  },

  async getVitals(patientId) {
    const token = await getAuthToken();
    const response = await fetch(`${fhirConfig.baseUrl}/Observation?patient=${patientId}&category=vital-signs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/fhir+json'
      }
    });
    const data = await response.json();
    return data.entry || [];
  },

  async getMedications(patientId) {
    const response = await fetch(`${fhirConfig.baseUrl}/MedicationRequest?patient=${patientId}&status=active&_include=MedicationRequest:medication`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });
    const data = await response.json();
    return data.entry || [];
  },

  async getAppointments(patientId) {
    const response = await fetch(`${fhirConfig.baseUrl}/Appointment?patient=${patientId}&status=booked&_sort=date&_count=5`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });
    const data = await response.json();
    return data.entry || [];
  },

  async getConditions(patientId) {
    const response = await fetch(`${fhirConfig.baseUrl}/Condition?patient=${patientId}&_sort=-onset-date&_count=10`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });
    const data = await response.json();
    return data.entry || [];
  },

  async getAllergies(patientId) {
    const response = await fetch(`${fhirConfig.baseUrl}/AllergyIntolerance?patient=${patientId}&_count=10`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });
    const data = await response.json();
    return data.entry || [];
  },

  async getImmunizations(patientId) {
    const response = await fetch(`${fhirConfig.baseUrl}/Immunization?patient=${patientId}&_sort=-date&_count=10`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });
    const data = await response.json();
    return data.entry || [];
  },

  async getLabResults(patientId) {
    const response = await fetch(`${fhirConfig.baseUrl}/Observation?patient=${patientId}&category=laboratory&_sort=-date&_count=10`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });
    const data = await response.json();
    return data.entry || [];
  },

  async getProcedures(patientId) {
    const response = await fetch(`${fhirConfig.baseUrl}/Procedure?patient=${patientId}&_sort=-date&_count=10`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });
    const data = await response.json();
    return data.entry || [];
  },

  async searchPatients(searchTerm) {
    const searchParams = {
      _count: 10,
      _sort: '-_lastUpdated',
      name: searchTerm,
      identifier: searchTerm
    };

    const response = await fetch(`${fhirConfig.baseUrl}/Patient?${new URLSearchParams(searchParams).toString()}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });

    if (!response.ok) {
      console.error('No data received from FHIR server');
    } else {
      console.log('FHIR search successful:', {
        total: response.data.total,
        count: response.data.entry?.length || 0
      });
    }

    return (response.data.entry || []).map(entry => {
      const resource = entry.resource;
      const identifiers = resource.identifier?.map(id => ({
        system: id.system,
        value: id.value,
        type: id.type?.coding?.[0]?.display || 'ID'
      })) || [];

      return {
        id: resource.id,
        name: this.formatPatientName(resource.name?.[0]),
        birthDate: resource.birthDate ? new Date(resource.birthDate).toLocaleDateString() : 'Unknown',
        gender: resource.gender || 'Unknown',
        identifiers,
        contact: resource.telecom?.map(t => ({
          system: t.system,
          value: t.value,
          use: t.use
        })) || []
      };
    });
  },

  formatPatientName(name) {
    if (!name) return 'Unknown';
    const given = name.given?.join(' ') || '';
    const family = name.family || '';
    return `${given} ${family}`.trim() || 'Unknown';
  },

  parseVitals(entries) {
    const vitals = {
      heartRate: null,
      bloodPressure: null,
      temperature: null,
      oxygenSaturation: null
    };

    entries.forEach(entry => {
      const resource = entry.resource;
      switch (resource.code.coding[0].code) {
        case '8867-4': // Heart rate
          vitals.heartRate = Math.round(resource.valueQuantity.value);
          break;
        case '8480-6': // Blood pressure
          vitals.bloodPressure = `${resource.component[0].valueQuantity.value}/${resource.component[1].valueQuantity.value}`;
          break;
        case '8310-5': // Temperature
          vitals.temperature = `${resource.valueQuantity.value}°F`;
          break;
        case '2708-6': // Oxygen saturation
          vitals.oxygenSaturation = Math.round(resource.valueQuantity.value);
          break;
        default:
          break;
      }
    });

    return vitals;
  },

  parseMedications(entries) {
    return entries.map(entry => {
      const resource = entry.resource;
      return {
        name: resource.medicationCodeableConcept?.text || 'Unknown Medication',
        schedule: this.parseDosageInstruction(resource.dosageInstruction?.[0]),
        nextDose: this.calculateNextDose(resource.dosageInstruction?.[0])
      };
    });
  },

  parseAppointments(entries) {
    return entries.map(entry => {
      const resource = entry.resource;
      const startTime = new Date(resource.start);
      return {
        type: resource.serviceType?.[0]?.text || 'Medical Appointment',
        date: startTime.toLocaleDateString(),
        time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
  },

  parseDosageInstruction(dosage) {
    if (!dosage) return 'As needed';
    
    const timing = dosage.timing?.code?.text;
    const frequency = dosage.timing?.repeat?.frequency;
    const period = dosage.timing?.repeat?.period;
    const periodUnit = dosage.timing?.repeat?.periodUnit;

    if (timing) return timing;
    if (frequency && period) {
      return `${frequency} time${frequency > 1 ? 's' : ''} per ${period} ${periodUnit}`;
    }
    return 'As directed';
  },

  calculateNextDose(dosage) {
    if (!dosage?.timing?.repeat) return 'N/A';

    const now = new Date();
    const frequency = dosage.timing.repeat.frequency || 1;
    const period = dosage.timing.repeat.period || 1;
    const periodUnit = dosage.timing.repeat.periodUnit || 'h';

    // Simple calculation for demo purposes
    const hoursToAdd = periodUnit === 'd' ? period * 24 : period;
    const nextDose = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);

    return nextDose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  parseConditions(entries) {
    return entries.map(entry => {
      const resource = entry.resource;
      return {
        name: resource.code?.text || resource.code?.coding?.[0]?.display || 'Unknown Condition',
        status: resource.clinicalStatus?.coding?.[0]?.code || 'unknown',
        onset: resource.onsetDateTime ? new Date(resource.onsetDateTime).toLocaleDateString() : 'Unknown',
        severity: resource.severity?.coding?.[0]?.display || 'Unknown'
      };
    });
  },

  parseAllergies(entries) {
    return entries.map(entry => {
      const resource = entry.resource;
      return {
        substance: resource.code?.text || resource.code?.coding?.[0]?.display || 'Unknown Allergen',
        severity: resource.reaction?.[0]?.severity || 'unknown',
        status: resource.clinicalStatus?.coding?.[0]?.code || 'unknown',
        type: resource.type || 'allergy'
      };
    });
  },

  parseImmunizations(entries) {
    return entries.map(entry => {
      const resource = entry.resource;
      return {
        vaccine: resource.vaccineCode?.text || resource.vaccineCode?.coding?.[0]?.display || 'Unknown Vaccine',
        date: resource.occurrenceDateTime ? new Date(resource.occurrenceDateTime).toLocaleDateString() : 'Unknown',
        status: resource.status || 'unknown',
        doseNumber: resource.protocolApplied?.[0]?.doseNumber?.toString() || 'Unknown'
      };
    });
  },

  parseLabResults(entries) {
    return entries.map(entry => {
      const resource = entry.resource;
      return {
        test: resource.code?.text || resource.code?.coding?.[0]?.display || 'Unknown Test',
        result: resource.valueQuantity ? `${resource.valueQuantity.value} ${resource.valueQuantity.unit}` : 'No result',
        date: resource.effectiveDateTime ? new Date(resource.effectiveDateTime).toLocaleDateString() : 'Unknown',
        status: resource.status || 'unknown',
        interpretation: resource.interpretation?.[0]?.coding?.[0]?.display || 'Unknown'
      };
    });
  },

  parseProcedures(entries) {
    return entries.map(entry => {
      const resource = entry.resource;
      return {
        name: resource.code?.text || resource.code?.coding?.[0]?.display || 'Unknown Procedure',
        status: resource.status || 'unknown',
        date: resource.performedDateTime ? new Date(resource.performedDateTime).toLocaleDateString() : 'Unknown',
        performer: resource.performer?.[0]?.actor?.display || 'Unknown Provider'
      };
    });
  },

  getPatients: async (searchTerm = '') => {
    const token = await getAuthToken();
    const params = new URLSearchParams();
    params.append('_count', '100');
    params.append('_sort', '-_lastUpdated');
    
    if (searchTerm.trim()) {
      params.append('name:contains', searchTerm.trim());
    }

    const response = await fetch(`${fhirConfig.baseUrl}/api/fhir/Patient?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/fhir+json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }

    return response.json();
  },

  getPatientDetails: async (id) => {
    const token = await getAuthToken();
    const response = await fetch(`${fhirConfig.baseUrl}/api/fhir/Patient/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/fhir+json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patient details');
    }

    return response.json();
  },

  getPatientResources: async (patientId, resourceType) => {
    const token = await getAuthToken();
    const response = await fetch(
      `${fhirConfig.baseUrl}/api/fhir/${resourceType}?patient=${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/fhir+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resourceType}`);
    }

    return response.json();
  },

  async getAuthHeaders() {
    const token = await getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/fhir+json'
    };
  },

  async pushResource(resource) {
    const token = await getAuthToken();
    const response = await fetch(`${fhirConfig.baseUrl}/${resource.resourceType}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(resource)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to push ${resource.resourceType}: ${errorText}`);
    }

    return response.json();
  },

  async pushBatch(resources) {
    const token = await getAuthToken();
    const bundle = {
      resourceType: 'Bundle',
      type: 'batch',
      entry: resources.map(resource => ({
        resource,
        request: {
          method: 'POST',
          url: resource.resourceType
        }
      }))
    };

    const response = await fetch(fhirConfig.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(bundle)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to push batch: ${errorText}`);
    }

    return response.json();
  }
};

export const searchFHIRPatients = async () => {
  try {
    console.log('Starting FHIR patient search...');
    const token = await getAuthToken();
    
    const url = `${fhirConfig.baseUrl}/Patient`;
    console.log('Making request to:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch patients: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Transform FHIR Bundle to our format
    return data.entry?.map(entry => {
      const resource = entry.resource;
      const name = resource.name?.[0] || {};
      
      return {
        id: resource.id,
        name: `${name.given?.[0] || ''} ${name.family || ''}`.trim() || 'Unknown',
        identifier: resource.identifier?.[0]?.value || 'N/A',
        gender: resource.gender || 'unknown',
        birthDate: resource.birthDate || 'Unknown',
        lastUpdated: new Date(resource.meta?.lastUpdated).toLocaleDateString(),
        riskLevel: 'low' // This would come from risk assessment in a real app
      };
    }) || [];
  } catch (error) {
    console.error('Error in searchFHIRPatients:', error);
    throw error;
  }
};

export const getFHIRPatient = async (id) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${fhirConfig.baseUrl}/api/fhir/Patient/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patient');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching FHIR patient:', error);
    throw error;
  }
};

export const getRecentPatients = async (limit = 10) => {
  try {
    console.log('Fetching recent patients...');
    const token = await getAuthToken();
    
    const params = new URLSearchParams({
      '_count': limit,
      '_sort': '-_lastUpdated'
    });

    // Construct URL with single /api prefix
    const url = `${fhirConfig.baseUrl}/api/fhir/Patient?${params}`;
    console.log('Making request to:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FHIR API Error:', errorText);
      throw new Error(`Failed to fetch patients: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Add placeholder data for gaps analysis
    const processedData = {
      ...data,
      entry: data.entry?.map(entry => ({
        ...entry,
        resource: {
          ...entry.resource,
          conditions: [],
          observations: [],
          carePlans: [],
          appointments: []
        }
      }))
    };

    console.log('Processed FHIR Response:', processedData);
    return processedData;
  } catch (error) {
    console.error('Error fetching recent patients:', error);
    throw error;
  }
}; 