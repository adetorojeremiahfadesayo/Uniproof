import { describe, expect, it } from 'vitest';
import { createProofStatus } from '../lib/eligibility';
import { demoAidPools, demoStudents } from '../data/demoData';

describe('createProofStatus', () => {
  it('marks a verified eligible student as claimable', () => {
    const proof = createProofStatus(demoStudents[0], demoAidPools[0], []);

    expect(proof.verified).toBe(true);
    expect(proof.eligible).toBe(true);
    expect(proof.claimNotUsed).toBe(true);
    expect(proof.canReleaseFunds).toBe(true);
  });

  it('blocks a student who has already claimed the same pool', () => {
    const proof = createProofStatus(demoStudents[0], demoAidPools[0], ['claim_maya_emergency']);

    expect(proof.claimNotUsed).toBe(false);
    expect(proof.canReleaseFunds).toBe(false);
  });

  it('blocks an unverified student even when pool rules match', () => {
    const proof = createProofStatus(demoStudents[1], demoAidPools[0], []);

    expect(proof.verified).toBe(false);
    expect(proof.canReleaseFunds).toBe(false);
  });
});
