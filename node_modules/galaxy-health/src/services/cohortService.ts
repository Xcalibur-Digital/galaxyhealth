import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  updateDoc,
  increment,
  writeBatch,
  arrayUnion,
  onSnapshot
} from 'firebase/firestore';
import { 
  CohortMetrics, 
  Recommendation, 
  PatientCarePathway,
  CareGap 
} from '../types/cohort';

interface Intervention {
  id: string;
  type: 'medication' | 'procedure' | 'referral' | 'education' | 'monitoring';
  description: string;
  targetOutcome: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  outcomes: {
    metric: string;
    value: number;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface CarePathwayTemplate {
  id: string;
  name: string;
  condition: string;
  riskLevel: 'high' | 'medium' | 'low';
  interventions: {
    type: string;
    description: string;
    timing: 'immediate' | 'within-week' | 'within-month';
    requiredRole: string;
  }[];
  careGaps: {
    type: string;
    description: string;
    frequency: 'once' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  }[];
  qualityMetrics: string[];
  createdAt: string;
  updatedAt: string;
}

interface QualityMetric {
  id: string;
  name: string;
  description: string;
  type: 'process' | 'outcome' | 'structure';
  measure: string;
  target: number;
  current: number;
  history: {
    value: number;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface InterventionAnalysis {
  interventionId: string;
  type: string;
  successRate: number;
  averageTimeToOutcome: number;
  costEffectiveness: number;
  outcomes: {
    metric: string;
    improvement: number;
    timeToImprovement: number;
  }[];
  patientSegments: {
    segment: string;
    successRate: number;
    count: number;
  }[];
  recommendations: string[];
}

interface InterventionEffectiveness {
  id: string;
  type: string;
  targetMetric: string;
  baselineValue: number;
  currentValue: number;
  improvement: number;
  timeToImprovement: number;
  cost: number;
  roi: number;
  patientCount: number;
  successfulPatients: number;
}

function groupInterventionsByType(interventions: Intervention[]): Record<string, number> {
  return interventions.reduce((acc, intervention) => {
    acc[intervention.type] = (acc[intervention.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function summarizeInterventionOutcomes(interventions: Intervention[]): {
  improved: number;
  unchanged: number;
  declined: number;
} {
  return interventions.reduce((acc, intervention) => {
    const lastOutcome = intervention.outcomes[intervention.outcomes.length - 1];
    const firstOutcome = intervention.outcomes[0];
    
    if (!lastOutcome || !firstOutcome) return acc;
    
    if (lastOutcome.value > firstOutcome.value) acc.improved++;
    else if (lastOutcome.value < firstOutcome.value) acc.declined++;
    else acc.unchanged++;
    
    return acc;
  }, { improved: 0, unchanged: 0, declined: 0 });
}

export const cohortService = {
  // Get all cohort metrics
  async getCohortMetrics(): Promise<CohortMetrics[]> {
    const snapshot = await getDocs(collection(db, 'cohortMetrics'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CohortMetrics[];
  },

  // Get recommendations for a cohort
  async getCohortRecommendations(cohortId: string): Promise<Recommendation[]> {
    const snapshot = await getDocs(
      collection(db, `cohortMetrics/${cohortId}/recommendations`)
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Recommendation[];
  },

  // Get patient care pathways
  async getPatientCarePathways(patientId: string): Promise<PatientCarePathway[]> {
    const snapshot = await getDocs(
      query(
        collection(db, 'patientCarePathways'),
        where('patientId', '==', patientId)
      )
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PatientCarePathway[];
  },

  // Get care gaps for a patient
  async getPatientCareGaps(patientId: string): Promise<CareGap[]> {
    const pathways = await this.getPatientCarePathways(patientId);
    return pathways.reduce((gaps, pathway) => [...gaps, ...pathway.careGaps], [] as CareGap[]);
  },

  // Update patient risk level
  async updatePatientRiskLevel(
    pathwayId: string,
    riskLevel: 'high' | 'medium' | 'low'
  ) {
    const pathwayRef = doc(db, 'patientCarePathways', pathwayId);
    const pathwayDoc = await getDoc(pathwayRef);
    
    if (!pathwayDoc.exists()) throw new Error('Pathway not found');

    const pathway = pathwayDoc.data() as PatientCarePathway;
    
    await updateDoc(pathwayRef, {
      riskLevel,
      riskHistory: [
        ...pathway.riskHistory,
        {
          level: riskLevel,
          timestamp: new Date().toISOString()
        }
      ],
      updatedAt: new Date().toISOString()
    });
  },

  // Close a care gap
  async closeCareGap(
    pathwayId: string,
    gapId: string,
    reason?: string
  ) {
    const pathwayRef = doc(db, 'patientCarePathways', pathwayId);
    const pathwayDoc = await getDoc(pathwayRef);
    
    if (!pathwayDoc.exists()) throw new Error('Pathway not found');

    const pathway = pathwayDoc.data() as PatientCarePathway;
    const gapIndex = pathway.careGaps.findIndex(gap => gap.id === gapId);
    
    if (gapIndex === -1) throw new Error('Care gap not found');

    const updatedGaps = [...pathway.careGaps];
    updatedGaps[gapIndex] = {
      ...updatedGaps[gapIndex],
      status: 'closed',
      closureHistory: [
        ...updatedGaps[gapIndex].closureHistory,
        {
          status: 'closed',
          reason,
          timestamp: new Date().toISOString()
        }
      ],
      updatedAt: new Date().toISOString()
    };

    await updateDoc(pathwayRef, {
      careGaps: updatedGaps,
      updatedAt: new Date().toISOString()
    });
  },

  // Create a new recommendation for a cohort
  async createCohortRecommendation(
    cohortId: string,
    recommendation: Omit<Recommendation, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(
      collection(db, `cohortMetrics/${cohortId}/recommendations`),
      {
        ...recommendation,
        status: 'active',
        createdAt: now,
        updatedAt: now
      }
    );
    return docRef.id;
  },

  // Update cohort metrics
  async updateCohortMetrics(cohortId: string, updates: Partial<CohortMetrics>) {
    const cohortRef = doc(db, 'cohortMetrics', cohortId);
    await updateDoc(cohortRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  // Add patient to cohort
  async addPatientToCohort(
    cohortId: string,
    patientId: string,
    initialRiskLevel: 'high' | 'medium' | 'low'
  ) {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // Create patient care pathway
    const pathwayRef = doc(collection(db, 'patientCarePathways'));
    batch.set(pathwayRef, {
      patientId,
      cohortId,
      riskLevel: initialRiskLevel,
      riskHistory: [{
        level: initialRiskLevel,
        timestamp: now
      }],
      careGaps: [],
      activeRecommendations: [],
      createdAt: now,
      updatedAt: now
    });

    // Update cohort metrics
    const cohortRef = doc(db, 'cohortMetrics', cohortId);
    batch.update(cohortRef, {
      totalPatients: increment(1),
      [`riskProfile.${initialRiskLevel}`]: increment(1),
      updatedAt: now
    });

    await batch.commit();
    return pathwayRef.id;
  },

  // Remove patient from cohort
  async removePatientFromCohort(cohortId: string, patientId: string) {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // Get patient's pathway
    const pathwaysSnapshot = await getDocs(
      query(
        collection(db, 'patientCarePathways'),
        where('patientId', '==', patientId),
        where('cohortId', '==', cohortId)
      )
    );

    if (pathwaysSnapshot.empty) {
      throw new Error('Patient not found in cohort');
    }

    const pathway = pathwaysSnapshot.docs[0].data() as PatientCarePathway;

    // Update cohort metrics
    const cohortRef = doc(db, 'cohortMetrics', cohortId);
    batch.update(cohortRef, {
      totalPatients: increment(-1),
      [`riskProfile.${pathway.riskLevel}`]: increment(-1),
      updatedAt: now
    });

    // Delete pathway
    batch.delete(doc(db, 'patientCarePathways', pathwaysSnapshot.docs[0].id));

    await batch.commit();
  },

  // Get high-risk patients in cohort
  async getHighRiskPatients(cohortId: string): Promise<PatientCarePathway[]> {
    const snapshot = await getDocs(
      query(
        collection(db, 'patientCarePathways'),
        where('cohortId', '==', cohortId),
        where('riskLevel', '==', 'high')
      )
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PatientCarePathway[];
  },

  // Add care gap to patient pathway
  async addCareGap(
    pathwayId: string,
    careGap: Omit<CareGap, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'closureHistory'>
  ) {
    const pathwayRef = doc(db, 'patientCarePathways', pathwayId);
    const pathwayDoc = await getDoc(pathwayRef);
    
    if (!pathwayDoc.exists()) throw new Error('Pathway not found');

    const pathway = pathwayDoc.data() as PatientCarePathway;
    const now = new Date().toISOString();
    
    const newGap: CareGap = {
      id: crypto.randomUUID(),
      ...careGap,
      status: 'open',
      closureHistory: [{
        status: 'open',
        timestamp: now
      }],
      createdAt: now,
      updatedAt: now
    };

    await updateDoc(pathwayRef, {
      careGaps: [...pathway.careGaps, newGap],
      updatedAt: now
    });

    // Update cohort metrics
    const cohortRef = doc(db, 'cohortMetrics', pathway.cohortId);
    await updateDoc(cohortRef, {
      careGaps: increment(1),
      updatedAt: now
    });

    return newGap.id;
  },

  // Get cohort summary
  async getCohortSummary(cohortId: string) {
    const cohortDoc = await getDoc(doc(db, 'cohortMetrics', cohortId));
    if (!cohortDoc.exists()) throw new Error('Cohort not found');

    const metrics = cohortDoc.data() as CohortMetrics;
    const recommendations = await this.getCohortRecommendations(cohortId);
    const highRiskPatients = await this.getHighRiskPatients(cohortId);

    return {
      metrics,
      activeRecommendations: recommendations.filter(r => r.status === 'active'),
      highRiskPatientCount: highRiskPatients.length,
      adherenceRate: metrics.adherence,
      lastUpdated: metrics.updatedAt
    };
  },

  // Subscribe to cohort updates
  subscribeToUpdates(cohortId: string, callback: (metrics: CohortMetrics) => void) {
    return onSnapshot(doc(db, 'cohortMetrics', cohortId), (doc) => {
      if (doc.exists()) {
        callback(doc.data() as CohortMetrics);
      }
    });
  },

  // Intervention Tracking Methods
  async addIntervention(
    pathwayId: string,
    intervention: Omit<Intervention, 'id' | 'outcomes' | 'createdAt' | 'updatedAt'>
  ) {
    const pathwayRef = doc(db, 'patientCarePathways', pathwayId);
    const now = new Date().toISOString();
    
    const newIntervention: Intervention = {
      id: crypto.randomUUID(),
      ...intervention,
      outcomes: [],
      createdAt: now,
      updatedAt: now
    };

    await updateDoc(pathwayRef, {
      interventions: arrayUnion(newIntervention),
      updatedAt: now
    });

    return newIntervention.id;
  },

  async recordInterventionOutcome(
    pathwayId: string,
    interventionId: string,
    metric: string,
    value: number
  ) {
    const pathwayRef = doc(db, 'patientCarePathways', pathwayId);
    const pathwayDoc = await getDoc(pathwayRef);
    
    if (!pathwayDoc.exists()) throw new Error('Pathway not found');

    const pathway = pathwayDoc.data();
    const intervention = pathway.interventions.find((i: Intervention) => i.id === interventionId);
    
    if (!intervention) throw new Error('Intervention not found');

    const now = new Date().toISOString();
    intervention.outcomes.push({
      metric,
      value,
      timestamp: now
    });
    intervention.updatedAt = now;

    await updateDoc(pathwayRef, {
      interventions: pathway.interventions,
      updatedAt: now
    });
  },

  // Care Pathway Template Methods
  async createPathwayTemplate(
    template: Omit<CarePathwayTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'pathwayTemplates'), {
      ...template,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async applyTemplateToPatient(templateId: string, pathwayId: string) {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    const templateDoc = await getDoc(doc(db, 'pathwayTemplates', templateId));
    const pathwayDoc = await getDoc(doc(db, 'patientCarePathways', pathwayId));

    if (!templateDoc.exists()) throw new Error('Template not found');
    if (!pathwayDoc.exists()) throw new Error('Pathway not found');

    const template = templateDoc.data() as CarePathwayTemplate;
    const pathway = pathwayDoc.data() as PatientCarePathway;

    // Add template care gaps
    const newGaps = template.careGaps.map(gap => ({
      id: crypto.randomUUID(),
      ...gap,
      status: 'open',
      closureHistory: [{
        status: 'open',
        timestamp: now
      }],
      createdAt: now,
      updatedAt: now
    }));

    batch.update(doc(db, 'patientCarePathways', pathwayId), {
      careGaps: [...pathway.careGaps, ...newGaps],
      updatedAt: now
    });

    await batch.commit();
  },

  // Quality Metrics Methods
  async updateQualityMetric(
    cohortId: string,
    metricId: string,
    value: number
  ) {
    const metricRef = doc(db, 'cohortMetrics', cohortId, 'qualityMetrics', metricId);
    const now = new Date().toISOString();

    const metricDoc = await getDoc(metricRef);
    if (!metricDoc.exists()) throw new Error('Metric not found');

    const metric = metricDoc.data() as QualityMetric;

    await updateDoc(metricRef, {
      current: value,
      history: [
        ...metric.history,
        { value, timestamp: now }
      ],
      updatedAt: now
    });
  },

  async getQualityMetrics(cohortId: string): Promise<QualityMetric[]> {
    const snapshot = await getDocs(
      collection(db, 'cohortMetrics', cohortId, 'qualityMetrics')
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as QualityMetric[];
  },

  // Reporting Methods
  async generateCohortReport(cohortId: string, timeframe: 'week' | 'month' | 'quarter' | 'year') {
    const cohort = await this.getCohortSummary(cohortId);
    const qualityMetrics = await this.getQualityMetrics(cohortId);
    const highRiskPatients = await this.getHighRiskPatients(cohortId);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (timeframe) {
      case 'week': startDate.setDate(startDate.getDate() - 7); break;
      case 'month': startDate.setMonth(startDate.getMonth() - 1); break;
      case 'quarter': startDate.setMonth(startDate.getMonth() - 3); break;
      case 'year': startDate.setFullYear(startDate.getFullYear() - 1); break;
    }

    // Get interventions in date range
    const interventions = await this.getInterventionsInDateRange(cohortId, startDate, endDate);

    return {
      timeframe,
      generatedAt: new Date().toISOString(),
      cohortMetrics: cohort.metrics,
      qualityMetrics: qualityMetrics.map(metric => ({
        name: metric.name,
        current: metric.current,
        target: metric.target,
        trend: metric.history.slice(-5)
      })),
      riskProfile: {
        highRiskCount: highRiskPatients.length,
        riskTransitions: await this.getRiskTransitions(cohortId, startDate, endDate)
      },
      interventions: {
        total: interventions.length,
        byType: groupInterventionsByType(interventions),
        outcomes: summarizeInterventionOutcomes(interventions)
      },
      careGaps: {
        open: cohort.metrics.careGaps,
        closedInPeriod: await getClosedGapsInDateRange(cohortId, startDate, endDate)
      }
    };
  },

  // Analyze intervention effectiveness
  async analyzeInterventionEffectiveness(
    cohortId: string,
    interventionType: string,
    timeframe: 'month' | 'quarter' | 'year'
  ): Promise<InterventionAnalysis> {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case 'month': startDate.setMonth(endDate.getMonth() - 1); break;
      case 'quarter': startDate.setMonth(endDate.getMonth() - 3); break;
      case 'year': startDate.setFullYear(endDate.getFullYear() - 1); break;
    }

    // Get all interventions of this type in the timeframe
    const interventions = await this.getInterventionsInDateRange(
      cohortId,
      startDate,
      endDate,
      interventionType
    );

    // Calculate success metrics
    const successMetrics = this.calculateInterventionSuccess(interventions);
    
    // Analyze by patient segment
    const segmentAnalysis = await this.analyzeByPatientSegment(
      cohortId,
      interventions
    );

    // Generate recommendations
    const recommendations = this.generateInterventionRecommendations(
      successMetrics,
      segmentAnalysis
    );

    return {
      interventionId: interventions[0]?.id,
      type: interventionType,
      successRate: successMetrics.overallSuccessRate,
      averageTimeToOutcome: successMetrics.averageTimeToOutcome,
      costEffectiveness: successMetrics.costEffectiveness,
      outcomes: successMetrics.outcomes,
      patientSegments: segmentAnalysis,
      recommendations
    };
  },

  // Calculate intervention success metrics
  private calculateInterventionSuccess(
    interventions: Intervention[]
  ) {
    const completedInterventions = interventions.filter(
      i => i.status === 'completed'
    );

    const successfulInterventions = completedInterventions.filter(i => 
      i.outcomes.some(o => o.value > 0)
    );

    const overallSuccessRate = 
      (successfulInterventions.length / completedInterventions.length) * 100;

    // Calculate average time to outcome
    const timesToOutcome = completedInterventions.map(i => {
      const startDate = i.startDate ? new Date(i.startDate) : new Date();
      const endDate = i.endDate ? new Date(i.endDate) : new Date();
      return endDate.getTime() - startDate.getTime();
    });

    const averageTimeToOutcome = 
      timesToOutcome.reduce((a, b) => a + b, 0) / timesToOutcome.length;

    // Calculate outcomes by metric
    const outcomes = this.aggregateOutcomesByMetric(successfulInterventions);

    return {
      overallSuccessRate,
      averageTimeToOutcome,
      costEffectiveness: this.calculateCostEffectiveness(interventions),
      outcomes
    };
  },

  // Analyze effectiveness by patient segment
  private async analyzeByPatientSegment(
    cohortId: string,
    interventions: Intervention[]
  ) {
    const segments = [
      { name: 'High Risk', riskLevel: 'high' },
      { name: 'Medium Risk', riskLevel: 'medium' },
      { name: 'Low Risk', riskLevel: 'low' }
    ];

    const analysis = await Promise.all(
      segments.map(async segment => {
        const patientsInSegment = await this.getPatientsByRiskLevel(
          cohortId,
          segment.riskLevel
        );

        const interventionsInSegment = interventions.filter(i =>
          patientsInSegment.some(p => i.patientId === p.id)
        );

        const successRate = this.calculateSuccessRate(interventionsInSegment);

        return {
          segment: segment.name,
          successRate,
          count: interventionsInSegment.length
        };
      })
    );

    return analysis;
  },

  // Calculate ROI and cost effectiveness
  private calculateCostEffectiveness(interventions: Intervention[]): number {
    const totalCost = interventions.reduce((sum, i) => sum + (i.cost || 0), 0);
    const successfulOutcomes = interventions.filter(i => 
      i.outcomes.some(o => o.value > 0)
    ).length;

    return totalCost > 0 ? successfulOutcomes / totalCost : 0;
  },

  // Generate recommendations based on analysis
  private generateInterventionRecommendations(
    metrics: any,
    segmentAnalysis: any[]
  ): string[] {
    const recommendations: string[] = [];

    // Success rate recommendations
    if (metrics.overallSuccessRate < 50) {
      recommendations.push(
        'Consider reviewing intervention criteria and implementation strategy'
      );
    }

    // Time to outcome recommendations
    if (metrics.averageTimeToOutcome > 30 * 24 * 60 * 60 * 1000) { // 30 days
      recommendations.push(
        'Investigate opportunities to accelerate intervention outcomes'
      );
    }

    // Segment-specific recommendations
    segmentAnalysis.forEach(segment => {
      if (segment.successRate < metrics.overallSuccessRate) {
        recommendations.push(
          `Review intervention approach for ${segment.segment} patients`
        );
      }
    });

    // Cost effectiveness recommendations
    if (metrics.costEffectiveness < 0.5) {
      recommendations.push(
        'Evaluate cost structure and identify optimization opportunities'
      );
    }

    return recommendations;
  },

  // Get detailed effectiveness metrics for an intervention
  async getInterventionEffectiveness(
    interventionId: string
  ): Promise<InterventionEffectiveness> {
    const intervention = await this.getIntervention(interventionId);
    const outcomes = intervention.outcomes;
    
    // Calculate improvement
    const baselineValue = outcomes[0]?.value || 0;
    const currentValue = outcomes[outcomes.length - 1]?.value || 0;
    const improvement = ((currentValue - baselineValue) / baselineValue) * 100;

    // Calculate time to improvement
    const startDate = new Date(intervention.startDate);
    const firstImprovement = outcomes.find(o => o.value > baselineValue);
    const timeToImprovement = firstImprovement
      ? new Date(firstImprovement.timestamp).getTime() - startDate.getTime()
      : 0;

    return {
      id: intervention.id,
      type: intervention.type,
      targetMetric: outcomes[0]?.metric || '',
      baselineValue,
      currentValue,
      improvement,
      timeToImprovement,
      cost: intervention.cost || 0,
      roi: this.calculateROI(intervention),
      patientCount: 1,
      successfulPatients: improvement > 0 ? 1 : 0
    };
  },

  async getInterventionsInDateRange(
    cohortId: string,
    startDate: Date,
    endDate: Date,
    interventionType?: string
  ): Promise<Intervention[]> {
    const snapshot = await getDocs(
      query(
        collection(db, 'interventions'),
        where('cohortId', '==', cohortId),
        where('startDate', '>=', startDate),
        where('startDate', '<=', endDate),
        ...(interventionType ? [where('type', '==', interventionType)] : [])
      )
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Intervention[];
  },

  async getRiskTransitions(
    cohortId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ from: string; to: string; count: number }[]> {
    const pathways = await getDocs(
      query(
        collection(db, 'patientCarePathways'),
        where('cohortId', '==', cohortId)
      )
    );
    
    const transitions = pathways.docs
      .map(doc => doc.data())
      .flatMap(pathway => {
        const relevantHistory = pathway.riskHistory.filter(h => 
          new Date(h.timestamp) >= startDate && 
          new Date(h.timestamp) <= endDate
        );
        return relevantHistory.slice(1).map((h, i) => ({
          from: relevantHistory[i].level,
          to: h.level,
          timestamp: h.timestamp
        }));
      })
      .reduce((acc, t) => {
        const key = `${t.from}-${t.to}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(transitions).map(([key, count]) => {
      const [from, to] = key.split('-');
      return { from, to, count: count as number };
    });
  },

  async getClosedGapsInDateRange(
    cohortId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const pathways = await getDocs(
      query(collection(db, 'patientCarePathways'), where('cohortId', '==', cohortId))
    );
    
    return pathways.docs
      .map(doc => doc.data())
      .flatMap(pathway => pathway.careGaps)
      .filter(gap => 
        gap.status === 'closed' && 
        new Date(gap.closureHistory[gap.closureHistory.length - 1].timestamp) >= startDate &&
        new Date(gap.closureHistory[gap.closureHistory.length - 1].timestamp) <= endDate
      ).length;
  },

  async getIntervention(interventionId: string): Promise<Intervention> {
    const snapshot = await getDocs(
      query(
        collection(db, 'interventions'),
        where('id', '==', interventionId),
        limit(1)
      )
    );
    
    if (snapshot.empty) throw new Error('Intervention not found');
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Intervention;
  },

  private calculateROI(intervention: Intervention): number {
    const cost = intervention.cost || 0;
    const outcomes = intervention.outcomes;
    const value = outcomes.length > 0 ? outcomes[outcomes.length - 1].value : 0;
    
    return cost > 0 ? ((value - cost) / cost) * 100 : 0;
  },

  private aggregateOutcomesByMetric(interventions: Intervention[]) {
    return interventions
      .flatMap(i => i.outcomes)
      .reduce((acc, outcome) => {
        if (!acc[outcome.metric]) {
          acc[outcome.metric] = {
            total: 0,
            count: 0
          };
        }
        acc[outcome.metric].total += outcome.value;
        acc[outcome.metric].count++;
        return acc;
      }, {} as Record<string, { total: number; count: number }>);
  }
}; 