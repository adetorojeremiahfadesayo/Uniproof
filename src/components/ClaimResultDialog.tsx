import { CheckCircle, X, XCircle } from 'lucide-react';
import { Button } from './ui';

export type ClaimResult = {
  status: 'success' | 'rejected';
  title: string;
  message: string;
  reason: string;
  transactionHash?: string;
};

const confettiPieces = Array.from({ length: 32 }, (_, index) => index);

export function ClaimResultDialog({
  result,
  onClose,
  onReset
}: {
  result: ClaimResult | null;
  onClose: () => void;
  onReset: () => void;
}) {
  if (!result) return null;

  const isSuccess = result.status === 'success';

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm" role="presentation">
      {isSuccess ? <div aria-hidden="true" className="success-glow" /> : null}
      <section
        aria-labelledby="claim-result-title"
        aria-modal="true"
        className={`claim-result-pop relative w-full max-w-md overflow-hidden rounded-2xl border bg-white p-6 text-center shadow-2xl ${
          isSuccess ? 'border-emerald-200' : 'border-red-200'
        }`}
        role="dialog"
      >
        {isSuccess ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {confettiPieces.map((piece) => (
              <span className={`confetti-piece confetti-piece-${piece + 1}`} key={piece} />
            ))}
          </div>
        ) : null}

        <button
          aria-label="Close claim result"
          className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>

        <div
          className={`mx-auto grid size-14 place-items-center rounded-full ${
            isSuccess ? 'success-icon-bounce bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isSuccess ? <CheckCircle className="size-7" /> : <XCircle className="size-7" />}
        </div>

        <p className={`mt-4 text-xs font-bold uppercase tracking-wide ${isSuccess ? 'text-emerald-700' : 'text-red-700'}`}>
          {isSuccess ? 'Confetti success' : 'Rejected claim'}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950" id="claim-result-title">
          {result.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{result.message}</p>

        <div className={`mt-5 rounded-xl border p-4 text-left ${isSuccess ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isSuccess ? 'text-emerald-700' : 'text-red-700'}`}>
            {isSuccess ? 'Why it passed' : 'Reason'}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{result.reason}</p>
          {result.transactionHash ? <p className="mt-3 break-all font-mono text-xs text-slate-500">{result.transactionHash}</p> : null}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-800 transition hover:bg-emerald-50"
            onClick={onReset}
            type="button"
          >
            Try another student
          </button>
          <Button onClick={onClose}>Continue</Button>
        </div>
      </section>
    </div>
  );
}
