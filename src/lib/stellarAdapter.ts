import type { AidPool, ProofStatus } from '../types';
import { applyClaim, fundPool } from './claims';

export type StellarTransaction = {
  network: 'Stellar testnet';
  hash: string;
  status: 'success' | 'rejected';
};

export function createDemoTransaction(prefix: string, status: StellarTransaction['status']): StellarTransaction {
  return {
    network: 'Stellar testnet',
    hash: `${prefix}_${Date.now().toString(16)}`,
    status
  };
}

export function submitDemoFunding(pool: AidPool, amountXlm: number) {
  return {
    pool: fundPool(pool, amountXlm),
    transaction: createDemoTransaction('fund', 'success')
  };
}

export function submitDemoClaim(pool: AidPool, proof: ProofStatus) {
  const result = applyClaim(pool, proof);

  return {
    ...result,
    transaction: createDemoTransaction('claim', result.status === 'released' ? 'success' : 'rejected')
  };
}
