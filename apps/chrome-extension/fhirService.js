const FHIR_BASE_URL = 'https://healthcare.googleapis.com/v1/projects/galaxyhealth/locations/us-central1/datasets/galaxyhealth-dataset/fhirStores/galaxyhealth-fhir-store/fhir';

export const searchFHIRPatient = async (patientInfo) => {
  try {
    const params = new URLSearchParams();
    
    if (patientInfo.mrn) {
      params.append('identifier', patientInfo.mrn);
    }
    if (patientInfo.name) {
      params.append('name', patientInfo.name);
    }
    
    const response = await fetch(`${FHIR_BASE_URL}/Patient?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Accept': 'application/fhir+json'
      }
    });

    if (!response.ok) {
      throw new Error('FHIR search failed');
    }

    const data = await response.json();
    return data.entry?.[0]?.resource || null;
  } catch (error) {
    console.error('Error searching FHIR patient:', error);
    throw error;
  }
}; 