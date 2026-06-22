import { CircleDollarSign } from 'lucide-react';
import { Button, Panel } from './ui';

export function DonorFunding({ onFund }: { onFund: () => void }) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-800">Donor Funding</p>
          <h2 className="mt-2 text-xl font-bold">Fund student support</h2>
        </div>
        <CircleDollarSign className="size-7 text-emerald-700" />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Donors add funds to a Stellar-backed pool. Eligible students can claim without exposing private records.
      </p>
      <Button className="mt-5" onClick={onFund}>
        Add 1000 XLM
      </Button>
    </Panel>
  );
}
