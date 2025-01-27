// Get environment variables
const FHIR_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const FHIR_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FHIR_LOCATION = 'us-central1';
const FHIR_DATASET = 'galaxyhealth-dataset';
const FHIR_STORE = 'galaxyhealth-fhir-store';

export const fhirConfig = {
  baseUrl: `${FHIR_BASE_URL}/api/fhir`,
  projectId: FHIR_PROJECT_ID,
  location: FHIR_LOCATION,
  dataset: FHIR_DATASET,
  fhirStore: FHIR_STORE,
  fullUrl: `${FHIR_BASE_URL}/api/fhir`
};

export default fhirConfig; 