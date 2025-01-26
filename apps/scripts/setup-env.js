import fs from 'fs';
import path from 'path';

const serviceAccountPath = path.resolve('apps/api/src/config/serviceAccount.json');
const envPath = path.resolve('apps/.env');

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const envContent = `
FIREBASE_TYPE=${serviceAccount.type}
FIREBASE_PROJECT_ID=${serviceAccount.project_id}
FIREBASE_PRIVATE_KEY_ID=${serviceAccount.private_key_id}
FIREBASE_PRIVATE_KEY="${serviceAccount.private_key}"
FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}
FIREBASE_CLIENT_ID=${serviceAccount.client_id}
FIREBASE_AUTH_URI=${serviceAccount.auth_uri}
FIREBASE_TOKEN_URI=${serviceAccount.token_uri}
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=${serviceAccount.auth_provider_x509_cert_url}
FIREBASE_CLIENT_X509_CERT_URL=${serviceAccount.client_x509_cert_url}
# Add your Firebase API key manually after running this script
FIREBASE_API_KEY=
`.trim();

fs.writeFileSync(envPath, envContent);
console.log('Environment file created successfully!'); 