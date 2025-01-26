// Sample patient document structure
const patientSchema = {
  firstName: String,
  lastName: String,
  dateOfBirth: String, // ISO date string
  gender: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  lastVisit: String, // ISO date string
  medicalHistory: Array,
  medications: Array,
  allergies: Array,
  createdAt: Timestamp,
  updatedAt: Timestamp
}; 