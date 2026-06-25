import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

export type StepState = 'pending' | 'active' | 'completed';

export function StepCard({
  stepNumber,
  title,
  description,
  state,
  icon,
  summary,
  children
}: {
  stepNumber: number;
  title: string;
  description: string;
  state: StepState;
  icon: ReactNode;
  summary?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border bg-white transition ${
        state === 'active'
          ? 'border-l-4 border-l-emerald-500 border-slate-200 shadow-md'
          : state === 'completed'
            ? 'border-slate-200 shadow-sm'
            : 'border-slate-200 opacity-60'
      }`}
    >
      <div className={`flex items-center gap-3 ${state === 'active' ? 'px-5 py-4' : 'px-4 py-3'}`}>
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
            state === 'active'
              ? 'bg-emerald-500 text-white'
              : state === 'completed'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-slate-100 text-slate-400'
          }`}
        >
          {state === 'completed' ? <Check className="size-4 stroke-[3]" /> : <span className="text-sm font-semibold">{stepNumber}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold ${state === 'active' ? 'text-base text-slate-900' : 'text-[15px] text-slate-700'}`}>
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
        <div className={state === 'active' ? 'text-emerald-500' : 'text-slate-400'}>{icon}</div>
      </div>

      {state === 'active' && children ? <div className="border-t border-slate-100 px-5 pb-5 pt-4">{children}</div> : null}
      {state === 'completed' && summary ? <div className="border-t border-slate-100 px-4 pb-3 pt-2">{summary}</div> : null}
    </section>
  );
}
