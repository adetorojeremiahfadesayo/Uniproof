import type { AidPool } from '../types';
import { StatusChip } from './ui';

function formatXlm(value: number) {
  return `${new Intl.NumberFormat('en-US').format(value)} XLM`;
}

export function AidPools({
  pools,
  selectedPool,
  onSelectPool
}: {
  pools: AidPool[];
  selectedPool: AidPool;
  onSelectPool: (poolId: string) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">Choose which aid or scholarship pool to claim from.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {pools.map((pool) => (
          <button
            className={`rounded-xl border-2 p-4 text-left transition ${
              pool.id === selectedPool.id
                ? 'border-emerald-400 bg-emerald-50 shadow-[0_0_0_2px_rgba(16,185,129,0.12)]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
            key={pool.id}
            onClick={() => onSelectPool(pool.id)}
            type="button"
          >
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                {pool.type === 'emergency-aid' ? 'Aid' : 'Sch'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{pool.name}</p>
                <p className="mt-1 text-sm text-slate-600">Award: {formatXlm(pool.awardXlm)}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500">Available</span>
                  <span className="text-sm font-bold text-emerald-700">{formatXlm(pool.balanceXlm)}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <StatusChip>{selectedPool.type === 'emergency-aid' ? 'Emergency aid' : 'Scholarship'}</StatusChip>
      </div>
    </div>
  );
}
