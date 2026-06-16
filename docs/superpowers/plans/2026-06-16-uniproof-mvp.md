# UniProof MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished UniProof MVP that demonstrates university student verification, a private student passport, donor-funded aid pools, eligibility proof status, and one-time aid claims.

**Architecture:** Use a React + TypeScript + Vite app with focused feature modules for demo data, eligibility logic, claim state, and UI sections. The first build uses deterministic local state and a Soroban-style adapter so the hackathon demo works before the contract is fully connected.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Tailwind CSS, lucide-react, local demo data, future Soroban testnet adapter.

---

## File Structure

- `package.json`: project scripts and dependencies.
- `index.html`: Vite app entry.
- `vite.config.ts`: Vite + Vitest config.
- `tsconfig.json`, `tsconfig.node.json`: TypeScript settings.
- `tailwind.config.ts`, `postcss.config.js`: Tailwind setup.
- `src/main.tsx`: React root render.
- `src/App.tsx`: app shell composition and state wiring.
- `src/styles.css`: Tailwind imports and global tokens.
- `src/data/demoData.ts`: demo university, student, pool, and donor data.
- `src/types.ts`: shared domain types.
- `src/lib/eligibility.ts`: pure eligibility/proof logic.
- `src/lib/claims.ts`: pure claim-state transition logic.
- `src/lib/stellarAdapter.ts`: Soroban/Stellar-facing interface and local demo implementation.
- `src/components/AppShell.tsx`: layout wrapper with sidebar, top bar, and main workspace.
- `src/components/UniversityPanel.tsx`: verified student and credential controls.
- `src/components/StudentPassport.tsx`: student passport surface.
- `src/components/AidPools.tsx`: aid/scholarship pool list and selected pool details.
- `src/components/DonorFunding.tsx`: donor funding interaction.
- `src/components/ProofPanel.tsx`: proof status, nullifier, and release-funds action.
- `src/components/ui.tsx`: small reusable primitives: button, status chip, stat, panel.
- `src/__tests__/eligibility.test.ts`: proof eligibility tests.
- `src/__tests__/claims.test.ts`: duplicate-claim and balance tests.
- `src/__tests__/app-flow.test.tsx`: user-flow tests for verify, fund, claim.
- `docs/assets/uniproof-app-concept.png`: visual concept target.

## Task 1: Scaffold React/Vite App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create project config**

Create `package.json` with these scripts and dependencies:

```json
{
  "name": "uniproof",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview --host 127.0.0.1"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite": "^6.0.3",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create TypeScript and Vite configs**

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
    globals: true
  }
});
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.node.json" }, { "path": "./tsconfig.app.json" }]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts"]
}
```

- [ ] **Step 3: Create Tailwind and app entry files**

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create a temporary `src/App.tsx`:

```tsx
export default function App() {
  return <main>UniProof</main>;
}
```

Create `src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #14201d;
  background: #f7faf8;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}
```

- [ ] **Step 4: Install and verify scaffold**

Run: `npm install`

Run: `npm run build`

Expected: TypeScript and Vite build succeed.

- [ ] **Step 5: Commit**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig*.json tailwind.config.ts postcss.config.js src
git commit -m "feat: scaffold uniproof app"
```

## Task 2: Domain Model And Eligibility Logic

**Files:**
- Create: `src/types.ts`
- Create: `src/data/demoData.ts`
- Create: `src/lib/eligibility.ts`
- Create: `src/__tests__/eligibility.test.ts`
- Create: `src/testSetup.ts`

- [ ] **Step 1: Write failing eligibility tests**

Create `src/__tests__/eligibility.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createProofStatus } from '../lib/eligibility';
import { demoAidPools, demoStudents } from '../data/demoData';

describe('createProofStatus', () => {
  it('marks a verified eligible student as claimable', () => {
    const proof = createProofStatus(demoStudents[0], demoAidPools[0], []);

    expect(proof.verified).toBe(true);
    expect(proof.eligible).toBe(true);
    expect(proof.claimNotUsed).toBe(true);
    expect(proof.canReleaseFunds).toBe(true);
  });

  it('blocks a student who has already claimed the same pool', () => {
    const proof = createProofStatus(demoStudents[0], demoAidPools[0], ['claim_ada_emergency']);

    expect(proof.claimNotUsed).toBe(false);
    expect(proof.canReleaseFunds).toBe(false);
  });

  it('blocks an unverified student even when pool rules match', () => {
    const proof = createProofStatus(demoStudents[1], demoAidPools[0], []);

    expect(proof.verified).toBe(false);
    expect(proof.canReleaseFunds).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/__tests__/eligibility.test.ts`

Expected: FAIL because `../lib/eligibility` and demo data do not exist yet.

- [ ] **Step 3: Implement types, data, and eligibility**

Create `src/types.ts`:

```ts
export type Student = {
  id: string;
  name: string;
  university: string;
  department: string;
  verified: boolean;
  needBand: 'high' | 'medium' | 'low';
  credentialCommitment: string;
};

export type AidPool = {
  id: string;
  name: string;
  type: 'scholarship' | 'emergency-aid';
  departmentRule: string | 'any';
  needRule: 'high' | 'medium-or-high' | 'any';
  balanceXlm: number;
  awardXlm: number;
};

export type ProofStatus = {
  verified: boolean;
  eligible: boolean;
  claimNotUsed: boolean;
  canReleaseFunds: boolean;
  nullifier: string;
};
```

Create `src/data/demoData.ts`:

```ts
import type { AidPool, Student } from '../types';

export const demoStudents: Student[] = [
  {
    id: 'student_ada',
    name: 'Ada Okafor',
    university: 'Lagos State University',
    department: 'Computer Science',
    verified: true,
    needBand: 'high',
    credentialCommitment: 'cred_7f91_ada_lasu'
  },
  {
    id: 'student_timi',
    name: 'Timi Adeyemi',
    university: 'Lagos State University',
    department: 'Computer Science',
    verified: false,
    needBand: 'high',
    credentialCommitment: 'pending'
  }
];

export const demoAidPools: AidPool[] = [
  {
    id: 'pool_emergency',
    name: 'Emergency Aid Grant',
    type: 'emergency-aid',
    departmentRule: 'any',
    needRule: 'medium-or-high',
    balanceXlm: 2500,
    awardXlm: 250
  },
  {
    id: 'pool_cs_scholarship',
    name: 'Computer Science Scholarship',
    type: 'scholarship',
    departmentRule: 'Computer Science',
    needRule: 'any',
    balanceXlm: 5000,
    awardXlm: 500
  }
];
```

Create `src/lib/eligibility.ts`:

```ts
import type { AidPool, ProofStatus, Student } from '../types';

export function createClaimNullifier(student: Student, pool: AidPool) {
  return `claim_${student.id.replace('student_', '')}_${pool.id.replace('pool_', '')}`;
}

export function isEligibleForPool(student: Student, pool: AidPool) {
  const departmentMatches = pool.departmentRule === 'any' || pool.departmentRule === student.department;
  const needMatches =
    pool.needRule === 'any' ||
    student.needBand === pool.needRule ||
    (pool.needRule === 'medium-or-high' && (student.needBand === 'medium' || student.needBand === 'high'));

  return departmentMatches && needMatches;
}

export function createProofStatus(student: Student, pool: AidPool, usedNullifiers: string[]): ProofStatus {
  const nullifier = createClaimNullifier(student, pool);
  const verified = student.verified;
  const eligible = isEligibleForPool(student, pool);
  const claimNotUsed = !usedNullifiers.includes(nullifier);

  return {
    verified,
    eligible,
    claimNotUsed,
    canReleaseFunds: verified && eligible && claimNotUsed,
    nullifier
  };
}
```

Create `src/testSetup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/__tests__/eligibility.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/types.ts src/data/demoData.ts src/lib/eligibility.ts src/__tests__/eligibility.test.ts src/testSetup.ts
git commit -m "feat: add uniproof eligibility model"
```

## Task 3: Claim State And Stellar Adapter

**Files:**
- Create: `src/lib/claims.ts`
- Create: `src/lib/stellarAdapter.ts`
- Create: `src/__tests__/claims.test.ts`

- [ ] **Step 1: Write failing claim tests**

Create `src/__tests__/claims.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { applyClaim, fundPool } from '../lib/claims';
import { demoAidPools, demoStudents } from '../data/demoData';
import { createProofStatus } from '../lib/eligibility';

describe('claim state', () => {
  it('releases funds and records nullifier for a valid proof', () => {
    const pool = demoAidPools[0];
    const proof = createProofStatus(demoStudents[0], pool, []);

    const result = applyClaim(pool, proof);

    expect(result.pool.balanceXlm).toBe(2250);
    expect(result.usedNullifier).toBe('claim_ada_emergency');
    expect(result.status).toBe('released');
  });

  it('does not release funds when proof is not claimable', () => {
    const pool = demoAidPools[0];
    const proof = createProofStatus(demoStudents[1], pool, []);

    const result = applyClaim(pool, proof);

    expect(result.pool.balanceXlm).toBe(2500);
    expect(result.status).toBe('rejected');
  });

  it('adds donor funding to the selected pool', () => {
    const pool = fundPool(demoAidPools[0], 1000);

    expect(pool.balanceXlm).toBe(3500);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/__tests__/claims.test.ts`

Expected: FAIL because `claims.ts` does not exist.

- [ ] **Step 3: Implement claim helpers and adapter**

Create `src/lib/claims.ts`:

```ts
import type { AidPool, ProofStatus } from '../types';

export function fundPool(pool: AidPool, amountXlm: number): AidPool {
  return {
    ...pool,
    balanceXlm: pool.balanceXlm + amountXlm
  };
}

export function applyClaim(pool: AidPool, proof: ProofStatus) {
  if (!proof.canReleaseFunds || pool.balanceXlm < pool.awardXlm) {
    return {
      pool,
      usedNullifier: undefined,
      status: 'rejected' as const
    };
  }

  return {
    pool: {
      ...pool,
      balanceXlm: pool.balanceXlm - pool.awardXlm
    },
    usedNullifier: proof.nullifier,
    status: 'released' as const
  };
}
```

Create `src/lib/stellarAdapter.ts`:

```ts
import type { AidPool, ProofStatus } from '../types';
import { applyClaim, fundPool } from './claims';

export type StellarTransaction = {
  network: 'Stellar testnet';
  hash: string;
  status: 'success' | 'rejected';
};

export function createDemoTransaction(prefix: string, status: StellarTransaction['status']): StellarTransaction {
  return {
    network: 'Stellar testnet',
    hash: `${prefix}_${Date.now().toString(16)}`,
    status
  };
}

export function submitDemoFunding(pool: AidPool, amountXlm: number) {
  return {
    pool: fundPool(pool, amountXlm),
    transaction: createDemoTransaction('fund', 'success')
  };
}

export function submitDemoClaim(pool: AidPool, proof: ProofStatus) {
  const result = applyClaim(pool, proof);

  return {
    ...result,
    transaction: createDemoTransaction('claim', result.status === 'released' ? 'success' : 'rejected')
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/__tests__/claims.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/claims.ts src/lib/stellarAdapter.ts src/__tests__/claims.test.ts
git commit -m "feat: add claim and stellar demo adapter"
```

## Task 4: App UI And Core Interaction Flow

**Files:**
- Create: `src/components/ui.tsx`
- Create: `src/components/AppShell.tsx`
- Create: `src/components/UniversityPanel.tsx`
- Create: `src/components/StudentPassport.tsx`
- Create: `src/components/AidPools.tsx`
- Create: `src/components/DonorFunding.tsx`
- Create: `src/components/ProofPanel.tsx`
- Modify: `src/App.tsx`
- Create: `src/__tests__/app-flow.test.tsx`

- [ ] **Step 1: Write failing app-flow test**

Create `src/__tests__/app-flow.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('UniProof app flow', () => {
  it('shows Ada as verified and releases emergency aid once', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Ada Okafor')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Emergency Aid Grant')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /release funds/i }));

    expect(screen.getByText(/Funds released on Stellar testnet/i)).toBeInTheDocument();
    expect(screen.getByText('Claim used')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /release funds/i }));

    expect(screen.getByText(/Claim already used/i)).toBeInTheDocument();
  });

  it('lets a donor fund the selected pool', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /add 1000 xlm/i }));

    expect(screen.getByText(/Donor funding confirmed/i)).toBeInTheDocument();
    expect(screen.getByText('3,500 XLM')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/__tests__/app-flow.test.tsx`

Expected: FAIL because the UI components and interactions are not implemented.

- [ ] **Step 3: Implement UI primitives**

Create `src/components/ui.tsx`:

```tsx
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Panel({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

export function Button({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusChip({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'good' | 'warn' | 'neutral' }>) {
  const tones = {
    good: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-800',
    neutral: 'border-slate-200 bg-slate-50 text-slate-700'
  };

  return <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
```

- [ ] **Step 4: Implement app composition**

Modify `src/App.tsx` with stateful composition:

```tsx
import { useMemo, useState } from 'react';
import { demoAidPools, demoStudents } from './data/demoData';
import { createProofStatus } from './lib/eligibility';
import { submitDemoClaim, submitDemoFunding } from './lib/stellarAdapter';
import { AppShell } from './components/AppShell';
import { UniversityPanel } from './components/UniversityPanel';
import { StudentPassport } from './components/StudentPassport';
import { AidPools } from './components/AidPools';
import { DonorFunding } from './components/DonorFunding';
import { ProofPanel } from './components/ProofPanel';

export default function App() {
  const [pools, setPools] = useState(demoAidPools);
  const [usedNullifiers, setUsedNullifiers] = useState<string[]>([]);
  const [message, setMessage] = useState('Ready to verify private eligibility.');
  const student = demoStudents[0];
  const selectedPool = pools[0];
  const proof = useMemo(() => createProofStatus(student, selectedPool, usedNullifiers), [student, selectedPool, usedNullifiers]);

  function handleFund() {
    const result = submitDemoFunding(selectedPool, 1000);
    setPools((current) => current.map((pool) => (pool.id === selectedPool.id ? result.pool : pool)));
    setMessage(`Donor funding confirmed: ${result.transaction.hash}`);
  }

  function handleClaim() {
    const result = submitDemoClaim(selectedPool, proof);
    setPools((current) => current.map((pool) => (pool.id === selectedPool.id ? result.pool : pool)));

    if (result.usedNullifier) {
      setUsedNullifiers((current) => [...current, result.usedNullifier!]);
      setMessage(`Funds released on Stellar testnet: ${result.transaction.hash}`);
      return;
    }

    setMessage(proof.claimNotUsed ? 'Claim rejected by proof rules.' : 'Claim already used.');
  }

  return (
    <AppShell message={message}>
      <UniversityPanel student={student} />
      <StudentPassport student={student} />
      <AidPools pools={pools} selectedPool={selectedPool} />
      <DonorFunding onFund={handleFund} />
      <ProofPanel proof={proof} pool={selectedPool} onClaim={handleClaim} />
    </AppShell>
  );
}
```

- [ ] **Step 5: Implement visual components**

Create `src/components/AppShell.tsx`:

```tsx
import { BadgeCheck, CircleDollarSign, GraduationCap, ShieldCheck, WalletCards } from 'lucide-react';
import type { PropsWithChildren } from 'react';

const navItems = [
  { label: 'University Admin', icon: GraduationCap },
  { label: 'Student Passport', icon: ShieldCheck },
  { label: 'Aid Pools', icon: WalletCards },
  { label: 'Donor Funding', icon: CircleDollarSign },
  { label: 'Proof Status', icon: BadgeCheck }
];

export function AppShell({ children, message }: PropsWithChildren<{ message: string }>) {
  return (
    <div className="min-h-screen bg-[#f7faf8] text-slate-950">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-slate-200 bg-white px-5 py-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-800 text-sm font-bold text-white">UP</div>
            <div>
              <p className="text-lg font-bold">UniProof</p>
              <p className="text-xs font-medium text-slate-500">Stellar testnet</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-1">
            {navItems.map((item) => (
              <a
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                href={`#${item.label.toLowerCase().replaceAll(' ', '-')}`}
                key={item.label}
              >
                <item.icon className="size-4" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="p-4 sm:p-6 xl:p-8">
          <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-slate-950">University privacy passport</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                Verify a student once, prove eligibility privately, and release aid through Stellar-backed pools.
              </p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
              {message}
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="grid gap-5 lg:grid-cols-2">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
```

Create `src/components/UniversityPanel.tsx`:

```tsx
import type { Student } from '../types';
import { Panel, StatusChip } from './ui';

export function UniversityPanel({ student }: { student: Student }) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-800">University Admin</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">Verified Students</h2>
        </div>
        <StatusChip tone="good">Verified</StatusChip>
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 p-4">
        <p className="text-lg font-bold">{student.name}</p>
        <p className="mt-1 text-sm text-slate-600">{student.department}</p>
        <p className="mt-1 text-sm text-slate-600">{student.university}</p>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-slate-50 p-3">
          <dt className="font-semibold text-slate-500">Credential</dt>
          <dd className="mt-1 truncate font-mono text-xs text-slate-800">{student.credentialCommitment}</dd>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <dt className="font-semibold text-slate-500">Need band</dt>
          <dd className="mt-1 font-bold capitalize text-slate-800">{student.needBand}</dd>
        </div>
      </dl>
    </Panel>
  );
}
```

Create `src/components/StudentPassport.tsx`:

```tsx
import { ShieldCheck } from 'lucide-react';
import type { Student } from '../types';
import { Panel, StatusChip } from './ui';

export function StudentPassport({ student }: { student: Student }) {
  return (
    <Panel>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-800">Student Passport</p>
          <h2 className="mt-2 text-xl font-bold">UniProof Passport</h2>
        </div>
        <ShieldCheck className="size-7 text-emerald-700" />
      </div>
      <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-900">{student.name}</p>
        <p className="mt-1 text-sm text-emerald-800">Private eligibility credential</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <StatusChip tone="good">Verified</StatusChip>
        <StatusChip tone="good">Eligible</StatusChip>
        <StatusChip>Identity hidden</StatusChip>
      </div>
    </Panel>
  );
}
```

Create `src/components/AidPools.tsx`:

```tsx
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
```

Create `src/components/DonorFunding.tsx`:

```tsx
import { CircleDollarSign } from 'lucide-react';
import { Button, Panel } from './ui';

export function DonorFunding({ onFund }: { onFund: () => void }) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-800">Donor Funding</p>
          <h2 className="mt-2 text-xl font-bold">Fund student support</h2>
        </div>
        <CircleDollarSign className="size-7 text-emerald-700" />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Donors add funds to a Stellar-backed pool. Eligible students can claim without exposing private records.
      </p>
      <Button className="mt-5" onClick={onFund}>
        Add 1000 XLM
      </Button>
    </Panel>
  );
}
```

Create `src/components/ProofPanel.tsx`:

```tsx
import type { AidPool, ProofStatus } from '../types';
import { Button, Panel, StatusChip } from './ui';

export function ProofPanel({ proof, pool, onClaim }: { proof: ProofStatus; pool: AidPool; onClaim: () => void }) {
  return (
    <Panel className="lg:col-span-2 xl:col-span-1 xl:row-span-2">
      <p className="text-sm font-semibold text-emerald-800">Proof Status</p>
      <h2 className="mt-2 text-xl font-bold">Private claim check</h2>
      <div className="mt-5 grid gap-3">
        <ProofRow label="University credential" ok={proof.verified} goodText="Verified" badText="Not verified" />
        <ProofRow label="Program rule match" ok={proof.eligible} goodText="Eligible" badText="Not eligible" />
        <ProofRow label="Nullifier check" ok={proof.claimNotUsed} goodText="Claim not used" badText="Claim used" />
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-500">Selected pool</p>
        <p className="mt-1 font-bold">{pool.name}</p>
        <p className="mt-1 text-sm text-slate-600">Release amount: {pool.awardXlm} XLM</p>
        <p className="mt-3 break-all font-mono text-xs text-slate-500">{proof.nullifier}</p>
      </div>
      <Button className="mt-5 w-full" onClick={onClaim}>
        Release funds
      </Button>
    </Panel>
  );
}

function ProofRow({ label, ok, goodText, badText }: { label: string; ok: boolean; goodText: string; badText: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <StatusChip tone={ok ? 'good' : 'warn'}>{ok ? goodText : badText}</StatusChip>
    </div>
  );
}
```

- [ ] **Step 6: Run app-flow test to verify it passes**

Run: `npm test -- src/__tests__/app-flow.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/App.tsx src/components src/__tests__/app-flow.test.tsx
git commit -m "feat: build uniproof demo flow"
```

## Task 5: Visual Polish And Responsive Layout

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/*.tsx`

- [ ] **Step 1: Run full checks before visual pass**

Run: `npm test`

Run: `npm run build`

Expected: both pass.

- [ ] **Step 2: Start local app**

Run: `npm run dev`

Expected: Vite serves the app on a local URL.

- [ ] **Step 3: Browser verification**

Open the local URL in the in-app browser. Verify:

- Sidebar is visible and stable.
- Main panels fit without incoherent overlap.
- Right proof panel stays readable.
- Buttons have clear hover/focus states.
- Mobile width stacks panels cleanly.
- The release-funds and donor-funding flows update the UI.

- [ ] **Step 4: Compare with concept**

Use `view_image` on `docs/assets/uniproof-app-concept.png` and on the latest browser screenshot. Compare:

- Copy and navigation labels.
- Layout and section order.
- Color palette.
- Typography and spacing.
- Panel and chip styling.
- Proof/transaction panel visibility.

- [ ] **Step 5: Commit visual polish**

Run:

```bash
git add src
git commit -m "style: polish uniproof interface"
```

## Task 6: README And Submission Materials

**Files:**
- Create: `README.md`
- Modify: `PROJECT.md` if final demo behavior changes

- [ ] **Step 1: Create README**

Create `README.md` with:

```md
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
```

- [ ] **Step 2: Verify README commands**

Run: `npm test`

Run: `npm run build`

Expected: both pass.

- [ ] **Step 3: Commit**

Run:

```bash
git add README.md PROJECT.md
git commit -m "docs: add uniproof readme"
```

## Self-Review

- Spec coverage: This plan covers university verification, student passport, donor funding, aid claim, proof status, duplicate-claim prevention, GitHub readiness, and DoraHacks-ready explanation.
- Completeness scan: No unresolved implementation gaps remain before execution. Task 4 Step 5 includes concrete component code guided by the saved concept.
- Type consistency: `Student`, `AidPool`, and `ProofStatus` are defined once in `src/types.ts` and reused across tests, logic, and UI.
