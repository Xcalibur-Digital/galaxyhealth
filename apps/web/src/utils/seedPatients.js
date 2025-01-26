import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const testPatients = [
  {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1980-05-15",
    gender: "Male",
    email: "john.doe@email.com",
    phone: "555-0123",
    lastVisit: "2024-02-15",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1992-08-23",
    gender: "Female",
    email: "jane.smith@email.com",
    phone: "555-0124",
    lastVisit: "2024-03-01",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    firstName: "Robert",
    lastName: "Johnson",
    dateOfBirth: "1975-11-30",
    gender: "Male",
    email: "robert.j@email.com",
    phone: "555-0125",
    lastVisit: "2024-02-28",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export const seedPatients = async () => {
  try {
    const patientsCollection = collection(db, 'patients');
    for (const patient of testPatients) {
      await addDoc(patientsCollection, patient);
    }
    console.log('Test patients added successfully');
  } catch (error) {
    console.error('Error adding test patients:', error);
  }
}; 