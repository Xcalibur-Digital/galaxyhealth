import express from 'express';
import { verifyAuthToken } from './auth.js';

const router = express.Router();

router.use(verifyAuthToken);

router.get('/', (req, res) => {
  res.json({ message: 'Get all patients' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create patient' });
});

export const patientRoutes = router; 