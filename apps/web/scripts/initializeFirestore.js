import { db } from '../src/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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