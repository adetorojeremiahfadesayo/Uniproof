import type { AidPool, Student } from '../types';

export const demoStudents: Student[] = [
  {
    id: 'student_maya',
    name: 'Maya Chen',
    university: 'Global Tech University',
    department: 'Computer Science',
    verified: true,
    needBand: 'high',
    credentialCommitment: 'cred_7f91_maya_gtu'
  },
  {
    id: 'student_leo',
    name: 'Leo Martin',
    university: 'Global Tech University',
    department: 'Computer Science',
    verified: false,
    needBand: 'high',
    credentialCommitment: 'pending'
  },
  {
    id: 'student_sofia',
    name: 'Sofia Patel',
    university: 'Global Arts University',
    department: 'Public Policy',
    verified: true,
    needBand: 'low',
    credentialCommitment: 'cred_3a18_sofia_gau'
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
