# Qwen Fraud Review Agent Design

## Goal

Add a visible AI fraud-review agent to UniProof that uses Qwen through a server-side API call when configured, while keeping Stellar/Soroban contract logic as the authority for releasing or blocking aid claims.

## Product Behavior

The UniProof workflow adds a new step between private proof review and contract decision:

1. Student and aid pool are selected.
2. UniProof creates the private proof result.
3. The Qwen Fraud Review Agent evaluates claim risk.
4. The Stellar contract model evaluates proof, balance, and nullifier state.
5. The reviewer releases funds or sees the rejection reason.

The agent returns a normalized review:

- `riskLevel`: `low`, `medium`, or `high`
- `recommendation`: `approve`, `review`, or `block`
- `summary`: one short reviewer-facing explanation
- `reasons`: concrete fraud or safety signals
- `confidence`: a bounded number from 0 to 1
- `provider`: `qwen` when the live API responds, otherwise `local-fallback`
- `model`: the model name used for the assessment

## Security And Privacy

The Qwen API key must never be exposed in the frontend bundle. The browser calls `/api/fraud-agent`, and the serverless function reads `QWEN_API_KEY` or `DASHSCOPE_API_KEY` from the deployment environment.

The agent receives only demo claim context: student verification status, department, need band, pool rules, proof booleans, nullifier status, and pool balance. It does not receive documents, passports, transcripts, or payment secrets.

The agent is advisory. The contract decision remains the release gate.

## API Design

`POST /api/fraud-agent`

Request body:

```json
{
  "student": {
    "id": "student_maya",
    "name": "Maya Chen",
    "university": "Global Tech University",
    "department": "Computer Science",
    "verified": true,
    "needBand": "high",
    "credentialStatus": "committed"
  },
  "pool": {
    "id": "pool_emergency",
    "name": "Emergency Aid Grant",
    "type": "emergency-aid",
    "departmentRule": "any",
    "needRule": "medium-or-high",
    "balanceXlm": 2500,
    "awardXlm": 250
  },
  "proof": {
    "verified": true,
    "eligible": true,
    "claimNotUsed": true,
    "canReleaseFunds": true,
    "nullifier": "claim_maya_emergency"
  },
  "contract": {
    "poolBalanceXlm": 2500,
    "nullifierSeen": false
  }
}
```

Response body:

```json
{
  "riskLevel": "low",
  "recommendation": "approve",
  "summary": "Low fraud risk. The proof, pool rules, and nullifier state are aligned.",
  "reasons": [
    "University credential is verified.",
    "Pool eligibility rules match the private proof.",
    "Nullifier has not been used for this pool."
  ],
  "confidence": 0.86,
  "provider": "qwen",
  "model": "qwen-plus",
  "generatedAt": "2026-07-03T00:00:00.000Z"
}
```

## Fallback Behavior

If the app is running locally without the serverless route, or if the deployment lacks the Qwen API key, UniProof returns a deterministic local fallback review. The fallback keeps the demo usable and clearly labels the provider as `local-fallback`.

## Testing

Tests cover:

- local fraud review scoring for approved, unverified, mismatched, duplicate, and underfunded claims
- client fallback when `/api/fraud-agent` is unavailable
- client normalization when the API returns malformed values
- app flow showing the AI fraud-review step before contract decision

