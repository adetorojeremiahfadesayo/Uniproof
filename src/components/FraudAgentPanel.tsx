import { Activity, CheckCircle, RefreshCw, ShieldCheck, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { FraudReview } from '../types';
import { StatusChip } from './ui';

export type FraudAgentStatus = 'idle' | 'loading' | 'ready';

export function FraudAgentPanel({ review, status }: { review: FraudReview | null; status: FraudAgentStatus }) {
  const isLoading = status === 'loading' || !review;
  const riskStyle = review ? getRiskStyle(review.riskLevel) : getRiskStyle('medium');

  return (
    <div data-tour-id="fraud-agent">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${riskStyle.iconBg} ${riskStyle.iconText}`}>
            {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Activity className="size-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Qwen Fraud Review Agent</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {isLoading ? 'Reviewing claim, proof, nullifier, and pool signals.' : review.summary}
            </p>
          </div>
        </div>
        <StatusChip tone={review?.provider === 'qwen' ? 'good' : 'neutral'}>{review?.provider === 'qwen' ? 'Qwen live' : 'Fallback'}</StatusChip>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <AgentMetric
          icon={riskStyle.icon}
          label="Risk"
          value={isLoading ? 'Reviewing' : `${review.riskLevel} risk`}
          toneClass={riskStyle.text}
        />
        <AgentMetric
          icon={CheckCircle}
          label="Recommendation"
          value={isLoading ? 'Pending' : review.recommendation}
          toneClass={review?.recommendation === 'approve' ? 'text-emerald-700' : review?.recommendation === 'block' ? 'text-red-700' : 'text-amber-700'}
        />
        <AgentMetric
          icon={Activity}
          label="Model"
          value={isLoading ? 'Qwen' : review.model}
          toneClass="text-slate-700"
        />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Agent signals</p>
        <ul className="mt-3 grid gap-2 text-sm text-slate-600">
          {(review?.reasons ?? ['Waiting for the agent risk review.']).map((reason) => (
            <li className="flex gap-2" key={reason}>
              <span className={`mt-2 size-1.5 shrink-0 rounded-full ${riskStyle.dot}`} />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AgentMetric({
  icon: Icon,
  label,
  value,
  toneClass
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  toneClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon className="size-4" />
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className={`break-words text-sm font-bold capitalize ${toneClass}`}>{value}</p>
    </div>
  );
}

function getRiskStyle(riskLevel: FraudReview['riskLevel']) {
  if (riskLevel === 'low') {
    return {
      icon: CheckCircle,
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-700',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500'
    };
  }

  if (riskLevel === 'high') {
    return {
      icon: ShieldCheck,
      iconBg: 'bg-red-100',
      iconText: 'text-red-700',
      text: 'text-red-700',
      dot: 'bg-red-500'
    };
  }

  return {
    icon: TriangleAlert,
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    text: 'text-amber-700',
    dot: 'bg-amber-500'
  };
}
