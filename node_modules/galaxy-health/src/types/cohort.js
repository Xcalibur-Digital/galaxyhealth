/**
 * @typedef {Object} Intervention
 * @property {string} id
 * @property {'medication'|'procedure'|'referral'|'education'|'monitoring'} type
 * @property {string} description
 * @property {string} targetOutcome
 * @property {'planned'|'in-progress'|'completed'|'cancelled'} status
 * @property {string} startDate
 * @property {string} [endDate]
 * @property {Array<{metric: string, value: number, timestamp: string}>} outcomes
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export {}; 