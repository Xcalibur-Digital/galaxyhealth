import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';

// Initialize admin SDK
const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = join(__dirname, '../service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const recommendations = [
  {
    id: 'awv-high-risk',
    title: "Schedule AWVs for High-Risk Patients",
    description: "10 patients with multiple chronic conditions haven't had an AWV in the last 12 months",
    priority: "high",
    impact: "$2,500 potential revenue",
    action: "View Patient List",
    icon: "calendar",
    type: "awv",
    timestamp: new Date(),
    status: "active",
    dueDate: "2024-03-15",
    category: "preventive",
    patientCount: 10
  },
  {
    id: 'hcc-recapture',
    title: "Review HCC Recapture Opportunities",
    description: "15 patients have suspected HCC conditions requiring documentation",
    priority: "high",
    impact: "$3,750 RAF adjustment opportunity",
    action: "Review HCC Gaps",
    icon: "report-medical",
    type: "hcc",
    timestamp: new Date(),
    status: "active",
    dueDate: "2024-03-10",
    category: "risk",
    patientCount: 15
  },
  {
    id: 'care-gaps',
    title: "Close Pre-Visit Care Gaps",
    description: "25 patients scheduled next week have open care gaps",
    priority: "medium",
    impact: "$1,875 in quality incentives",
    action: "View Care Gaps",
    icon: "checkbox",
    type: "quality",
    timestamp: new Date(),
    status: "active",
    dueDate: "2024-03-08",
    category: "quality",
    patientCount: 25
  },
  {
    id: 'med-adherence',
    title: "Medication Adherence Follow-ups",
    description: "12 patients showing poor adherence to chronic medications",
    priority: "high",
    impact: "Improve HEDIS measures",
    action: "View Patients",
    icon: "pill",
    type: "adherence",
    timestamp: new Date(),
    status: "active",
    dueDate: "2024-03-07",
    category: "quality",
    patientCount: 12
  },
  {
    id: 'tcm',
    title: "Post-Discharge Follow-ups Required",
    description: "8 patients discharged in last 48 hours need TCM scheduling",
    priority: "high",
    impact: "$1,600 TCM opportunity",
    action: "Schedule TCM",
    icon: "hospital",
    type: "transitions",
    timestamp: new Date(),
    status: "active",
    dueDate: "2024-03-05",
    category: "care-transitions",
    patientCount: 8
  }
];

const cohorts = [
  {
    name: 'High-Risk Medicare',
    totalPatients: 245,
    riskProfile: { high: 245, medium: 0, low: 0 },
    careGaps: 156,
    adherence: 78,
    averageHCC: 1.45,
    pmpm: 1250,
    readmissionRate: 18,
    edVisits: 42,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Rising Risk Diabetes',
    totalPatients: 168,
    riskProfile: { high: 0, medium: 168, low: 0 },
    careGaps: 98,
    adherence: 82,
    averageHCC: 0.95,
    pmpm: 850,
    readmissionRate: 12,
    edVisits: 28,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Complex Care',
    totalPatients: 92,
    riskProfile: { high: 92, medium: 0, low: 0 },
    careGaps: 124,
    adherence: 75,
    averageHCC: 2.15,
    pmpm: 2250,
    readmissionRate: 25,
    edVisits: 56,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Chronic Stable',
    totalPatients: 412,
    riskProfile: { high: 0, medium: 182, low: 230 },
    careGaps: 186,
    adherence: 88,
    averageHCC: 0.75,
    pmpm: 425,
    readmissionRate: 8,
    edVisits: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const metrics = {
  vbcScore: 85,
  trends: {
    awvCompletion: 78,
    careGapClosure: 82,
    riskAdjustment: 91,
    qualityScore: 88,
    patientSatisfaction: 4.2,
    costEfficiency: 86,
    readmissionRate: 12.5,
    edUtilization: 142,
    tcmCompletion: 76
  },
  performance: {
    total: 85,
    breakdown: {
      quality: 88,
      cost: 83,
      utilization: 85,
      patientExperience: 84
    },
    measures: {
      diabetes: {
        a1cControl: 72,
        eyeExams: 68,
        kidneyScreening: 81
      },
      hypertension: {
        bpControl: 75,
        medicationAdherence: 82
      },
      preventive: {
        awvCompletion: 78,
        fluVaccination: 65,
        cancerScreenings: 72
      }
    }
  },
  financials: {
    shared_savings: 245000,
    quality_bonus: 125000,
    cost_avoidance: 380000,
    per_member_per_month: 42.50
  }
};

const samplePatients = [
  {
    firstName: "John",
    lastName: "Doe",
    age: 65,
    gender: "Male",
    riskScore: 0.8,
    careGaps: ["AWV", "A1C Test"],
    lastVisit: "2024-01-15",
    nextAWV: "2024-03-20",
    hccStatus: "pending",
    pmpm: 850,
    adherence: 75
  },
  // ... adding more diverse patient data ...
  {
    firstName: "Maria",
    lastName: "Garcia",
    age: 72,
    gender: "Female",
    riskScore: 1.2,
    careGaps: ["Mammogram", "Colonoscopy"],
    lastVisit: "2024-02-01",
    nextAWV: "2024-04-15",
    hccStatus: "documented",
    pmpm: 1200,
    adherence: 90,
    conditions: ["Diabetes", "Hypertension"]
  },
  // ... generating 220 more patients programmatically ...
].concat(Array.from({ length: 220 }, (_, i) => {
  const firstNames = ["James", "Mary", "Robert", "Patricia", "Michael", "Jennifer", "William", "Linda", "David", "Elizabeth", "Richard", "Barbara", "Joseph", "Susan", "Thomas", "Jessica", "Charles", "Sarah", "Christopher", "Karen", "Daniel", "Nancy", "Matthew", "Lisa", "Anthony", "Margaret", "Donald", "Sandra", "Mark", "Ashley"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
  const conditions = ["Diabetes", "Hypertension", "COPD", "CHF", "CKD", "Depression", "Anxiety", "Arthritis", "Obesity", "Asthma"];
  const careGapOptions = ["AWV", "A1C Test", "Mammogram", "Colonoscopy", "Flu Shot", "Pneumonia Vaccine", "Depression Screening", "Eye Exam", "Foot Exam", "Blood Pressure Check"];
  
  const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
  };

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Generate 1-4 random conditions
  const patientConditions = Array.from({ length: randomInt(1, 4) }, () => randomElement(conditions))
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  // Generate 1-3 random care gaps
  const patientCareGaps = Array.from({ length: randomInt(1, 3) }, () => randomElement(careGapOptions))
    .filter((v, i, a) => a.indexOf(v) === i);

  return {
    firstName: randomElement(firstNames),
    lastName: randomElement(lastNames),
    age: randomInt(65, 90),
    gender: Math.random() > 0.5 ? "Male" : "Female",
    riskScore: Number((Math.random() * 2 + 0.5).toFixed(2)),
    careGaps: patientCareGaps,
    lastVisit: randomDate(new Date('2023-01-01'), new Date()),
    nextAWV: randomDate(new Date(), new Date('2024-12-31')),
    hccStatus: randomElement(["pending", "documented", "reviewed", "incomplete"]),
    pmpm: randomInt(500, 2500),
    adherence: randomInt(60, 100),
    conditions: patientConditions,
    insuranceType: randomElement(["Medicare", "Medicare Advantage", "Dual Eligible"]),
    riskLevel: randomElement(["Low", "Medium", "High"]),
    primaryProvider: randomElement(["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Davis", "Dr. Miller"]),
    lastHospitalization: Math.random() > 0.7 ? randomDate(new Date('2023-01-01'), new Date()) : null,
    medications: randomInt(2, 8)
  };
}));

async function initializeData() {
  try {
    console.log('Starting data initialization...');

    // Clear existing collections first
    console.log('Clearing existing data...');
    const collections = ['recommendations', 'cohortMetrics', 'patients'];
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batchSize = 500;
      const batches = [];
      
      for (let i = 0; i < snapshot.docs.length; i += batchSize) {
        const batch = db.batch();
        snapshot.docs.slice(i, i + batchSize).forEach(doc => {
          batch.delete(doc.ref);
        });
        batches.push(batch.commit());
      }
      
      await Promise.all(batches);
      console.log(`Cleared ${collectionName} collection`);
    }

    // Add recommendations and metrics first
    const recommendationsBatch = db.batch();
    for (const rec of recommendations) {
      const { id, ...data } = rec;
      recommendationsBatch.set(db.collection('recommendations').doc(id), data);
    }
    await recommendationsBatch.commit();
    console.log('Added recommendations');

    // Add cohorts in a single batch
    const cohortsBatch = db.batch();
    cohorts.forEach(cohort => {
      cohortsBatch.set(db.collection('cohortMetrics').doc(), cohort);
    });
    await cohortsBatch.commit();
    console.log('Added cohorts');

    // Add metrics
    await db.doc('metrics/vbc-score').set(metrics);
    console.log('Added metrics');

    // Add patients in larger batches with better logging
    console.log(`Starting patient import (${samplePatients.length} patients)...`);
    const batchSize = 500;
    const totalBatches = Math.ceil(samplePatients.length / batchSize);
    
    for (let i = 0; i < samplePatients.length; i += batchSize) {
      const batch = db.batch();
      const currentBatch = samplePatients.slice(i, i + batchSize);
      
      currentBatch.forEach(patient => {
        const docRef = db.collection('patients').doc();
        batch.set(docRef, {
          ...patient,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
      const currentBatchNumber = Math.floor(i / batchSize) + 1;
      console.log(`Completed batch ${currentBatchNumber}/${totalBatches} (${Math.round((currentBatchNumber/totalBatches) * 100)}%)`);
    }

    console.log('Data initialization complete');
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

// Add to your .env file:
// FIREBASE_ADMIN_PASSWORD=your_password

// Run with environment variable:
// FIREBASE_ADMIN_PASSWORD=your_password npm run init-data

// Run initialization
initializeData()
  .then(() => {
    console.log('Successfully initialized all data');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to initialize data:', error);
    process.exit(1);
  }); 