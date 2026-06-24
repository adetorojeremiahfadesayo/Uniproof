import { describe, expect, it } from 'vitest';
import { applyClaim, fundPool } from '../lib/claims';
import { demoAidPools, demoStudents } from '../data/demoData';
import { createProofStatus } from '../lib/eligibility';

describe('claim state', () => {
  it('releases funds and records nullifier for a valid proof', () => {
    const pool = demoAidPools[0];
    const proof = createProofStatus(demoStudents[0], pool, []);

    const result = applyClaim(pool, proof);

    expect(result.pool.balanceXlm).toBe(2250);
    expect(result.usedNullifier).toBe('claim_ada_emergency');
    expect(result.status).toBe('released');
  });

  it('does not release funds when proof is not claimable', () => {
    const pool = demoAidPools[0];
    const proof = createProofStatus(demoStudents[1], pool, []);

    const result = applyClaim(pool, proof);

    expect(result.pool.balanceXlm).toBe(2500);
    expect(result.status).toBe('rejected');
  });

  it('adds donor funding to the selected pool', () => {
    const pool = fundPool(demoAidPools[0], 1000);

    expect(pool.balanceXlm).toBe(3500);
  });
});
