import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, CircleDollarSign, GraduationCap, ShieldCheck, WalletCards } from 'lucide-react';
import { ActionPanel } from './components/ActionPanel';
import { AidPools } from './components/AidPools';
import { AppShell } from './components/AppShell';
import { ClaimResultDialog, type ClaimResult } from './components/ClaimResultDialog';
import { ContractGuard } from './components/ContractGuard';
import { DemoGuideDialog } from './components/DemoGuideDialog';
import { LiveTestnetContract } from './components/LiveTestnetContract';
import { ProofPrivacyPanel } from './components/ProofPrivacyPanel';
import { StepCard, type StepState } from './components/StepCard';
import { UniversityPanel } from './components/UniversityPanel';
import { demoAidPools, demoStudents } from './data/demoData';
import { claimFromContract, createContractState, fundContractPool, syncPoolsFromContract } from './lib/contractAdapter';
import { createProofStatus } from './lib/eligibility';
import type { AidPool, ProofStatus, Student } from './types';

export default function App() {
  const [contractState, setContractState] = useState(() => createContractState(demoAidPools));
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('Select a student and pool to begin verification');
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [guideOpen, setGuideOpen] = useState(true);

  const pools = useMemo(() => syncPoolsFromContract(demoAidPools, contractState), [contractState]);
  const selectedStudent = demoStudents.find((student) => student.id === selectedStudentId) ?? null;
  const selectedPool = pools.find((pool) => pool.id === selectedPoolId) ?? null;
  const proof = useMemo(
    () => (selectedStudent && selectedPool ? createProofStatus(selectedStudent, selectedPool, contractState.usedNullifiers) : null),
    [selectedStudent, selectedPool, contractState.usedNullifiers]
  );

  function handleSelectStudent(studentId: string) {
    const nextStudent = demoStudents.find((student) => student.id === studentId);
    setSelectedStudentId(studentId);
    setSelectedPoolId(null);
    setCurrentStep(1);
    setMessage(`${nextStudent?.name ?? 'Student'} selected. Choose an aid pool.`);
  }

  function handleSelectPool(poolId: string) {
    const nextPool = pools.find((pool) => pool.id === poolId);
    setSelectedPoolId(poolId);
    if (currentStep > 2) {
      setCurrentStep(2);
    }
    setMessage(`${nextPool?.name ?? 'Pool'} selected. Reviewing private proof.`);
  }

  useEffect(() => {
    if (selectedStudent && currentStep === 1) {
      const timer = window.setTimeout(() => setCurrentStep(2), 600);
      return () => window.clearTimeout(timer);
    }
  }, [selectedStudent, currentStep]);

  useEffect(() => {
    if (selectedStudent && selectedPool && proof && currentStep === 2) {
      const timer = window.setTimeout(() => setCurrentStep(3), 600);
      return () => window.clearTimeout(timer);
    }
  }, [selectedStudent, selectedPool, proof, currentStep]);

  useEffect(() => {
    if (proof && currentStep === 3) {
      const timer = window.setTimeout(() => setCurrentStep(4), 1200);
      return () => window.clearTimeout(timer);
    }
  }, [proof, currentStep]);

  useEffect(() => {
    if (proof && currentStep === 4) {
      const timer = window.setTimeout(() => setCurrentStep(5), 800);
      return () => window.clearTimeout(timer);
    }
  }, [proof, currentStep]);

  function handleFund() {
    if (!selectedPool) return;

    const result = fundContractPool(contractState, selectedPool.id, 1000);
    setContractState(result.state);
    setMessage(`Donor funding confirmed on UniProofPool: ${result.receipt.transaction.hash}`);
  }

  function handleClaim() {
    if (!selectedStudent || !selectedPool || !proof) return;

    const result = claimFromContract(contractState, selectedPool.id, proof, selectedStudent.id);
    setContractState(result.state);

    if (result.receipt.status === 'released') {
      setMessage(`Funds released on Stellar testnet through UniProofPool: ${result.receipt.transaction.hash}`);
      setClaimResult({
        status: 'success',
        title: 'Claim approved',
        message: `${selectedStudent.name} can receive ${result.receipt.amountXlm} XLM from ${selectedPool.name}.`,
        reason: 'All private proof checks passed.',
        transactionHash: result.receipt.transaction.hash
      });
      return;
    }

    const reason = getClaimRejectionReason(result.receipt.reason, proof);
    setMessage(result.receipt.reason === 'claim already used' ? 'Claim already used.' : 'Claim rejected by contract rules.');
    setClaimResult({
      status: 'rejected',
      title: 'Claim rejected',
      message: `${selectedStudent.name} cannot claim from ${selectedPool.name}.`,
      reason,
      transactionHash: result.receipt.transaction.hash
    });
  }

  function handleResetToStudents() {
    setSelectedStudentId(null);
    setSelectedPoolId(null);
    setCurrentStep(1);
    setMessage('Select a student and pool to begin verification');
    setClaimResult(null);
    if (!navigator.userAgent.toLowerCase().includes('jsdom')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function getStepState(step: number): StepState {
    if (currentStep === step) return 'active';
    if (currentStep > step) return 'completed';
    return 'pending';
  }

  return (
    <AppShell currentStep={currentStep} message={message} onOpenGuide={() => setGuideOpen(true)}>
      <DemoGuideDialog open={guideOpen} onClose={() => setGuideOpen(false)} />
      <LiveTestnetContract />

      <StepCard
        stepNumber={1}
        title="Select Student"
        description="Choose a student to verify"
        state={getStepState(1)}
        icon={<GraduationCap className="size-5" />}
        summary={selectedStudent ? <StudentSummary student={selectedStudent} /> : undefined}
      >
        <UniversityPanel students={demoStudents} selectedStudent={selectedStudent ?? demoStudents[0]} onSelectStudent={handleSelectStudent} />
      </StepCard>

      {currentStep >= 2 ? (
        <StepCard
          stepNumber={2}
          title="Select Aid Pool"
          description="Choose an aid or scholarship pool"
          state={getStepState(2)}
          icon={<WalletCards className="size-5" />}
          summary={selectedPool ? <PoolSummary pool={selectedPool} /> : undefined}
        >
          <AidPools pools={pools} selectedPool={selectedPool ?? pools[0]} onSelectPool={handleSelectPool} />
        </StepCard>
      ) : null}

      {currentStep >= 3 && selectedStudent && selectedPool && proof ? (
        <StepCard
          stepNumber={3}
          title="Review Private Proof"
          description="ZK-proof verification with privacy boundary"
          state={getStepState(3)}
          icon={<BadgeCheck className="size-5" />}
          summary={<ProofSummary proof={proof} />}
        >
          <ProofPrivacyPanel student={selectedStudent} pool={selectedPool} proof={proof} />
        </StepCard>
      ) : null}

      {currentStep >= 4 && selectedPool && proof ? (
        <StepCard
          stepNumber={4}
          title="Contract Decision"
          description="Stellar smart contract evaluation"
          state={getStepState(4)}
          icon={<ShieldCheck className="size-5" />}
          summary={<ContractSummary proof={proof} pool={selectedPool} />}
        >
          <ContractGuard contractState={contractState} pool={selectedPool} proof={proof} />
        </StepCard>
      ) : null}

      {currentStep >= 5 && selectedPool && proof ? (
        <StepCard
          stepNumber={5}
          title="Take Action"
          description="Complete claim or add funds"
          state={getStepState(5)}
          icon={<CircleDollarSign className="size-5" />}
        >
          <ActionPanel pool={selectedPool} proof={proof} onClaim={handleClaim} onFund={handleFund} />
        </StepCard>
      ) : null}
      <ClaimResultDialog result={claimResult} onClose={() => setClaimResult(null)} onReset={handleResetToStudents} />
    </AppShell>
  );
}

function getClaimRejectionReason(reason: string | undefined, proof: ProofStatus) {
  if (reason === 'claim already used' || !proof.claimNotUsed) {
    return 'This passport has already claimed from this pool.';
  }

  if (reason === 'insufficient pool balance') {
    return 'The selected pool does not have enough XLM for this award.';
  }

  if (reason === 'pool inactive') {
    return 'This aid pool is not active.';
  }

  if (!proof.verified) {
    return 'University credential is not verified.';
  }

  if (!proof.eligible) {
    return 'Aid pool rules do not match this student proof.';
  }

  return 'The smart contract rejected this claim.';
}

function StudentSummary({ student }: { student: Student }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-slate-700">{student.name}</span>
      <span className="text-slate-400">-</span>
      <span className="text-slate-500">{student.department}</span>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        {student.verified ? 'Verified' : 'Pending'}
      </span>
      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
        {student.needBand.toUpperCase()} NEED
      </span>
    </div>
  );
}

function PoolSummary({ pool }: { pool: AidPool }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-slate-700">{pool.name}</span>
      <span className="text-slate-400">-</span>
      <span className="text-slate-500">{pool.awardXlm} XLM award</span>
      <span className="font-medium text-emerald-600">{pool.balanceXlm.toLocaleString()} XLM available</span>
    </div>
  );
}

function ProofSummary({ proof }: { proof: ProofStatus }) {
  const passed = [proof.verified, proof.eligible, proof.claimNotUsed].filter(Boolean).length;

  return (
    <div className="text-sm">
      <span className={proof.canReleaseFunds ? 'font-medium text-emerald-700' : 'font-medium text-red-700'}>
        Proof {proof.canReleaseFunds ? 'verified' : 'rejected'} - {passed}/3 checks passed
      </span>
    </div>
  );
}

function ContractSummary({ proof, pool }: { proof: ProofStatus; pool: AidPool }) {
  const approved = proof.canReleaseFunds && pool.balanceXlm >= pool.awardXlm;

  return (
    <div className="text-sm">
      <span className={approved ? 'font-medium text-emerald-700' : 'font-medium text-red-700'}>
        Contract {approved ? 'approved' : 'rejected'} - {approved ? 'Funds can be released' : 'Claim blocked'}
      </span>
    </div>
  );
}
