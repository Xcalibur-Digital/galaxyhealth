import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get absolute path to service account file
const credentialsPath = path.resolve(__dirname, 'serviceAccount.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const projectId = credentials.project_id;
const location = credentials.location;
const dataset = credentials.dataset;
const fhirStore = credentials.fhirStore;

const fhirStorePath = `https://healthcare.googleapis.com/v1/projects/${projectId}/locations/${location}/datasets/${dataset}/fhirStores/${fhirStore}/fhir`;

const createAuthenticatedClient = async () => {
  try {
    console.log('Loading credentials from:', credentialsPath);

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    return axios.create({
      baseURL: fhirStorePath,
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/fhir+json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error creating Google authenticated client:', error);
    throw error;
  }
};

export { createAuthenticatedClient, fhirStorePath }; 