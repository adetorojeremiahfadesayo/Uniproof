import { Button } from './ui';

export function DemoGuideDialog({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm" role="presentation">
      <section
        aria-labelledby="judge-demo-guide-title"
        aria-modal="true"
        className="claim-result-pop w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-6 shadow-2xl"
        role="dialog"
      >
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Judge onboarding</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950" id="judge-demo-guide-title">
          Judge demo guide
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Use this path to evaluate UniProof quickly. The live panel verifies the deployed Stellar testnet contract,
          then the workflow shows a successful claim and a rejected claim.
        </p>

        <div className="mt-5 grid gap-3">
          <GuideStep number="1" title="Verify the chain" text="Check the Live Testnet Contract panel at the top of the app." />
          <GuideStep number="2" title="Run the success path" text="Choose Maya Chen, then Emergency Aid Grant, then Release funds." />
          <GuideStep number="3" title="Run the rejection path" text="Choose Leo Martin to see the contract block an unverified student." />
        </div>

        <Button className="mt-6 w-full" onClick={onClose}>
          Start Demo
        </Button>
      </section>
    </div>
  );
}

function GuideStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-800">
        {number}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}
