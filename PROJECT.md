# UniProof

## Project Summary

UniProof is a university-first privacy passport platform for student verification, scholarships, aid claims, and donor-funded support on Stellar.

The core idea is simple: a university verifies a student once, then the student receives a private UniProof Passport. The student can later prove eligibility for scholarships or aid without repeatedly exposing sensitive documents, full identity details, financial records, or wallet history.

## Hackathon Positioning

UniProof is built for the Stellar Hacks: Real-World ZK hackathon.

The project demonstrates how zero-knowledge proofs and Stellar smart contracts can support real-world education finance:

- Universities can confirm student identities and eligibility.
- Students can privately apply for scholarships and claim aid.
- Donors can fund scholarship or emergency aid pools.
- Stellar smart contracts can verify proof results and release funds.

## Target Users

### University Admin

The university admin verifies student identities, creates scholarship or aid programs, and defines eligibility rules.

Example rules:

- Student is enrolled.
- Student belongs to a specific department.
- Student is in financial need.
- Student has not already claimed this program.

### Student

The student receives a UniProof Passport after university verification. They use it to apply for scholarships or claim aid privately.

The student should not need to reveal full personal records every time they apply.

### Donor

The donor funds scholarship or emergency aid pools. Donations are sent into a Stellar-backed pool that can later distribute funds to eligible verified students.

### Verifier Contract

The Stellar/Soroban contract verifies that the submitted proof is valid and that the student has not already claimed the same program.

## MVP Scope

The first hackathon version should focus on one polished demo flow instead of trying to build a full university system.

### Included

- University dashboard for verifying a student.
- Student dashboard showing the UniProof Passport.
- Scholarship and aid pool pages.
- Donor funding flow for a pool.
- Student application or claim flow.
- Proof generation or proof simulation layer.
- Stellar/Soroban contract interface for verifying proof status and releasing funds.
- Contract-connected frontend state showing pool balance, proof gate, nullifier status, and latest receipt.
- Claim nullifier to prevent duplicate claims.

### Not Included In MVP

- Real KYC provider integration.
- Real university database integration.
- Production document verification.
- Full anonymous payment mixer.
- Complex scholarship committee review workflow.
- Multi-university credential federation.

These can be described as future work in the pitch.

## Core Demo Flow

1. A university admin verifies a student named Ada.
2. Ada receives a UniProof Passport.
3. A donor funds an emergency aid pool on Stellar.
4. Ada opens the aid pool and clicks claim.
5. UniProof creates a proof that Ada is verified, eligible, and has not claimed before.
6. The Stellar contract accepts the proof result.
7. Aid is released to Ada.
8. Ada's identity and sensitive details remain hidden from public view.

## What The ZK Proof Should Prove

For the hackathon MVP, the proof should represent these claims:

- The student has a valid university-issued credential.
- The student satisfies the selected program's eligibility rules.
- The student has not already claimed this scholarship or aid program.
- The student can prove eligibility without revealing full identity, income, private documents, or unrelated wallet history.

## Technical Architecture

### Frontend

A web app with role-based views:

- University Admin view
- Student view
- Donor view
- Program/pool detail view

The frontend should make the demo easy to understand and visually show the privacy boundary between hidden student data and public proof status.

### Backend

The backend stores demo data for:

- Universities
- Students
- Credentials
- Scholarship or aid programs
- Donor-funded pools
- Claim statuses

For the hackathon, the backend can use mocked university verification and local/demo credential data.

### ZK Layer

The ZK layer should ideally use a simple circuit or proof system to demonstrate one eligibility proof.

If full proof generation takes too long, the MVP can use a proof simulation while clearly documenting the intended proof design. The pitch should still explain exactly what the proof would prove.

### Stellar/Soroban Layer

The smart contract should model:

- Program or aid pool creation
- Pool funding
- Proof verification status
- One-time claim protection through a nullifier
- Fund release to an eligible student

## Suggested Stack

- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Smart contracts: Soroban
- Chain: Stellar testnet
- ZK: Noir, Circom, or simulated proof for the MVP if needed
- Repository: GitHub
- Submission: DoraHacks project page

## Success Criteria

The hackathon project is successful if judges can understand and see:

- A university verifies a student once.
- The student receives a reusable private passport.
- The student can claim scholarship or aid privately.
- Stellar is used for funding and payout.
- ZK is used for eligibility/privacy, not as decoration.
- Double-claiming is prevented.

## Pitch Summary

UniProof helps universities verify students once and lets students privately prove eligibility for scholarships, emergency aid, and donor-funded support.

Instead of exposing sensitive identity, income, academic, or financial records repeatedly, students use a zero-knowledge UniProof Passport. Stellar smart contracts verify claim eligibility and release funds from scholarship or aid pools.

UniProof makes student support more private, more trustworthy, and easier to distribute.

## Build Order

1. Create the frontend app shell and UniProof visual identity.
2. Build the university admin verification flow.
3. Build the student passport view.
4. Build scholarship and aid pool pages.
5. Build donor funding flow.
6. Build claim flow with proof status.
7. Add Soroban contract for pool funding and one-time claims.
8. Connect frontend to the contract.
9. Add demo data and polish the pitch flow.
10. Prepare GitHub README and DoraHacks submission materials.
