import { db } from '../src/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const recommendations = [
  {
    title: "Schedule AWVs for High-Risk Patients",
    description: "10 patients with multiple chronic conditions haven't had an AWV in the last 12 months",
    priority: "high",
    impact: "$2,500 potential revenue",
    action: "View Patient List",
    icon: "calendar",
    type: "awv",
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
    status: "active",
    dueDate: "2024-03-10",
    category: "risk"
  },
  // ... add more recommendations
];

const metrics = {
  vbcScore: 85,
  trends: {
    awvCompletion: 78,
    careGapClosure: 82,
    riskAdjustment: 91
  }
};

const initialCohorts = [
  {
    name: 'Diabetes',
    totalPatients: 245,
    riskProfile: {
      high: 45,
      medium: 120,
      low: 80
    },
    careGaps: 156,
    adherence: 78,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: 'Congestive Heart Failure',
    totalPatients: 168,
    riskProfile: {
      high: 58,
      medium: 85,
      low: 25
    },
    careGaps: 98,
    adherence: 82,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: 'COPD',
    totalPatients: 192,
    riskProfile: {
      high: 35,
      medium: 95,
      low: 62
    },
    careGaps: 124,
    adherence: 75,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: 'Chronic Kidney Disease',
    totalPatients: 156,
    riskProfile: {
      high: 42,
      medium: 78,
      low: 36
    },
    careGaps: 89,
    adherence: 84,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function initializeData() {
  try {
    console.log('Starting data initialization...');
    
    // Add cohorts
    for (const cohort of initialCohorts) {
      console.log(`Adding cohort: ${cohort.name}`);
      const docRef = await addDoc(collection(db, 'cohortMetrics'), cohort);
      console.log(`Added cohort with ID: ${docRef.id}`);
    }
    
    console.log('Data initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
}

// Only run if executed directly
if (require.main === module) {
  initializeData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { initializeData }; 
initializeData(); 
