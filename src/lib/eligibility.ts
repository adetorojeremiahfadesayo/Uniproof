import type { AidPool, ProofStatus, Student } from '../types';

export function createClaimNullifier(student: Student, pool: AidPool) {
  return `claim_${student.id.replace('student_', '')}_${pool.id.replace('pool_', '')}`;
}

export function isEligibleForPool(student: Student, pool: AidPool) {
  const departmentMatches = pool.departmentRule === 'any' || pool.departmentRule === student.department;
  const needMatches =
    pool.needRule === 'any' ||
    student.needBand === pool.needRule ||
    (pool.needRule === 'medium-or-high' && (student.needBand === 'medium' || student.needBand === 'high'));

  return departmentMatches && needMatches;
}

export function createProofStatus(student: Student, pool: AidPool, usedNullifiers: string[]): ProofStatus {
  const nullifier = createClaimNullifier(student, pool);
  const verified = student.verified;
  const eligible = isEligibleForPool(student, pool);
  const claimNotUsed = !usedNullifiers.includes(nullifier);

  return {
    verified,
    eligible,
    claimNotUsed,
    canReleaseFunds: verified && eligible && claimNotUsed,
    nullifier
  };
}
