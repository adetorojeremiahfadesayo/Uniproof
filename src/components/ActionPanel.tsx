import { CircleDollarSign, ShieldCheck } from 'lucide-react';
import type { AidPool, ProofStatus } from '../types';
import { Button } from './ui';

export function ActionPanel({
  pool,
  proof,
  onClaim,
  onFund
}: {
  pool: AidPool;
  proof: ProofStatus;
  onClaim: () => void;
  onFund: () => void;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">Complete the claim or add funds to the selected pool.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div
          className={`rounded-xl border-2 p-4 ${
            proof.canReleaseFunds ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 opacity-80'
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className={`size-4 ${proof.canReleaseFunds ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span className="text-sm font-semibold text-slate-700">
              {proof.claimNotUsed ? 'Claim funds' : 'Already claimed'}
            </span>
          </div>
          <p className="mb-3 text-xs text-slate-500">
            {proof.canReleaseFunds
              ? `Release ${pool.awardXlm} XLM from ${pool.name}`
              : proof.claimNotUsed
                ? 'Contract rejected the proof. Funds cannot be released.'
                : 'This passport has already claimed from this pool.'}
          </p>
          <Button className="w-full" data-tour-id="release-funds" onClick={onClaim}>
            Release funds
          </Button>
        </div>

        <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <CircleDollarSign className="size-4 text-emerald-700" />
            <span className="text-sm font-semibold text-slate-700">Add funds</span>
          </div>
          <p className="mb-3 text-xs text-slate-500">Add funds to the {pool.name} pool for eligible students.</p>
          <Button className="w-full bg-white text-emerald-900 ring-1 ring-emerald-800 hover:bg-emerald-50" onClick={onFund}>
            Add 1000 XLM
          </Button>
        </div>
      </div>
    </div>
  );
}
