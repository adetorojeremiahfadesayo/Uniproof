import type { Student } from '../types';
import { StatusChip } from './ui';

export function UniversityPanel({
  students,
  selectedStudent,
  onSelectStudent
}: {
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (studentId: string) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">Choose a student to verify their eligibility for aid.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {students.map((student) => {
          const selected = student.id === selectedStudent.id;

          return (
            <button
              className={`rounded-xl border-2 p-4 text-left transition ${
                selected
                  ? 'border-emerald-400 bg-emerald-50 shadow-[0_0_0_2px_rgba(16,185,129,0.12)]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
              key={student.id}
              onClick={() => onSelectStudent(student.id)}
              type="button"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {student.name.split(' ').map((part) => part[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{student.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{student.department}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusChip tone={student.verified ? 'good' : 'warn'}>{student.verified ? 'Verified' : 'Pending'}</StatusChip>
                    <StatusChip tone={student.needBand === 'high' ? 'warn' : 'neutral'}>{student.needBand.toUpperCase()} NEED</StatusChip>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-800">{selectedStudent.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            Student ID: UNILAG-23-45678 <span className="px-2 text-slate-300">|</span> {selectedStudent.department}
          </p>
          <p className="mt-1 text-sm text-slate-600">{selectedStudent.university}</p>
        </div>
        <button className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
          View Passport
        </button>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="font-semibold text-slate-500">Credential</dt>
          <dd className="mt-1 truncate font-mono text-xs text-slate-800">{selectedStudent.credentialCommitment}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="font-semibold text-slate-500">Need band</dt>
          <dd className="mt-1 font-bold capitalize text-slate-800">{selectedStudent.needBand}</dd>
        </div>
      </dl>
    </div>
  );
}
