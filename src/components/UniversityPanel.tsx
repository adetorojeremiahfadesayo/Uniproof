import type { Student } from '../types';
import { Panel, StatusChip } from './ui';

export function UniversityPanel({ student }: { student: Student }) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-800">University Admin</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">Verified Students</h2>
        </div>
        <StatusChip tone="good">Verified</StatusChip>
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 p-4">
        <p className="text-lg font-bold">{student.name}</p>
        <p className="mt-1 text-sm text-slate-600">{student.department}</p>
        <p className="mt-1 text-sm text-slate-600">{student.university}</p>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-slate-50 p-3">
          <dt className="font-semibold text-slate-500">Credential</dt>
          <dd className="mt-1 truncate font-mono text-xs text-slate-800">{student.credentialCommitment}</dd>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <dt className="font-semibold text-slate-500">Need band</dt>
          <dd className="mt-1 font-bold capitalize text-slate-800">{student.needBand}</dd>
        </div>
      </dl>
    </Panel>
  );
}
