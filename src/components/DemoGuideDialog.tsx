import { Activity, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Button } from './ui';

type TourStep = {
  targetId: string;
  title: string;
  body: string;
  hint: string;
};

type TargetBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const spotlightPadding = 10;

const tourSteps: TourStep[] = [
  {
    targetId: 'live-contract',
    title: 'Live Testnet Contract',
    body: 'Watch this panel verify the deployed Stellar testnet contract from the browser.',
    hint: 'Judges can confirm the contract ID, latest ledger, and explorer links without leaving UniProof.'
  },
  {
    targetId: 'student-maya',
    title: 'Choose the approved student',
    body: 'Click Maya Chen to begin the successful scholarship and aid claim path.',
    hint: 'Maya has a verified university passport and a high-need proof.'
  },
  {
    targetId: 'pool-emergency',
    title: 'Pick the aid pool',
    body: 'Click Emergency Aid Grant after Maya is selected.',
    hint: 'This pool matches high-need students and has enough XLM for the claim.'
  },
  {
    targetId: 'fraud-agent',
    title: 'Review the AI fraud signal',
    body: 'The Qwen Fraud Review Agent scores claim risk before the contract action.',
    hint: 'The agent is advisory: it explains suspicious signals while the Stellar contract remains the release gate.'
  },
  {
    targetId: 'release-funds',
    title: 'Run the contract decision',
    body: 'Click Release funds when the proof and contract checks are complete.',
    hint: 'The app shows why the smart contract approves or rejects the claim before funds move.'
  },
  {
    targetId: 'try-another-student',
    title: 'Repeat with another student',
    body: 'After the animated result appears, click Try another student to test the rejection path.',
    hint: 'Choose Leo Martin next to see UniProof block an unverified credential.'
  }
];

export function DemoGuideDialog({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetBox, setTargetBox] = useState<TargetBox | null>(null);
  const [targetAvailable, setTargetAvailable] = useState(false);
  const activeStep = tourSteps[stepIndex];
  const isLastStep = stepIndex === tourSteps.length - 1;

  useEffect(() => {
    if (open) {
      setStepIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function measureTarget() {
      const element = document.querySelector<HTMLElement>(`[data-tour-id="${activeStep.targetId}"]`);

      if (!element) {
        setTargetAvailable(false);
        setTargetBox(null);
        return;
      }

      setTargetAvailable(true);

      if (typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
      }

      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        setTargetBox(null);
        return;
      }

      setTargetBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    }

    measureTarget();
    const delayedMeasure = window.setTimeout(measureTarget, 180);
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);

    return () => {
      window.clearTimeout(delayedMeasure);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [activeStep.targetId, open]);

  const spotlightStyle = useMemo<CSSProperties | undefined>(() => {
    if (!targetBox) return undefined;

    return {
      top: targetBox.top - spotlightPadding,
      left: targetBox.left - spotlightPadding,
      width: targetBox.width + spotlightPadding * 2,
      height: targetBox.height + spotlightPadding * 2
    };
  }, [targetBox]);

  const tooltipStyle = useMemo<CSSProperties | undefined>(() => {
    if (!targetBox) return undefined;

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 768;
    const tooltipWidth = Math.min(368, viewportWidth - 32);
    const left = clamp(targetBox.left + targetBox.width / 2 - tooltipWidth / 2, 16, viewportWidth - tooltipWidth - 16);
    const belowTop = targetBox.top + targetBox.height + 18;
    const aboveTop = targetBox.top - 250;
    const top = belowTop + 236 < viewportHeight ? belowTop : Math.max(16, aboveTop);

    return { left, top, width: tooltipWidth };
  }, [targetBox]);

  if (!open) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[90]" role="presentation">
        {spotlightStyle ? (
          <div aria-hidden="true" className="tour-spotlight-frame" style={spotlightStyle} />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]" />
        )}
      </div>
      <section
        aria-labelledby="guided-demo-tour-title"
        className={`claim-result-pop pointer-events-auto fixed z-[91] w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-emerald-200 bg-white p-5 shadow-2xl ${
          tooltipStyle ? '' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        }`}
        role="dialog"
        style={tooltipStyle}
      >
        <button
          aria-label="Close guided demo tour"
          className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
            <Activity className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Step {stepIndex + 1} of {tourSteps.length}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950" id="guided-demo-tour-title">
              Guided demo tour
            </h2>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-base font-bold text-slate-950">{activeStep.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{activeStep.body}</p>
          <p className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium leading-5 text-emerald-900">
            {activeStep.hint}
          </p>
          {!targetAvailable ? (
            <p className="mt-3 text-xs font-medium text-amber-700">
              Complete the previous action to reveal this highlighted control.
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-1" aria-hidden="true">
          {tourSteps.map((step, index) => (
            <span
              className={`h-1.5 flex-1 rounded-full ${index <= stepIndex ? 'bg-emerald-700' : 'bg-slate-200'}`}
              key={step.targetId}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button className="text-sm font-semibold text-slate-500 transition hover:text-slate-800" onClick={onClose} type="button">
            Skip tour
          </button>
          <div className="flex gap-2">
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((nextStep) => Math.max(0, nextStep - 1))}
              type="button"
            >
              <ChevronLeft className="mr-1.5 size-4" />
              Back
            </button>
            <Button className="min-h-10 px-3 py-2" onClick={isLastStep ? onClose : () => setStepIndex((nextStep) => nextStep + 1)}>
              {isLastStep ? 'Done' : 'Next'}
              {!isLastStep ? <ChevronRight className="ml-1.5 size-4" /> : null}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
