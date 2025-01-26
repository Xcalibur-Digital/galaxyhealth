import { getAuthToken } from '../../config/firebase';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

async function fetchWithAuth(endpoint, options = {}) {
  const token = await getAuthToken();
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const api = {
  fhir: {
    getPatients: (searchTerm = '') => {
      const params = new URLSearchParams(searchTerm ? { 'name:contains': searchTerm } : {});
      return fetchWithAuth(`/fhir/Patient?${params}`);
    },
    getPatientDetails: (id) => fetchWithAuth(`/fhir/Patient/${id}`),
    getPatientResources: (patientId, resourceType) => 
      fetchWithAuth(`/fhir/${resourceType}?patient=${patientId}`)
  },
  auth: {
    login: (credentials) => fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    register: (userData) => fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }
}; 