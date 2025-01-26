import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './PatientDetails.css';
import { formatPatientName, formatPatientIdentifier } from '../utils/formatters';
import { getAuthToken } from '../config/firebase';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [resources, setResources] = useState({
    conditions: [],
    medications: [],
    allergies: [],
    immunizations: [],
    observations: [],
    carePlans: [],
    procedures: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`http://localhost:3001/api/fhir/Patient/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient');
        }

        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  useEffect(() => {
    const fetchPatientResources = async () => {
      try {
        const token = await getAuthToken();
        const patientId = patient.id;

        // Fetch all resources in parallel
        const results = await Promise.all([
          fetchResource(token, patientId, 'Condition'),
          fetchResource(token, patientId, 'MedicationRequest'),
          fetchResource(token, patientId, 'AllergyIntolerance'),
          fetchResource(token, patientId, 'Immunization'),
          fetchResource(token, patientId, 'Observation'),
          fetchResource(token, patientId, 'CarePlan'),
          fetchResource(token, patientId, 'Procedure')
        ]);

        setResources({
          conditions: results[0],
          medications: results[1],
          allergies: results[2],
          immunizations: results[3],
          observations: results[4],
          carePlans: results[5],
          procedures: results[6]
        });
      } catch (err) {
        console.error('Error fetching patient resources:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (patient) {
      fetchPatientResources();
    }
  }, [patient]);

  const fetchResource = async (token, patientId, resourceType) => {
    const response = await fetch(
      `http://localhost:3001/api/fhir/${resourceType}?patient=${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resourceType}`);
    }

    const data = await response.json();
    return data.entry || [];
  };

  if (!patient) return null;

  const telecom = patient.telecom || [];
  const addresses = patient.address || [];
  const identifiers = patient.identifier || [];
  const names = patient.name || [];

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString();
  };

  const formatAddress = (addresses) => {
    if (!addresses || !addresses.length) return 'No address provided';
    const addr = addresses[0];
    return (
      <>
        {addr.line?.join(', ')}<br />
        {addr.city && `${addr.city}, `}
        {addr.state} {addr.postalCode}
      </>
    );
  };

  const formatTelecom = (telecoms) => {
    if (!telecoms || !telecoms.length) return [];
    return telecoms.map(t => ({
      type: t.system,
      value: t.value,
      use: t.use
    }));
  };

  const formattedName = formatPatientName(names);

  const formatIdentifiers = (identifiers) => {
    if (!identifiers || !identifiers.length) return 'No identifiers';
    return identifiers.map(id => 
      `${id.system ? id.system.split('/').pop() : 'ID'}: ${id.value}`
    ).join(', ');
  };

  return (
    <div className="patient-details-overlay">
      <div className="patient-details-modal">
        <div className="patient-details-header">
          <h2>{formattedName}</h2>
          <button className="close-button" onClick={() => navigate(-1)}>&times;</button>
        </div>

        <div className="patient-details-content">
          <div className="details-section">
            <h3>Basic Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>ID</label>
                <span>{formatIdentifiers(identifiers)}</span>
              </div>
              <div className="detail-item">
                <label>Date of Birth</label>
                <span>{formatDate(patient.birthDate)}</span>
              </div>
              <div className="detail-item">
                <label>Gender</label>
                <span>{patient.gender || 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Contact Information</h3>
            <div className="contact-info">
              {formatTelecom(telecom).map((contact, index) => (
                <div 
                  key={index} 
                  className="contact-item"
                  data-type={contact.type}
                >
                  <label>{contact.type} ({contact.use})</label>
                  <span>{contact.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h3>Address</h3>
            <div className="address-info">
              {formatAddress(addresses)}
            </div>
          </div>

          {patient.communication && (
            <div className="details-section">
              <h3>Language</h3>
              <div className="language-info">
                {patient.communication.map((lang, index) => (
                  <span key={index} className="language-tag">
                    {lang.language.text || lang.language.coding?.[0]?.display || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-resources">
              <div className="spinner"></div>
              <p>Loading patient resources...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>Error loading resources: {error}</p>
            </div>
          ) : (
            <>
              {/* Conditions */}
              <div className="details-section">
                <h3>Conditions</h3>
                <div className="resource-list">
                  {resources.conditions.length > 0 ? (
                    resources.conditions.map(entry => (
                      <div key={entry.resource.id} className="resource-item">
                        <span className="resource-name">
                          {entry.resource.code?.coding?.[0]?.display || 'Unknown Condition'}
                        </span>
                        <span className="resource-date">
                          {formatDate(entry.resource.onsetDateTime)}
                        </span>
                        <span className={`resource-status ${entry.resource.clinicalStatus?.coding?.[0]?.code}`}>
                          {entry.resource.clinicalStatus?.coding?.[0]?.code || 'unknown'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No conditions recorded</p>
                  )}
                </div>
              </div>

              {/* Medications */}
              <div className="details-section">
                <h3>Medications</h3>
                <div className="resource-list">
                  {resources.medications.length > 0 ? (
                    resources.medications.map(entry => (
                      <div key={entry.resource.id} className="resource-item">
                        <span className="resource-name">
                          {entry.resource.medicationCodeableConcept?.coding?.[0]?.display || 'Unknown Medication'}
                        </span>
                        <span className="resource-details">
                          {entry.resource.dosageInstruction?.[0]?.text}
                        </span>
                        <span className={`resource-status ${entry.resource.status}`}>
                          {entry.resource.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No medications recorded</p>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div className="details-section">
                <h3>Allergies</h3>
                <div className="resource-list">
                  {resources.allergies.length > 0 ? (
                    resources.allergies.map(entry => (
                      <div key={entry.resource.id} className="resource-item">
                        <span className="resource-name">
                          {entry.resource.code?.coding?.[0]?.display || 'Unknown Allergy'}
                        </span>
                        <span className="resource-severity">
                          {entry.resource.reaction?.[0]?.severity || 'Unknown severity'}
                        </span>
                        <span className={`resource-status ${entry.resource.clinicalStatus?.coding?.[0]?.code}`}>
                          {entry.resource.clinicalStatus?.coding?.[0]?.code || 'unknown'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No allergies recorded</p>
                  )}
                </div>
              </div>

              {/* Immunizations */}
              <div className="details-section">
                <h3>Immunizations</h3>
                <div className="resource-list">
                  {resources.immunizations.length > 0 ? (
                    resources.immunizations.map(entry => (
                      <div key={entry.resource.id} className="resource-item">
                        <span className="resource-name">
                          {entry.resource.vaccineCode?.coding?.[0]?.display || 'Unknown Vaccine'}
                        </span>
                        <span className="resource-date">
                          {formatDate(entry.resource.occurrenceDateTime)}
                        </span>
                        <span className={`resource-status ${entry.resource.status}`}>
                          {entry.resource.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No immunizations recorded</p>
                  )}
                </div>
              </div>

              {/* Vital Signs & Lab Results (filtered from Observations) */}
              <div className="details-section">
                <h3>Vital Signs & Lab Results</h3>
                <div className="resource-list">
                  {resources.observations.length > 0 ? (
                    resources.observations.map(entry => (
                      <div key={entry.resource.id} className="resource-item">
                        <span className="resource-name">
                          {entry.resource.code?.coding?.[0]?.display || 'Unknown Observation'}
                        </span>
                        <span className="resource-value">
                          {entry.resource.valueQuantity ? 
                            `${entry.resource.valueQuantity.value} ${entry.resource.valueQuantity.unit}` :
                            entry.resource.valueString || 'No value recorded'}
                        </span>
                        <span className="resource-date">
                          {formatDate(entry.resource.effectiveDateTime)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No observations recorded</p>
                  )}
                </div>
              </div>

              {/* Care Plans */}
              <div className="details-section">
                <h3>Care Plans</h3>
                <div className="resource-list">
                  {resources.carePlans.length > 0 ? (
                    resources.carePlans.map(entry => (
                      <div key={entry.resource.id} className="resource-item">
                        <span className="resource-name">
                          {entry.resource.title || 'Untitled Care Plan'}
                        </span>
                        <span className="resource-period">
                          {formatDate(entry.resource.period?.start)} - {formatDate(entry.resource.period?.end)}
                        </span>
                        <span className={`resource-status ${entry.resource.status}`}>
                          {entry.resource.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No care plans recorded</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 