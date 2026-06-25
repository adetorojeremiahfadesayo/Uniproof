import { ShieldCheck } from 'lucide-react';
import type { ContractState } from '../lib/contractAdapter';
import type { AidPool, ProofStatus } from '../types';
import { StatusChip } from './ui';

export function ContractGuard({
  contractState,
  pool,
  proof
}: {
  contractState: ContractState;
  pool: AidPool;
  proof: ProofStatus;
}) {
  const contractPool = contractState.pools[pool.id];
  const nullifierStored = contractState.usedNullifiers.includes(proof.nullifier);
  const lastReceipt = contractState.lastReceipt;

  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm text-slate-600">
        <ShieldCheck className="size-4 text-emerald-600" />
        The Stellar smart contract evaluates proof, balance, and nullifier state.
      </p>
      <dl className="grid gap-3 text-sm md:grid-cols-2">
        <GuardRow label="WASM build" value={contractState.contractName} status="ready" />
        <GuardRow label="Pool balance" value={`${contractPool?.balanceXlm ?? 0} XLM`} status="funded" />
        <GuardRow label="Proof gate" value={proof.verified && proof.eligible ? 'accepted' : 'rejected'} status={proof.verified && proof.eligible ? 'accepted' : 'rejected'} />
        <GuardRow label="Nullifier" value={nullifierStored ? 'stored' : 'unused'} status={nullifierStored ? 'locked' : 'open'} />
      </dl>

      {lastReceipt ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-500">Last contract receipt</p>
            <StatusChip tone={lastReceipt.status === 'released' ? 'good' : 'warn'}>{lastReceipt.status}</StatusChip>
          </div>
          <p className="mt-2 text-sm text-slate-700">
            {lastReceipt.status === 'released'
              ? `${lastReceipt.amountXlm} XLM accepted by ${lastReceipt.transaction.network}`
              : lastReceipt.reason}
          </p>
          <p className="mt-3 break-all font-mono text-xs text-slate-500">{lastReceipt.transaction.hash}</p>
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          Waiting for a donor funding or student claim transaction.
        </p>
      )}
    </div>
  );
}

function GuardRow({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <dt className="font-semibold text-slate-600">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2">
        <span className="truncate font-mono text-xs text-slate-500">{value}</span>
        <StatusChip tone={status === 'rejected' || status === 'locked' ? 'warn' : 'good'}>{status}</StatusChip>
      </dd>
    </div>
  );
}
