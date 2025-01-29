import { db } from '../src/firebase.js';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const recommendations = [
  {
    title: "Schedule AWVs for High-Risk Patients",
    description: "10 patients with multiple chronic conditions haven't had an AWV in the last 12 months",
    priority: "high",
    impact: "$2,500 potential revenue",
    action: "View Patient List",
    icon: "calendar",
    type: "awv",
    timestamp: serverTimestamp(),
    status: "active",
    dueDate: "2024-03-15",
    category: "preventive"
  },
  {
    title: "Review HCC Recapture Opportunities",
    description: "15 patients have suspected HCC conditions requiring documentation",
    priority: "high",
    impact: "$3,750 RAF adjustment opportunity",
    action: "Review HCC Gaps",
    icon: "report-medical",
    type: "hcc",
    timestamp: serverTimestamp(),
    status: "active",
    dueDate: "2024-03-10",
    category: "risk"
  },
  {
    title: "Close Pre-Visit Care Gaps",
    description: "25 patients scheduled next week have open care gaps",
    priority: "medium",
    impact: "$1,875 in quality incentives",
    action: "View Care Gaps",
    icon: "checkbox",
    type: "quality",
    timestamp: serverTimestamp(),
    status: "active",
    dueDate: "2024-03-08",
    category: "quality"
  },
  {
    title: "Monitor At-Risk Patients",
    description: "5 patients show rising risk scores based on recent vitals",
    priority: "high",
    impact: "Prevent potential ED visits",
    action: "View Risk Scores",
    icon: "activity",
    type: "risk",
    timestamp: serverTimestamp(),
    status: "active",
    dueDate: "2024-03-05",
    category: "risk"
  },
  {
    title: "Medication Review Needed",
    description: "8 patients on high-risk medications require quarterly review",
    priority: "medium",
    impact: "Reduce adverse drug events",
    action: "Review Medications",
    icon: "pill",
    type: "medication",
    timestamp: serverTimestamp(),
    status: "active",
    dueDate: "2024-03-20",
    category: "clinical"
  },
  {
    title: "Diabetes Management Follow-ups",
    description: "12 diabetic patients with A1C > 9.0 need follow-up",
    priority: "high",
    impact: "Quality measure improvement",
    action: "Schedule Follow-ups",
    icon: "heartbeat",
    type: "chronic",
    timestamp: serverTimestamp(),
    status: "active",
    dueDate: "2024-03-12",
    category: "clinical"
  },
  {
    title: "Immunization Campaign",
    description: "30 Medicare patients need flu shots for quality metrics",
    priority: "medium",
    impact: "$1,200 in incentives",
    action: "View Patients",
    icon: "vaccine",
    type: "preventive",
    timestamp: serverTimestamp(),
    status: "active",
    dueDate: "2024-03-25",
    category: "preventive"
  },
  {
    title: "Transitional Care Management",
    description: "3 patients discharged this week eligible for TCM",
    priority: "high",
    impact: "$325 per completed TCM",
    action: "Start TCM",
    icon: "stethoscope",
    type: "care-management",
    timestamp: serverTimestamp(),
    status: "active",
    dueDate: "2024-03-07",
    category: "clinical"
  }
];

const metrics = {
  vbcScore: 85,
  lastUpdated: serverTimestamp(),
  trends: {
    awvCompletion: 78,
    careGapClosure: 82,
    riskAdjustment: 91,
    qualityScore: 88,
    patientSatisfaction: 4.2,
    costEfficiency: 86
  },
  performance: {
    total: 85,
    breakdown: {
      quality: 88,
      cost: 83,
      utilization: 85,
      patientExperience: 84
    }
  },
  targets: {
    awvCompletion: 85,
    careGapClosure: 90,
    riskAdjustment: 95
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    const recsRef = collection(db, 'recommendations');
    
    // Add recommendations
    for (const rec of recommendations) {
      await addDoc(recsRef, rec);
      console.log(`Added recommendation: ${rec.title}`);
    }

    // Add metrics
    await setDoc(doc(db, 'metrics', 'vbc-score'), metrics);
    console.log('Added metrics data');

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Run seed function
seedData()
  .then(() => {
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  }); 