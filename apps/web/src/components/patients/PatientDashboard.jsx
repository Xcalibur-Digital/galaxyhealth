import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Paper, Text, RingProgress, Group, Stack, Container } from '@mantine/core';
import { fhirService } from '../../services/fhirService';
import './PatientDashboard.css';
import PatientChart from './PatientChart';

export default function PatientDashboard() {
  const { id } = useParams();
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const data = await fhirService.getPatientData(id);
        setHealthMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!healthMetrics) return null;

  return (
    <Container size="xl">
      <Grid>
        <Grid.Col span={12}>
          <PatientChart patient={healthMetrics} />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 