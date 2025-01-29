export interface CohortMetrics {
  id: string;
  name: string;
  totalPatients: number;
  riskProfile: {
    high: number;
    medium: number;
    low: number;
  };
  careGaps: number;
  adherence: number;
  updatedAt: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  status: 'active' | 'completed' | 'archived';
  patientIds: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientCarePathway {
  id: string;
  patientId: string;
  cohortId: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskHistory: {
    level: 'high' | 'medium' | 'low';
    timestamp: string;
  }[];
  careGaps: CareGap[];
  activeRecommendations: string[]; // References to recommendations
  createdAt: string;
  updatedAt: string;
}

export interface CareGap {
  id: string;
  type: string;
  description: string;
  status: 'open' | 'closed';
  dueDate: string;
  closureHistory: {
    status: 'open' | 'closed';
    reason?: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
} 