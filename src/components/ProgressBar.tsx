import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Student' },
  { id: 2, label: 'Pool' },
  { id: 3, label: 'Proof' },
  { id: 4, label: 'AI Agent' },
  { id: 5, label: 'Contract' },
  { id: 6, label: 'Action' }
];

export function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-4 h-[2px] -translate-y-1/2 bg-slate-200" />
        <div
          className="absolute left-0 top-4 h-[2px] -translate-y-1/2 bg-emerald-500 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div className="relative z-10 flex flex-col items-center" key={step.id}>
              <div
                className={`flex size-8 items-center justify-center rounded-full transition ${
                  isCompleted || isActive ? 'bg-emerald-500' : 'bg-slate-200'
                } ${isActive ? 'ring-4 ring-emerald-100' : ''}`}
              >
                {isCompleted ? (
                  <Check className="size-4 text-white" />
                ) : (
                  <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>{step.id}</span>
                )}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium ${
                  isActive ? 'text-emerald-700' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
