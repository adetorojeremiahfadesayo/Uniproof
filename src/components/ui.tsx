import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Panel({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 ${className}`}>
      {children}
    </section>
  );
}

export function Button({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none ${className}`}
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
    neutral: 'border-slate-200 bg-slate-100 text-slate-700'
  };

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
