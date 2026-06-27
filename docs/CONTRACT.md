# UniProof Pool Contract

The UniProof pool contract is the Level 2 blockchain layer for the hackathon demo. It keeps donor-funded aid or scholarship pools on-chain and releases a claim only when the proof result is accepted and the claim nullifier has not been used before.

## Contract

Path: `contracts/uniproof_pool/src/lib.rs`

Frontend adapter: `src/lib/contractAdapter.ts`

## Main Calls

- `create_pool(admin, pool_id, name, award_xlm)`: creates an active pool with a fixed award amount.
- `fund_pool(admin, pool_id, amount_xlm)`: increases the pool balance.
- `claim(recipient, pool_id, nullifier, proof_verified)`: releases one award if the proof is verified and the nullifier is unused.
- `get_pool(pool_id)`: reads pool state.
- `has_claimed(nullifier)`: checks whether a claim nullifier has already been used.

## Hackathon Meaning

The frontend currently simulates proof generation. This contract is where that proof result becomes enforceable:

- `proof_verified = true` represents the ZK verifier accepting the student's eligibility proof.
- `nullifier` prevents the same private credential from claiming the same pool twice.
- `balance_xlm` models donor-funded Stellar liquidity for the aid or scholarship pool.

## Local Build

```bash
cargo build -p uniproof_pool --target wasm32v1-none --release
```

Expected artifact:

```text
target/wasm32v1-none/release/uniproof_pool.wasm
```

## Current Limit

This version stores balances inside the contract model instead of moving real Stellar assets. The next deployment step is to wire the same claim rules to a Stellar token transfer on testnet.

The frontend adapter mirrors the contract locally so judges can see the pool balance, proof gate, nullifier status, and latest receipt before the testnet deployment step.

## Level 4 Frontend Model

The frontend now exposes several contract paths:

- verified and eligible student claim accepted
- unverified student claim rejected
- verified but not eligible student claim rejected
- duplicate nullifier rejected after a successful claim
- donor funding applied to the selected pool

These paths are shown in the contract event timeline before the real Stellar testnet deployment.
