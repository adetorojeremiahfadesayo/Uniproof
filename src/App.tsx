import { useMemo, useState } from 'react';
import { AidPools } from './components/AidPools';
import { AppShell } from './components/AppShell';
import { ContractGuard } from './components/ContractGuard';
import { DonorFunding } from './components/DonorFunding';
import { ProofPanel } from './components/ProofPanel';
import { StudentPassport } from './components/StudentPassport';
import { UniversityPanel } from './components/UniversityPanel';
import { demoAidPools, demoStudents } from './data/demoData';
import { claimFromContract, createContractState, fundContractPool, syncPoolsFromContract } from './lib/contractAdapter';
import { createProofStatus } from './lib/eligibility';

export default function App() {
  const [contractState, setContractState] = useState(() => createContractState(demoAidPools));
  const [message, setMessage] = useState('Ready to verify private eligibility.');
  const student = demoStudents[0];
  const pools = useMemo(() => syncPoolsFromContract(demoAidPools, contractState), [contractState]);
  const selectedPool = pools[0];
  const proof = useMemo(
    () => createProofStatus(student, selectedPool, contractState.usedNullifiers),
    [student, selectedPool, contractState.usedNullifiers]
  );

  function handleFund() {
    const result = fundContractPool(contractState, selectedPool.id, 1000);
    setContractState(result.state);
    setMessage(`Donor funding confirmed on UniProofPool: ${result.receipt.transaction.hash}`);
  }

  function handleClaim() {
    const result = claimFromContract(contractState, selectedPool.id, proof, student.id);
    setContractState(result.state);

    if (result.receipt.status === 'released') {
      setMessage(`Funds released on Stellar testnet through UniProofPool: ${result.receipt.transaction.hash}`);
      return;
    }

    setMessage(result.receipt.reason === 'claim already used' ? 'Claim already used.' : 'Claim rejected by contract rules.');
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
      <ContractGuard contractState={contractState} pool={selectedPool} proof={proof} />
    </AppShell>
  );
}
