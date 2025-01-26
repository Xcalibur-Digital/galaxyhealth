import React from 'react';
import './PatientChart.css';
import { FaInfoCircle } from 'react-icons/fa';

const PatientChart = () => {
  return (
    <div className="patient-chart">
      <header className="chart-header">
        <h1>Evolved Chart: AI Everywhere</h1>
        <h2>Hover event on condition</h2>
      </header>

      <div className="chart-container">
        <nav className="chart-tabs">
          <button className="tab active">Summary</button>
          <button className="tab">Chart</button>
        </nav>

        <div className="main-content">
          <div className="left-sidebar">
            <section className="enrollment-section">
              <h3>Enrollment & Supplementary</h3>
              <div className="enrollment-details">
                <h4>Enrollment</h4>
                <p>Modified in Serious Illness Support</p>
                <p className="date">01/23/2025 (4 days) with Serious Illness Support</p>
              </div>
              
              <div className="attachments">
                <h4>Attachments</h4>
                <p className="muted">No attachments to display</p>
              </div>

              <div className="patient-lists">
                <div className="list-section">
                  <select>
                    <option>Current Lists (2)</option>
                  </select>
                  <select>
                    <option>Other Lists (116)</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          <div className="main-section">
            <nav className="section-tabs">
              <button className="tab active">Enrollment</button>
              <button className="tab">Care Team</button>
              <button className="tab">Patient Info</button>
              <button className="tab">Demographics</button>
              <button className="tab">Sources</button>
              <button className="tab">Risk</button>
              <button className="tab">Providers</button>
            </nav>

            <div className="patient-info-grid">
              <div className="info-column">
                <div className="info-group">
                  <label>Patient Name</label>
                  <div className="info-value redacted"></div>
                </div>
                <div className="info-group">
                  <label>Address</label>
                  <div className="info-value redacted"></div>
                </div>
                <div className="info-group">
                  <label>Race</label>
                  <div className="info-value">WHITE</div>
                </div>
              </div>

              <div className="info-column">
                <div className="info-group">
                  <label>Date of Birth</label>
                  <div className="info-value">(80)</div>
                </div>
                <div className="info-group">
                  <label>Phone</label>
                  <div className="info-value">No phone</div>
                </div>
                <div className="info-group">
                  <label>Ethnicity</label>
                  <div className="info-value">Needs Update</div>
                </div>
              </div>

              <div className="info-column">
                <div className="info-group">
                  <label>Sex</label>
                  <div className="info-value">M</div>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <div className="info-value">No email</div>
                </div>
              </div>
            </div>

            <div className="quality-section">
              <h3>Quality Guidelines</h3>
              <div className="measure-period">
                <p>Measure Period: 01/01/2025 to 12/31/2025</p>
                <div className="adherence">
                  <span className="non-adherent">Non-Adherent</span>
                  <span className="adherent">Adherent</span>
                </div>
              </div>
            </div>

            <div className="conditions-section">
              <div className="conditions-header">
                <h3>Risk Adjustment</h3>
                <div className="filter-tabs">
                  <button className="tab active">All</button>
                  <button className="tab">Open</button>
                  <button className="tab">Addressed</button>
                </div>
              </div>
              <div className="conditions-list">
                <div className="condition-item">
                  <div className="condition-content">
                    <h4>Chronic obstructive pulmonary disease, unspecified (J44.9)</h4>
                    <p>Principal (Historical Claim) • Feb 12, 2024 • ELGAMAL, AHMED</p>
                  </div>
                  <button className="info-button">
                    <FaInfoCircle />
                  </button>
                </div>
                
                <div className="condition-item">
                  <div className="condition-content">
                    <h4>Hemiplegia following cerebral infarc affecting left nondominant side</h4>
                    <p>Principal (Historical Claim) • Feb 12, 2024 • LOYOLA UNIVERSITY MEDICAL CENTER</p>
                  </div>
                  <button className="info-button">
                    <FaInfoCircle />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientChart; 