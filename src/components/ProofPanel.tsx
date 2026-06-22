import type { AidPool, ProofStatus } from '../types';
import { Button, Panel, StatusChip } from './ui';

export function ProofPanel({ proof, pool, onClaim }: { proof: ProofStatus; pool: AidPool; onClaim: () => void }) {
  return (
    <Panel className="xl:row-span-2">
      <p className="text-sm font-semibold text-emerald-800">Proof Status</p>
      <h2 className="mt-2 text-xl font-bold">Private claim check</h2>
      <div className="mt-5 grid gap-3">
        <ProofRow label="University credential" ok={proof.verified} goodText="Verified" badText="Not verified" />
        <ProofRow label="Program rule match" ok={proof.eligible} goodText="Eligible" badText="Not eligible" />
        <ProofRow label="Nullifier check" ok={proof.claimNotUsed} goodText="Claim not used" badText="Claim used" />
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-500">Selected pool</p>
        <p className="mt-1 font-bold">{pool.name}</p>
        <p className="mt-1 text-sm text-slate-600">Release amount: {pool.awardXlm} XLM</p>
        <p className="mt-3 break-all font-mono text-xs text-slate-500">{proof.nullifier}</p>
      </div>
      <Button className="mt-5 w-full" onClick={onClaim}>
        Release funds
      </Button>
    </Panel>
  );
}

function ProofRow({ label, ok, goodText, badText }: { label: string; ok: boolean; goodText: string; badText: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <StatusChip tone={ok ? 'good' : 'warn'}>{ok ? goodText : badText}</StatusChip>
    </div>
  );
}
