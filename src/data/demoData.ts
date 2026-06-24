import type { AidPool, Student } from '../types';

export const demoStudents: Student[] = [
  {
    id: 'student_ada',
    name: 'Ada Okafor',
    university: 'Lagos State University',
    department: 'Computer Science',
    verified: true,
    needBand: 'high',
    credentialCommitment: 'cred_7f91_ada_lasu'
  },
  {
    id: 'student_timi',
    name: 'Timi Adeyemi',
    university: 'Lagos State University',
    department: 'Computer Science',
    verified: false,
    needBand: 'high',
    credentialCommitment: 'pending'
  }
];

export const demoAidPools: AidPool[] = [
  {
    id: 'pool_emergency',
    name: 'Emergency Aid Grant',
    type: 'emergency-aid',
    departmentRule: 'any',
    needRule: 'medium-or-high',
    balanceXlm: 2500,
    awardXlm: 250
  },
  {
    id: 'pool_cs_scholarship',
    name: 'Computer Science Scholarship',
    type: 'scholarship',
    departmentRule: 'Computer Science',
    needRule: 'any',
    balanceXlm: 5000,
    awardXlm: 500
  }
];
