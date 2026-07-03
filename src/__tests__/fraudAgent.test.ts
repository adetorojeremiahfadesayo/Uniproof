import { describe, expect, it, vi } from 'vitest';
import { demoAidPools, demoStudents } from '../data/demoData';
import { createContractState } from '../lib/contractAdapter';
import { createProofStatus } from '../lib/eligibility';
import {
  createFraudReviewContext,
  createLocalFraudReview,
  requestFraudReview,
  normalizeFraudReview
} from '../lib/fraudAgent';

describe('fraud review agent', () => {
  it('marks a verified, eligible, unused claim as low risk', () => {
    const student = demoStudents.find((item) => item.id === 'student_maya')!;
    const pool = demoAidPools.find((item) => item.id === 'pool_emergency')!;
    const contractState = createContractState(demoAidPools);
    const proof = createProofStatus(student, pool, contractState.usedNullifiers);

    const review = createLocalFraudReview(createFraudReviewContext(student, pool, proof, contractState));

    expect(review.riskLevel).toBe('low');
    expect(review.recommendation).toBe('approve');
    expect(review.provider).toBe('local-fallback');
    expect(review.reasons).toContain('University credential is verified.');
  });

  it('blocks an unverified credential as high risk', () => {
    const student = demoStudents.find((item) => item.id === 'student_leo')!;
    const pool = demoAidPools.find((item) => item.id === 'pool_emergency')!;
    const contractState = createContractState(demoAidPools);
    const proof = createProofStatus(student, pool, contractState.usedNullifiers);

    const review = createLocalFraudReview(createFraudReviewContext(student, pool, proof, contractState));

    expect(review.riskLevel).toBe('high');
    expect(review.recommendation).toBe('block');
    expect(review.reasons).toContain('University credential is pending or unverified.');
  });

  it('blocks a duplicate nullifier as high risk', () => {
    const student = demoStudents.find((item) => item.id === 'student_maya')!;
    const pool = demoAidPools.find((item) => item.id === 'pool_emergency')!;
    const firstState = createContractState(demoAidPools);
    const firstProof = createProofStatus(student, pool, firstState.usedNullifiers);
    const contractState = { ...firstState, usedNullifiers: [firstProof.nullifier] };
    const proof = createProofStatus(student, pool, contractState.usedNullifiers);

    const review = createLocalFraudReview(createFraudReviewContext(student, pool, proof, contractState));

    expect(review.riskLevel).toBe('high');
    expect(review.recommendation).toBe('block');
    expect(review.reasons).toContain('Claim nullifier has already been used.');
  });

  it('falls back locally when the Qwen endpoint is unavailable', async () => {
    const student = demoStudents.find((item) => item.id === 'student_maya')!;
    const pool = demoAidPools.find((item) => item.id === 'pool_emergency')!;
    const contractState = createContractState(demoAidPools);
    const proof = createProofStatus(student, pool, contractState.usedNullifiers);
    const fetcher = vi.fn().mockRejectedValue(new Error('network down'));

    const review = await requestFraudReview(createFraudReviewContext(student, pool, proof, contractState), fetcher);

    expect(review.provider).toBe('local-fallback');
    expect(review.summary).toMatch(/local fallback/i);
  });

  it('normalizes a malformed API response into a safe review', () => {
    const review = normalizeFraudReview({
      riskLevel: 'extreme',
      recommendation: 'wire funds now',
      summary: '',
      reasons: [],
      confidence: 42,
      provider: 'qwen',
      model: 'qwen-plus'
    });

    expect(review.riskLevel).toBe('medium');
    expect(review.recommendation).toBe('review');
    expect(review.summary).toBe('The agent returned an incomplete review. Manual review is recommended.');
    expect(review.confidence).toBe(1);
    expect(review.provider).toBe('qwen');
  });
});
