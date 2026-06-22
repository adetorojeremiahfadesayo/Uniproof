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
