import { StrKey, xdr } from '@stellar/stellar-sdk';

export const UNIPROOF_TESTNET_CONTRACT_ID = 'CDZEOT2QWBNWX3O2YWP7WJ43R25S6SKC5PY2P6ENY6WFCDX5YBD7HVYA';
export const STELLAR_TESTNET_RPC_URL = 'https://soroban-testnet.stellar.org';
export const STELLAR_TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';
export const STELLAR_LAB_CONTRACT_EXPLORER_URL = 'https://lab.stellar.org/smart-contracts/contract-explorer';
export const STELLAR_EXPERT_CONTRACT_URL = `https://stellar.expert/explorer/testnet/contract/${UNIPROOF_TESTNET_CONTRACT_ID}`;

type RpcResponse<T> = {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
};

type NetworkResult = {
  passphrase: string;
  protocolVersion: number;
  friendbotUrl?: string;
};

type LatestLedgerResult = {
  sequence: number;
  protocolVersion: number;
  id: string;
};

type LedgerEntriesResult = {
  entries?: Array<{
    key: string;
    lastModifiedLedgerSeq?: number;
    liveUntilLedgerSeq?: number;
  }>;
  latestLedger?: number;
};

export type TestnetContractScan = {
  contractId: string;
  contractFound: boolean;
  networkPassphrase: string;
  expectedPassphrase: string;
  latestLedger: number;
  protocolVersion: number;
  ledgerKey: string;
  lastModifiedLedgerSeq?: number;
  liveUntilLedgerSeq?: number;
  rpcUrl: string;
  checkedAt: string;
};

type Fetcher = (input: string, init: RequestInit) => Promise<Pick<Response, 'ok' | 'status' | 'statusText' | 'json'>>;

export function buildContractInstanceLedgerKey(contractId: string): string {
  const contractBytes = StrKey.decodeContract(contractId);
  const ledgerKey = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: xdr.ScAddress.scAddressTypeContract(contractBytes),
      key: xdr.ScVal.scvLedgerKeyContractInstance(),
      durability: xdr.ContractDataDurability.persistent()
    })
  );

  return ledgerKey.toXDR('base64');
}

export async function inspectTestnetContract({
  contractId = UNIPROOF_TESTNET_CONTRACT_ID,
  rpcUrl = STELLAR_TESTNET_RPC_URL,
  fetcher = globalThis.fetch
}: {
  contractId?: string;
  rpcUrl?: string;
  fetcher?: Fetcher;
} = {}): Promise<TestnetContractScan> {
  if (!fetcher) {
    throw new Error('fetch is not available in this browser');
  }

  const ledgerKey = buildContractInstanceLedgerKey(contractId);
  const [network, latestLedger, ledgerEntries] = await Promise.all([
    rpcRequest<NetworkResult>(rpcUrl, 'getNetwork', {}, fetcher),
    rpcRequest<LatestLedgerResult>(rpcUrl, 'getLatestLedger', {}, fetcher),
    rpcRequest<LedgerEntriesResult>(rpcUrl, 'getLedgerEntries', { keys: [ledgerKey] }, fetcher)
  ]);

  const contractEntry = ledgerEntries.entries?.[0];

  return {
    contractId,
    contractFound: Boolean(contractEntry),
    networkPassphrase: network.passphrase,
    expectedPassphrase: STELLAR_TESTNET_PASSPHRASE,
    latestLedger: ledgerEntries.latestLedger ?? latestLedger.sequence,
    protocolVersion: network.protocolVersion ?? latestLedger.protocolVersion,
    ledgerKey,
    lastModifiedLedgerSeq: contractEntry?.lastModifiedLedgerSeq,
    liveUntilLedgerSeq: contractEntry?.liveUntilLedgerSeq,
    rpcUrl,
    checkedAt: new Date().toISOString()
  };
}

async function rpcRequest<T>(rpcUrl: string, method: string, params: Record<string, unknown>, fetcher: Fetcher): Promise<T> {
  const response = await fetcher(rpcUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params
    })
  });

  if (!response.ok) {
    throw new Error(`Stellar RPC ${method} failed with HTTP ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as RpcResponse<T>;

  if (payload.error) {
    throw new Error(`Stellar RPC ${method} failed: ${payload.error.message}`);
  }

  if (!payload.result) {
    throw new Error(`Stellar RPC ${method} returned no result`);
  }

  return payload.result;
}
