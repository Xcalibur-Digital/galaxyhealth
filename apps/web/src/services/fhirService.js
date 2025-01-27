import { auth } from '../config/firebase';
import { fhirConfig } from '../config/fhirConfig';

console.log('FHIR Config:', fhirConfig);

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

  async getPatients(searchTerm = '') {
    const token = await getAuthToken();
    const params = new URLSearchParams();
    params.append('_count', '100');
    params.append('_sort', '-_lastUpdated');
    
    if (searchTerm.trim()) {
      params.append('name:contains', searchTerm.trim());
    }

    const response = await fetch(`${fhirConfig.baseUrl}/fhir/Patient?${params}`, {
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

  async getPatientResources(patientId, resourceType) {
    const token = await getAuthToken();
    const response = await fetch(
      `${fhirConfig.baseUrl}/fhir/${resourceType}?patient=${patientId}`,
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
  },

  async searchFHIRPatients() {
    try {
      console.log('Starting FHIR patient search...');
      const token = await getAuthToken();
      
      const url = `${API_BASE_URL}/fhir/Patient`;
      console.log('Making request to:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/fhir+json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in searchFHIRPatients:', error);
      throw error;
    }
  }
};

export const searchFHIRPatients = async () => {
  try {
    console.log('Starting FHIR patient search...');
    const token = await getAuthToken();
    
    const url = `${API_BASE_URL}/fhir/Patient`;
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
    const response = await fetch(`${fhirConfig.baseUrl}/fhir/Patient/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json'
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
    const url = `${fhirConfig.baseUrl}/fhir/Patient?${params}`;
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