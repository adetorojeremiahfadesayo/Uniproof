# UniProof Design Spec

## Overview

UniProof is a university-first privacy passport platform for student verification, scholarships, aid claims, and donor-funded support on Stellar.

The university verifies a student once. The student receives a private UniProof Passport. The student then uses zero-knowledge proofs to show eligibility for scholarships or aid without repeatedly revealing sensitive documents, full identity details, financial records, or wallet history.

## Product Positioning

UniProof is designed for the Stellar Hacks: Real-World ZK hackathon. It demonstrates a real-world use case for zero-knowledge proofs on Stellar: privacy-preserving education finance.

The product has two connected purposes:

- Help universities confirm student identities and issue trusted credentials.
- Help students privately apply for scholarships, claim emergency aid, and receive donor-funded support.

## Users

### University Admin

The university admin verifies students, creates scholarship or aid programs, and defines eligibility rules.

### Student

The student owns a UniProof Passport and uses it to prove eligibility privately.

### Donor

The donor funds scholarship or emergency aid pools.

### Smart Contract

The Stellar/Soroban contract verifies proof status, prevents duplicate claims, and releases funds.

## MVP Scope

The MVP focuses on a single polished demo path:

1. University verifies a student.
2. Student receives a UniProof Passport.
3. Donor funds an aid pool.
4. Student proves eligibility.
5. Stellar contract releases funds.

### In Scope

- University admin verification dashboard.
- Student UniProof Passport dashboard.
- Scholarship and aid pool pages.
- Donor pool funding flow.
- Student claim/application flow.
- Proof status layer.
- Stellar/Soroban pool and claim contract.
- Nullifier-based duplicate claim prevention.

### Out Of Scope

- Production KYC provider integration.
- Real university database integration.
- Full document verification.
- Full anonymous payment mixer.
- Multi-university federation.
- Scholarship committee review workflow.

## ZK Proof Requirements

The MVP proof should represent these claims:

- The student has a valid credential from the university.
- The student satisfies the selected program's eligibility rules.
- The student has not already claimed the program.
- The student does not reveal full identity, exact income, private documents, or unrelated wallet history.

If full proof generation is too costly within the hackathon timeline, the demo can use a proof simulation while documenting the intended ZK circuit and proof-verification boundary.

## System Components

### Frontend Web App

Role-based views:

- University Admin
- Student
- Donor
- Program or pool detail

The interface should clearly show which information stays private and which proof status is submitted on-chain.

### Demo Backend

Stores demo data for:

- Universities
- Students
- Credentials
- Aid and scholarship programs
- Donor-funded pools
- Claims

### ZK Layer

Generates or simulates an eligibility proof. The proof layer is responsible for converting private student attributes into a public proof result.

### Stellar/Soroban Layer

Handles:

- Aid or scholarship pool creation
- Pool funding
- Claim verification status
- Nullifier registration
- Fund release

## Data Flow

1. Admin marks student as verified.
2. System issues a credential commitment.
3. Donor funds a program pool.
4. Student selects a program and requests a claim.
5. ZK layer creates a proof or simulated proof.
6. Contract checks proof status and nullifier.
7. Contract releases funds if the claim is valid.
8. Claim is marked as used to prevent replay.

## Error Handling

The MVP should handle:

- Student not verified.
- Student not eligible.
- Pool has insufficient funds.
- Student already claimed.
- Contract transaction failed.
- Wallet not connected.

## Testing Plan

Minimum verification:

- Student cannot claim before verification.
- Verified eligible student can claim.
- Same student cannot claim twice.
- Donor funding increases pool balance.
- Claim decreases pool balance.
- UI shows successful and failed proof states clearly.

## Recommended Stack

- React, TypeScript, and Vite for frontend.
- Tailwind CSS for styling.
- Soroban for Stellar smart contracts.
- Stellar testnet for demo payments.
- Noir, Circom, or proof simulation depending on build time.
- GitHub for source code.
- DoraHacks for hackathon submission.

## Submission Plan

The project should be uploaded to GitHub with:

- Source code
- README
- Setup instructions
- Demo flow
- Contract explanation
- ZK proof explanation

The hackathon submission should be made through the DoraHacks project page. The DoraHacks submission should link to:

- GitHub repository
- Demo video
- Live demo if available
- Short explanation of the Stellar and ZK integration

