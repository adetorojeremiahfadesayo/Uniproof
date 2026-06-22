import type { AidPool, ProofStatus } from '../types';

export function fundPool(pool: AidPool, amountXlm: number): AidPool {
  return {
    ...pool,
    balanceXlm: pool.balanceXlm + amountXlm
  };
}

export function applyClaim(pool: AidPool, proof: ProofStatus) {
  if (!proof.canReleaseFunds || pool.balanceXlm < pool.awardXlm) {
    return {
      pool,
      usedNullifier: undefined,
      status: 'rejected' as const
    };
  }

  return {
    pool: {
      ...pool,
      balanceXlm: pool.balanceXlm - pool.awardXlm
    },
    usedNullifier: proof.nullifier,
    status: 'released' as const
  };
}
