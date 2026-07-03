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

export type FraudRiskLevel = 'low' | 'medium' | 'high';

export type FraudRecommendation = 'approve' | 'review' | 'block';

export type FraudReviewProvider = 'qwen' | 'local-fallback';

export type FraudReview = {
  riskLevel: FraudRiskLevel;
  recommendation: FraudRecommendation;
  summary: string;
  reasons: string[];
  confidence: number;
  provider: FraudReviewProvider;
  model: string;
  generatedAt: string;
};

export type FraudReviewContext = {
  student: Pick<Student, 'id' | 'name' | 'university' | 'department' | 'verified' | 'needBand'> & {
    credentialStatus: 'committed' | 'pending';
  };
  pool: AidPool;
  proof: ProofStatus;
  contract: {
    poolBalanceXlm: number;
    nullifierSeen: boolean;
  };
};
