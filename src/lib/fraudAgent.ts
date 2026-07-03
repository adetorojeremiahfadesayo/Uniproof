import type {
  AidPool,
  FraudRecommendation,
  FraudReview,
  FraudReviewContext,
  FraudReviewProvider,
  FraudRiskLevel,
  ProofStatus,
  Student
} from '../types';
import type { ContractState } from './contractAdapter';

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const fallbackModel = 'deterministic-fraud-review';

export function createFraudReviewContext(
  student: Student,
  pool: AidPool,
  proof: ProofStatus,
  contractState: ContractState
): FraudReviewContext {
  return {
    student: {
      id: student.id,
      name: student.name,
      university: student.university,
      department: student.department,
      verified: student.verified,
      needBand: student.needBand,
      credentialStatus: student.credentialCommitment === 'pending' ? 'pending' : 'committed'
    },
    pool,
    proof,
    contract: {
      poolBalanceXlm: contractState.pools[pool.id]?.balanceXlm ?? pool.balanceXlm,
      nullifierSeen: contractState.usedNullifiers.includes(proof.nullifier)
    }
  };
}

export function createLocalFraudReview(context: FraudReviewContext, note?: string): FraudReview {
  const reasons: string[] = [];
  let riskLevel: FraudRiskLevel = 'low';
  let recommendation: FraudRecommendation = 'approve';
  let confidence = 0.86;

  if (context.proof.verified) {
    reasons.push('University credential is verified.');
  } else {
    reasons.push('University credential is pending or unverified.');
    riskLevel = 'high';
    recommendation = 'block';
    confidence = 0.92;
  }

  if (context.proof.eligible) {
    reasons.push('Pool eligibility rules match the private proof.');
  } else {
    reasons.push('Pool eligibility rules do not match the private proof.');
    if (riskLevel !== 'high') {
      riskLevel = 'medium';
      recommendation = 'review';
      confidence = 0.78;
    }
  }

  if (context.proof.claimNotUsed && !context.contract.nullifierSeen) {
    reasons.push('Claim nullifier has not been used for this pool.');
  } else {
    reasons.push('Claim nullifier has already been used.');
    riskLevel = 'high';
    recommendation = 'block';
    confidence = 0.95;
  }

  if (context.contract.poolBalanceXlm < context.pool.awardXlm) {
    reasons.push('Pool balance is below the requested award.');
    if (riskLevel === 'low') {
      riskLevel = 'medium';
      recommendation = 'review';
      confidence = 0.74;
    }
  }

  const summary = note
    ? `${note} ${summarizeReview(riskLevel, recommendation)}`
    : summarizeReview(riskLevel, recommendation);

  return {
    riskLevel,
    recommendation,
    summary,
    reasons,
    confidence,
    provider: 'local-fallback',
    model: fallbackModel,
    generatedAt: new Date().toISOString()
  };
}

export async function requestFraudReview(
  context: FraudReviewContext,
  fetcher: Fetcher = fetch
): Promise<FraudReview> {
  try {
    const response = await fetcher('/api/fraud-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context)
    });

    if (!response.ok) {
      throw new Error(`Fraud agent request failed with ${response.status}`);
    }

    return normalizeFraudReview(await response.json());
  } catch {
    return createLocalFraudReview(context, 'Qwen API unavailable; local fallback used for demo continuity.');
  }
}

export function normalizeFraudReview(value: unknown): FraudReview {
  const record = isRecord(value) ? value : {};
  const riskLevel = normalizeRisk(record.riskLevel);
  const recommendation = normalizeRecommendation(record.recommendation);
  const reasons = Array.isArray(record.reasons)
    ? record.reasons.filter((reason): reason is string => typeof reason === 'string' && reason.trim().length > 0)
    : [];

  return {
    riskLevel,
    recommendation,
    summary:
      typeof record.summary === 'string' && record.summary.trim().length > 0
        ? record.summary.trim()
        : 'The agent returned an incomplete review. Manual review is recommended.',
    reasons: reasons.length > 0 ? reasons.slice(0, 5) : ['Review the proof, eligibility rules, nullifier state, and pool balance.'],
    confidence: clampConfidence(record.confidence),
    provider: normalizeProvider(record.provider),
    model: typeof record.model === 'string' && record.model.trim().length > 0 ? record.model.trim() : fallbackModel,
    generatedAt:
      typeof record.generatedAt === 'string' && record.generatedAt.trim().length > 0
        ? record.generatedAt.trim()
        : new Date().toISOString()
  };
}

function summarizeReview(riskLevel: FraudRiskLevel, recommendation: FraudRecommendation) {
  if (riskLevel === 'low' && recommendation === 'approve') {
    return 'Low fraud risk. The proof, pool rules, and nullifier state are aligned.';
  }

  if (recommendation === 'block') {
    return 'High fraud risk. The claim should be blocked before funds are released.';
  }

  return 'Medium fraud risk. A reviewer should inspect the claim before release.';
}

function normalizeRisk(value: unknown): FraudRiskLevel {
  return value === 'low' || value === 'medium' || value === 'high' ? value : 'medium';
}

function normalizeRecommendation(value: unknown): FraudRecommendation {
  return value === 'approve' || value === 'review' || value === 'block' ? value : 'review';
}

function normalizeProvider(value: unknown): FraudReviewProvider {
  return value === 'qwen' ? 'qwen' : 'local-fallback';
}

function clampConfidence(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0.5;
  }

  return Math.min(Math.max(value, 0), 1);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
