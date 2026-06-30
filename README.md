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
- Soroban smart contract
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

## Soroban Contract

The local contract lives in `contracts/uniproof_pool/src/lib.rs`.

It models the Level 2 blockchain flow:

- create a university aid or scholarship pool
- fund the pool
- accept a proof verification result
- store a nullifier for each claim
- reject duplicate claims
- reduce the pool balance when a verified claim is released

The frontend is also wired to a local contract adapter in `src/lib/contractAdapter.ts`, so donor funding and student claim actions follow the same contract rules before deployment.

Build the contract WASM with:

```bash
cargo build -p uniproof_pool --target wasm32v1-none --release
```

The expected artifact is:

```text
target/wasm32v1-none/release/uniproof_pool.wasm
```

## Testnet Deployment

UniProof has a deployed Stellar testnet contract for the hackathon demo:

```text
CDZEOT2QWBNWX3O2YWP7WJ43R25S6SKC5PY2P6ENY6WFCDX5YBD7HVYA
```

Network: Stellar testnet

The app includes a **Live Testnet Contract** panel that scans Stellar testnet RPC from the browser, checks the deployed contract instance ledger entry, and links judges to the contract explorer.

## Hackathon Notes

The current implementation is a polished local MVP with simulated proof verification, a Stellar testnet-facing adapter, a local Soroban contract, and a contract-connected frontend demo for pool balances, proof-gated claims, nullifiers, and one-time aid release.

## Level 4 Demo Depth

The current demo includes:

- multiple student scenarios: verified, unverified, and verified-but-not-eligible
- selectable scholarship and emergency aid pools
- proof privacy detail showing hidden inputs, public signals, and result
- contract event timeline for funding, releases, nullifier storage, and rejected claims
- deployment readiness panel for the Level 5 Stellar testnet step
