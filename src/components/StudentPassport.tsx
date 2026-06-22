import { ShieldCheck } from 'lucide-react';
import type { Student } from '../types';
import { Panel, StatusChip } from './ui';

export function StudentPassport({ student }: { student: Student }) {
  return (
    <Panel>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-800">Student Passport</p>
          <h2 className="mt-2 text-xl font-bold">UniProof Passport</h2>
        </div>
        <ShieldCheck className="size-7 text-emerald-700" />
      </div>
      <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-900">{student.name}</p>
        <p className="mt-1 text-sm text-emerald-800">Private eligibility credential</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <StatusChip tone="good">Verified</StatusChip>
        <StatusChip tone="good">Eligible</StatusChip>
        <StatusChip>Identity hidden</StatusChip>
      </div>
    </Panel>
  );
}
