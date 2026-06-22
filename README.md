# UniProof

UniProof is a university-first privacy passport platform for student verification, scholarships, aid claims, and donor-funded support on Stellar.

## Demo Flow

1. A university verifies Ada Okafor.
2. Ada receives a UniProof Passport.
3. A donor funds the Emergency Aid Grant pool.
4. Ada proves she is verified, eligible, and has not claimed before.
5. UniProof releases funds through the Stellar testnet demo adapter.

## Why ZK

UniProof lets a student prove eligibility without exposing full identity, income, private documents, or unrelated wallet history.

The MVP models the proof boundary with a deterministic proof-status layer:

- university credential is valid
- program rules match
- claim nullifier has not been used
- funds can be released once

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- Stellar/Soroban-facing demo adapter

## Run Locally

```bash
npm install
npm run dev
```

## Test

```bash
npm test
npm run build
```

## Hackathon Notes

The current implementation is a polished local MVP with simulated proof verification and a Stellar testnet-facing adapter. The next technical milestone is replacing the demo adapter with a Soroban contract that stores pool balances, checks proof verification output, records nullifiers, and releases funds.
