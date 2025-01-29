import { getAuthToken } from '../config/firebase';

const FHIR_BASE_URL = import.meta.env.VITE_API_URL;

export const searchFHIRPatients = async () => {
  try {
    const authToken = await getAuthToken();
    console.log('Making FHIR request to:', `${FHIR_BASE_URL}/fhir/Patient`);
    
    const response = await fetch(`${FHIR_BASE_URL}/fhir/Patient`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FHIR API Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`FHIR API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('FHIR API Response:', data);
    
    // Transform FHIR patient resources to our format
    if (!data.entry) {
      console.log('No patients found in FHIR response');
      return [];
    }

    return data.entry.map(entry => {
      const resource = entry.resource;
      const name = resource.name?.[0] || {};
      
      const patient = {
        id: resource.id,
        firstName: name.given?.[0] || '',
        lastName: name.family || '',
        dateOfBirth: resource.birthDate || '',
        gender: resource.gender || '',
        email: resource.telecom?.find(t => t.system === 'email')?.value || '',
        phone: resource.telecom?.find(t => t.system === 'phone')?.value || '',
        lastVisit: resource.meta?.lastUpdated?.split('T')[0] || '',
        fhirResource: resource
      };
      
      console.log('Transformed patient:', patient);
      return patient;
    });
  } catch (error) {
    console.error('Error fetching FHIR patients:', error);
    throw error;
  }
}; 