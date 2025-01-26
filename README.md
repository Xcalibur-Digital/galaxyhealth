# Galaxy Health

A modern healthcare platform built with FHIR (Fast Healthcare Interoperability Resources) for managing patient data, clinical workflows, and healthcare analytics.

## Overview

Galaxy Health provides:
- Patient management with FHIR R4 integration
- Risk and care gap analysis
- Clinical workflow management
- Administrative dashboard
- Role-based access control

## Tech Stack

### Frontend (apps/web)
- React 18+
- Mantine UI Components
- Firebase Authentication
- FHIR Client (R4)
- Vite

### Backend (apps/api)
- Node.js/Express
- Firebase Admin SDK
- Google Healthcare API (FHIR)
- FHIR R4 Support

## FHIR Resources & Specifications

### Core Resources
- Patient (R4)
  - Demographics
  - Contact information
  - Identifiers
  - Medical record numbers

### Clinical Resources
- Observation
  - Vital signs
  - Lab results
  - Clinical measurements
- Condition
  - Diagnoses
  - Active problems
  - Historical conditions
- CarePlan
  - Treatment plans
  - Care goals
  - Interventions
- RiskAssessment
  - Clinical risk scores
  - Gap analysis
  - Risk factors

### Administrative Resources
- Appointment
  - Scheduling
  - Visit types
  - Status tracking
- MedicationRequest
  - Prescriptions
  - Medication orders
  - Dosage instructions
- AllergyIntolerance
  - Allergies
  - Adverse reactions
  - Severity levels
- Immunization
  - Vaccination records
  - Administration dates
  - Vaccine types

## Prerequisites

- Node.js 18+
- Firebase Account
- Google Cloud Platform Account with Healthcare API enabled
- FHIR R4 Server (Google Healthcare FHIR store)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/galaxyhealth.git
cd galaxyhealth
```

2. Install dependencies:
```bash
# Root dependencies
npm install

# Web app
cd apps/web
npm install

# API
cd ../api
npm install
```

3. Configure environment variables:

```env
# apps/web/.env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3001/api

# apps/api/.env
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_CLOUD_LOCATION=your_location
GOOGLE_HEALTHCARE_DATASET=your_dataset_id
GOOGLE_HEALTHCARE_FHIR_STORE=your_fhir_store_id
```

## Development

```bash
# Start web app (port 3000)
cd apps/web
npm run dev

# Start API server (port 3001)
cd ../api
npm run dev
```

## Project Structure

```
galaxyhealth/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── contexts/   # React contexts
│   │   │   ├── pages/      # Page components
│   │   │   ├── services/   # API services
│   │   │   └── styles/     # CSS styles
│   │   └── package.json
│   │
│   └── api/                # Express backend
│       ├── src/
│       │   ├── config/     # Configuration
│       │   ├── routes/     # API routes
│       │   ├── models/     # Data models
│       │   └── middleware/ # Express middleware
│       └── package.json
```

## Git Guidelines

### Branches
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation

### Commit Messages
Follow conventional commits:
```bash
feat: add new feature
fix: bug fix
chore: maintenance
docs: documentation
style: code style
refactor: code changes
test: test updates
```

## License

MIT

## Contributors

- Brendan Smith-Elion (@brendansmithelion) 