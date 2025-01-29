import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Validate required environment variables
const requiredEnvVars = [
  'FIREBASE_TYPE',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Load service account from JSON file
const serviceAccountPath = path.resolve(__dirname, './serviceAccount.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Extract config from service account
export const firebaseConfig = {
  apiKey: serviceAccount.api_key,
  authDomain: `${serviceAccount.project_id}.firebaseapp.com`,
  projectId: serviceAccount.project_id,
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
  messagingSenderId: serviceAccount.client_id,
  appId: serviceAccount.app_id || process.env.FIREBASE_APP_ID // Fallback to env if not in service account
};

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  ...firebaseConfig
});

export const db = getFirestore(app);
export const auth = getAuth(app); 