import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Panel({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

export function Button({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusChip({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'good' | 'warn' | 'neutral' }>) {
  const tones = {
    good: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-800',
    neutral: 'border-slate-200 bg-slate-50 text-slate-700'
  };

  return <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
