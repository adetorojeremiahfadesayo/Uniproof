import type { AidPool, ProofStatus } from '../types';
import { createDemoTransaction, type StellarTransaction } from './stellarAdapter';

export type ContractPool = {
  admin: string;
  id: string;
  name: string;
  balanceXlm: number;
  awardXlm: number;
  active: boolean;
};

export type ContractReceipt = {
  poolId: string;
  recipient: string;
  nullifier: string;
  amountXlm: number;
  status: 'released' | 'rejected';
  reason?: 'proof rejected' | 'claim already used' | 'insufficient pool balance' | 'pool inactive' | 'pool missing';
  transaction: StellarTransaction;
};

export type ContractState = {
  contractName: 'uniproof_pool';
  wasmPath: string;
  pools: Record<string, ContractPool>;
  usedNullifiers: string[];
  lastReceipt?: ContractReceipt;
};

export function createContractState(pools: AidPool[]): ContractState {
  return {
    contractName: 'uniproof_pool',
    wasmPath: 'target/wasm32v1-none/release/uniproof_pool.wasm',
    pools: Object.fromEntries(
      pools.map((pool) => [
        pool.id,
        {
          admin: 'GB...I3ZL',
          id: pool.id,
          name: pool.name,
          balanceXlm: pool.balanceXlm,
          awardXlm: pool.awardXlm,
          active: true
        }
      ])
    ),
    usedNullifiers: []
  };
}

export function syncPoolsFromContract(pools: AidPool[], contractState: ContractState): AidPool[] {
  return pools.map((pool) => ({
    ...pool,
    balanceXlm: contractState.pools[pool.id]?.balanceXlm ?? pool.balanceXlm
  }));
}

export function fundContractPool(contractState: ContractState, poolId: string, amountXlm: number) {
  const pool = contractState.pools[poolId];

  if (!pool || amountXlm <= 0) {
    return reject(contractState, poolId, '', '', 0, 'pool missing', 'fund');
  }

  const updatedPool = {
    ...pool,
    balanceXlm: pool.balanceXlm + amountXlm
  };

  const receipt: ContractReceipt = {
    poolId,
    recipient: pool.admin,
    nullifier: '',
    amountXlm,
    status: 'released',
    transaction: createDemoTransaction('fund_contract', 'success')
  };

  return {
    state: {
      ...contractState,
      pools: {
        ...contractState.pools,
        [poolId]: updatedPool
      },
      lastReceipt: receipt
    },
    receipt
  };
}

export function claimFromContract(
  contractState: ContractState,
  poolId: string,
  proof: ProofStatus,
  recipient: string
) {
  const pool = contractState.pools[poolId];

  if (!pool) {
    return reject(contractState, poolId, recipient, proof.nullifier, 0, 'pool missing', 'claim');
  }

  if (!proof.verified || !proof.eligible) {
    return reject(contractState, poolId, recipient, proof.nullifier, pool.awardXlm, 'proof rejected', 'claim');
  }

  if (!pool.active) {
    return reject(contractState, poolId, recipient, proof.nullifier, pool.awardXlm, 'pool inactive', 'claim');
  }

  if (pool.balanceXlm < pool.awardXlm) {
    return reject(contractState, poolId, recipient, proof.nullifier, pool.awardXlm, 'insufficient pool balance', 'claim');
  }

  if (contractState.usedNullifiers.includes(proof.nullifier)) {
    return reject(contractState, poolId, recipient, proof.nullifier, pool.awardXlm, 'claim already used', 'claim');
  }

  const updatedPool = {
    ...pool,
    balanceXlm: pool.balanceXlm - pool.awardXlm
  };

  const receipt: ContractReceipt = {
    poolId,
    recipient,
    nullifier: proof.nullifier,
    amountXlm: pool.awardXlm,
    status: 'released',
    transaction: createDemoTransaction('claim_contract', 'success')
  };

  return {
    state: {
      ...contractState,
      pools: {
        ...contractState.pools,
        [poolId]: updatedPool
      },
      usedNullifiers: [...contractState.usedNullifiers, proof.nullifier],
      lastReceipt: receipt
    },
    receipt
  };
}

function reject(
  contractState: ContractState,
  poolId: string,
  recipient: string,
  nullifier: string,
  amountXlm: number,
  reason: ContractReceipt['reason'],
  prefix: 'claim' | 'fund'
) {
  const receipt: ContractReceipt = {
    poolId,
    recipient,
    nullifier,
    amountXlm,
    status: 'rejected',
    reason,
    transaction: createDemoTransaction(`${prefix}_contract`, 'rejected')
  };

  return {
    state: {
      ...contractState,
      lastReceipt: receipt
    },
    receipt
  };
}
