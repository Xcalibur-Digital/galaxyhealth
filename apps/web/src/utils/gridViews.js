export const SAVED_VIEWS = {
  CARE_GAPS: 'care_gaps',
  HIGH_RISK: 'high_risk',
  RECENT_VISITS: 'recent_visits',
  MISSING_AWV: 'missing_awv',
  UNCONTROLLED_CONDITIONS: 'uncontrolled_conditions'
};

export const getFilterModelForView = (viewId) => {
  switch (viewId) {
    case SAVED_VIEWS.CARE_GAPS:
      return {
        careGaps: {
          type: 'greaterThan',
          filter: 0
        }
      };
    case SAVED_VIEWS.HIGH_RISK:
      return {
        riskLevel: {
          values: ['high']
        }
      };
    case SAVED_VIEWS.RECENT_VISITS:
      return {
        lastVisit: {
          type: 'greaterThan',
          dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
    case SAVED_VIEWS.MISSING_AWV:
      return {
        awvStatus: {
          values: ['missing', 'overdue']
        }
      };
    case SAVED_VIEWS.UNCONTROLLED_CONDITIONS:
      return {
        conditions: {
          type: 'contains',
          filter: 'uncontrolled'
        }
      };
    default:
      return {};
  }
}; 