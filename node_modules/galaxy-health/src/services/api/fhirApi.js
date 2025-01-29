import { api } from './index';

export const fhirService = {
  // Patient operations
  getPatients: (params) => api.fhir.getPatients(params),
  getPatientDetails: (id) => api.fhir.getPatientDetails(id),
  getPatientResources: (patientId, resourceType) => api.fhir.getPatientResources(patientId, resourceType),
  
  // Resource operations
  getResource: (resourceType, id) => api.fhir[`get${resourceType}`](id),
  createResource: (resourceType, data) => api.fhir[`create${resourceType}`](data),
  updateResource: (resourceType, id, data) => api.fhir[`update${resourceType}`](id, data),
  deleteResource: (resourceType, id) => api.fhir[`delete${resourceType}`](id),
  
  // Batch operations
  executeBatch: (requests) => api.fhir.batch(requests),
  
  // Search operations
  search: (resourceType, params) => api.fhir.search(resourceType, params),
  
  // Utility functions
  formatReference: (resourceType, id) => `${resourceType}/${id}`,
  extractReference: (reference) => {
    const [resourceType, id] = reference.split('/');
    return { resourceType, id };
  }
}; 