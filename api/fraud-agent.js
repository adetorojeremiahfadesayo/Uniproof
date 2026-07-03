const fallbackModel = 'deterministic-fraud-review';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const context = req.body && typeof req.body === 'object' ? req.body : {};
  const apiKey = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    return res.status(200).json(createLocalFraudReview(context, 'Qwen API key is not configured.'));
  }

  const baseUrl = stripTrailingSlash(
    process.env.QWEN_BASE_URL || process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
  );
  const model = process.env.QWEN_MODEL || 'qwen-plus';

  try {
    const qwenResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content:
              'You are UniProof Fraud Review Agent. Assess scholarship or aid-claim fraud risk from the provided bounded claim context. You are advisory only: the Stellar/Soroban contract remains the source of truth. Return only valid JSON with keys riskLevel, recommendation, summary, reasons, confidence. riskLevel must be low, medium, or high. recommendation must be approve, review, or block. reasons must be 2 to 5 short strings. confidence must be a number from 0 to 1.'
          },
          {
            role: 'user',
            content: JSON.stringify({
              claimContext: context,
              reviewRules: [
                'High risk and block if the credential is unverified or pending.',
                'High risk and block if the nullifier has already been used.',
                'Medium risk and review if pool rules do not match the proof.',
                'Medium risk and review if pool balance is below the award.',
                'Low risk and approve only if credential, eligibility, nullifier, and pool balance are all aligned.'
              ]
            })
          }
        ]
      })
    });

    if (!qwenResponse.ok) {
      throw new Error(`Qwen request failed with ${qwenResponse.status}`);
    }

    const payload = await qwenResponse.json();
    const content = payload?.choices?.[0]?.message?.content;
    const parsed = parseJsonObject(content);

    return res.status(200).json(
      normalizeFraudReview({
        ...parsed,
        provider: 'qwen',
        model: payload?.model || model,
        generatedAt: new Date().toISOString()
      })
    );
  } catch {
    return res.status(200).json(createLocalFraudReview(context, 'Qwen review failed; local fallback used.'));
  }
}

function createLocalFraudReview(context, note) {
  const proof = context?.proof || {};
  const contract = context?.contract || {};
  const pool = context?.pool || {};
  const reasons = [];
  let riskLevel = 'low';
  let recommendation = 'approve';
  let confidence = 0.86;

  if (proof.verified) {
    reasons.push('University credential is verified.');
  } else {
    reasons.push('University credential is pending or unverified.');
    riskLevel = 'high';
    recommendation = 'block';
    confidence = 0.92;
  }

  if (proof.eligible) {
    reasons.push('Pool eligibility rules match the private proof.');
  } else {
    reasons.push('Pool eligibility rules do not match the private proof.');
    if (riskLevel !== 'high') {
      riskLevel = 'medium';
      recommendation = 'review';
      confidence = 0.78;
    }
  }

  if (proof.claimNotUsed && !contract.nullifierSeen) {
    reasons.push('Claim nullifier has not been used for this pool.');
  } else {
    reasons.push('Claim nullifier has already been used.');
    riskLevel = 'high';
    recommendation = 'block';
    confidence = 0.95;
  }

  if (Number(contract.poolBalanceXlm) < Number(pool.awardXlm || 0)) {
    reasons.push('Pool balance is below the requested award.');
    if (riskLevel === 'low') {
      riskLevel = 'medium';
      recommendation = 'review';
      confidence = 0.74;
    }
  }

  return normalizeFraudReview({
    riskLevel,
    recommendation,
    summary: `${note} ${summarizeReview(riskLevel, recommendation)}`,
    reasons,
    confidence,
    provider: 'local-fallback',
    model: fallbackModel,
    generatedAt: new Date().toISOString()
  });
}

function normalizeFraudReview(value) {
  const riskLevel = ['low', 'medium', 'high'].includes(value?.riskLevel) ? value.riskLevel : 'medium';
  const recommendation = ['approve', 'review', 'block'].includes(value?.recommendation) ? value.recommendation : 'review';
  const reasons = Array.isArray(value?.reasons)
    ? value.reasons.filter((reason) => typeof reason === 'string' && reason.trim().length > 0).slice(0, 5)
    : [];

  return {
    riskLevel,
    recommendation,
    summary:
      typeof value?.summary === 'string' && value.summary.trim().length > 0
        ? value.summary.trim()
        : 'The agent returned an incomplete review. Manual review is recommended.',
    reasons: reasons.length > 0 ? reasons : ['Review the proof, eligibility rules, nullifier state, and pool balance.'],
    confidence: clampConfidence(value?.confidence),
    provider: value?.provider === 'qwen' ? 'qwen' : 'local-fallback',
    model: typeof value?.model === 'string' && value.model.trim().length > 0 ? value.model.trim() : fallbackModel,
    generatedAt:
      typeof value?.generatedAt === 'string' && value.generatedAt.trim().length > 0
        ? value.generatedAt.trim()
        : new Date().toISOString()
  };
}

function parseJsonObject(content) {
  if (typeof content !== 'string') {
    return {};
  }

  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return {};

    try {
      return JSON.parse(match[0]);
    } catch {
      return {};
    }
  }
}

function summarizeReview(riskLevel, recommendation) {
  if (riskLevel === 'low' && recommendation === 'approve') {
    return 'Low fraud risk. The proof, pool rules, and nullifier state are aligned.';
  }

  if (recommendation === 'block') {
    return 'High fraud risk. The claim should be blocked before funds are released.';
  }

  return 'Medium fraud risk. A reviewer should inspect the claim before release.';
}

function clampConfidence(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0.5;
  }

  return Math.min(Math.max(value, 0), 1);
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}
