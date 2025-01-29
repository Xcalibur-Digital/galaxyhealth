import dotenv from 'dotenv';
dotenv.config();  // Load environment variables first

import express from 'express';
import cors from 'cors';
import { auth } from './routes/auth.js';
import { fhir } from './routes/fhir.js';
import { userRoutes } from './routes/user.js';
import { patientRoutes } from './routes/patients.js';
import { setupAdminUser } from './config/setupAdmin.js';
import * as functions from 'firebase-functions';

const app = express();
const port = process.env.PORT || 3001;

// Initialize admin user
setupAdminUser().catch(console.error);

// Configure CORS
app.use(cors({
  origin: [
    'https://galaxyhealth.web.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/auth', auth);
app.use('/api/fhir', fhir);
app.use('/api/user', userRoutes);
app.use('/api/patients', patientRoutes);

// Add a test endpoint at the root
app.get('/', (req, res) => {
  res.json({ message: 'API server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  
  // Send appropriate error response
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

app.listen(port, () => {
  console.log(`API Server is running on port: ${port}`);
  console.log(`Health check available at: http://localhost:${port}/health`);
});

export const api = functions.https.onRequest(app); 