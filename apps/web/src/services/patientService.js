import { getAuthToken } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL;

export const patientService = {
  async getPatients(search = '') {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/fhir/Patient${search ? `?name=${search}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  async getPatientById(id) {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/fhir/Patient/${id}`, {
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
      console.error('Error fetching patient:', error);
      throw error;
    }
  },

  async getPatientConditions(patientId, token) {
    const response = await fetch(`${API_URL}/fhir/Condition`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        patient: patientId,
        _sort: '-onset-date'
      }
    });
    return response.json().then(data => data.entry || []);
  },

  async getPatientObservations(patientId, token) {
    const response = await fetch(`${API_URL}/fhir/Observation`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        patient: patientId,
        _sort: '-date'
      }
    });
    return response.json().then(data => data.entry || []);
  },

  async getPatientMedications(patientId, token) {
    const response = await fetch(`${API_URL}/fhir/MedicationRequest`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        patient: patientId,
        _sort: '-authored-on'
      }
    });
    return response.json().then(data => data.entry || []);
  }
}; 