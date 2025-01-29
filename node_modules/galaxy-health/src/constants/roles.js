export const USER_ROLES = {
  ADMIN: 'admin',
  NURSE: 'nurse',
  PHYSICIAN: 'physician',
  PRACTICE_STAFF: 'practice_staff',
  ANALYST: 'analyst',
  USER: 'user'
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.NURSE]: 'Nurse',
  [USER_ROLES.PHYSICIAN]: 'Physician',
  [USER_ROLES.PRACTICE_STAFF]: 'Practice Staff',
  [USER_ROLES.ANALYST]: 'Analyst',
  [USER_ROLES.USER]: 'Basic User'
};

export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: 'red',
  [USER_ROLES.NURSE]: 'blue',
  [USER_ROLES.PHYSICIAN]: 'green',
  [USER_ROLES.PRACTICE_STAFF]: 'violet',
  [USER_ROLES.ANALYST]: 'cyan',
  [USER_ROLES.USER]: 'gray'
}; 