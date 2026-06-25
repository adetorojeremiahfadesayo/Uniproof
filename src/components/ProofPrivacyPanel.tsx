import type { AidPool, ProofStatus, Student } from '../types';
import { StatusChip } from './ui';

export function ProofPrivacyPanel({
  student,
  pool,
  proof
}: {
  student: Student;
  pool: AidPool;
  proof: ProofStatus;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">The proof reveals only what is necessary. Private details stay hidden.</p>
      <div className="grid gap-3 lg:grid-cols-3">
        <ProofBucket
          label="Hidden"
          items={[
            `Identity: ${student.name}`,
            `Need band: ${student.needBand}`,
            `Credential: ${student.credentialCommitment}`
          ]}
          tone="warn"
        />
        <ProofBucket
          label="Public"
          items={[`Pool: ${pool.id}`, `Nullifier: ${proof.nullifier}`, `Award: ${pool.awardXlm} XLM`]}
          tone="neutral"
        />
        <ProofBucket
          label="Result"
          items={[
            `Credential ${proof.verified ? 'verified' : 'not verified'}`,
            `Rules ${proof.eligible ? 'matched' : 'rejected'}`,
            `Nullifier ${proof.claimNotUsed ? 'unused' : 'used'}`
          ]}
          tone={proof.canReleaseFunds ? 'good' : 'warn'}
        />
      </div>
    </div>
  );
}

function ProofBucket({
  label,
  items,
  tone
}: {
  label: string;
  items: string[];
  tone: 'good' | 'warn' | 'neutral';
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <StatusChip tone={tone}>{label}</StatusChip>
      </div>
      <ul className="mt-3 grid gap-2 text-sm text-slate-600">
        {items.map((item) => (
          <li className={`break-words font-mono text-xs ${label === 'Hidden' ? 'text-slate-400 line-through' : ''}`} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
