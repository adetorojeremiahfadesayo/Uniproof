import type { AidPool } from '../types';
import { Panel, StatusChip } from './ui';

function formatXlm(value: number) {
  return `${new Intl.NumberFormat('en-US').format(value)} XLM`;
}

export function AidPools({ pools, selectedPool }: { pools: AidPool[]; selectedPool: AidPool }) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-800">Aid Pools</p>
          <h2 className="mt-2 text-xl font-bold">{selectedPool.name}</h2>
        </div>
        <StatusChip>{selectedPool.type === 'emergency-aid' ? 'Emergency aid' : 'Scholarship'}</StatusChip>
      </div>
      <div className="mt-5 grid gap-3">
        {pools.map((pool) => (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4" key={pool.id}>
            <div>
              <p className="font-semibold">{pool.name}</p>
              <p className="mt-1 text-sm text-slate-600">Award: {formatXlm(pool.awardXlm)}</p>
            </div>
            <p className="text-sm font-bold text-slate-950">{formatXlm(pool.balanceXlm)}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
