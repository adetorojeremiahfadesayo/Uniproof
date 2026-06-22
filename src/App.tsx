import { useMemo, useState } from 'react';
import { AidPools } from './components/AidPools';
import { AppShell } from './components/AppShell';
import { DonorFunding } from './components/DonorFunding';
import { ProofPanel } from './components/ProofPanel';
import { StudentPassport } from './components/StudentPassport';
import { UniversityPanel } from './components/UniversityPanel';
import { demoAidPools, demoStudents } from './data/demoData';
import { createProofStatus } from './lib/eligibility';
import { submitDemoClaim, submitDemoFunding } from './lib/stellarAdapter';

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
    <AppShell
      message={message}
      proofPanel={<ProofPanel proof={proof} pool={selectedPool} onClaim={handleClaim} />}
    >
      <UniversityPanel student={student} />
      <StudentPassport student={student} />
      <AidPools pools={pools} selectedPool={selectedPool} />
      <DonorFunding onFund={handleFund} />
    </AppShell>
  );
}
