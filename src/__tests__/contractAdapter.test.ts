import { describe, expect, it } from 'vitest';
import { demoAidPools, demoStudents } from '../data/demoData';
import { claimFromContract, createContractState, fundContractPool } from '../lib/contractAdapter';
import { createProofStatus } from '../lib/eligibility';

describe('contract adapter', () => {
  it('funds a pool and releases one verified claim', () => {
    let contractState = createContractState(demoAidPools);
    const pool = demoAidPools[0];

    const funding = fundContractPool(contractState, pool.id, 1000);
    contractState = funding.state;

    expect(contractState.pools[pool.id].balanceXlm).toBe(3500);
    expect(funding.receipt.status).toBe('released');

    const proof = createProofStatus(demoStudents[0], pool, contractState.usedNullifiers);
    const claim = claimFromContract(contractState, pool.id, proof, demoStudents[0].id);

    expect(claim.receipt.status).toBe('released');
    expect(claim.receipt.nullifier).toBe('claim_maya_emergency');
    expect(claim.state.pools[pool.id].balanceXlm).toBe(3250);
    expect(claim.state.usedNullifiers).toContain('claim_maya_emergency');
  });

  it('rejects a duplicate claim nullifier', () => {
    let contractState = createContractState(demoAidPools);
    const pool = demoAidPools[0];
    const firstProof = createProofStatus(demoStudents[0], pool, contractState.usedNullifiers);
    const firstClaim = claimFromContract(contractState, pool.id, firstProof, demoStudents[0].id);
    contractState = firstClaim.state;

    const duplicateProof = createProofStatus(demoStudents[0], pool, []);
    const duplicateClaim = claimFromContract(contractState, pool.id, duplicateProof, demoStudents[0].id);

    expect(duplicateClaim.receipt.status).toBe('rejected');
    expect(duplicateClaim.receipt.reason).toBe('claim already used');
    expect(duplicateClaim.state.pools[pool.id].balanceXlm).toBe(2250);
  });
});
