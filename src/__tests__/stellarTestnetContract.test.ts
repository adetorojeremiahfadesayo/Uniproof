import { describe, expect, it, vi } from 'vitest';
import {
  STELLAR_TESTNET_PASSPHRASE,
  UNIPROOF_TESTNET_CONTRACT_ID,
  buildContractInstanceLedgerKey,
  inspectTestnetContract
} from '../lib/stellarTestnetContract';

describe('stellar testnet contract scanner', () => {
  it('builds the UniProof contract instance ledger key', () => {
    expect(buildContractInstanceLedgerKey(UNIPROOF_TESTNET_CONTRACT_ID)).toBe(
      'AAAABgAAAAHyR09QsFtr7drFn/snm467L0lC6/Gn+I3HrFEO/cBH8wAAABQAAAAB'
    );
  });

  it('reports a live contract from Stellar RPC responses', async () => {
    const fetcher = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body)) as { method: string };

      if (body.method === 'getNetwork') {
        return response({
          passphrase: STELLAR_TESTNET_PASSPHRASE,
          protocolVersion: 27
        });
      }

      if (body.method === 'getLatestLedger') {
        return response({
          sequence: 3369642,
          protocolVersion: 27,
          id: 'ledger-id'
        });
      }

      return response({
        latestLedger: 3369642,
        entries: [
          {
            key: buildContractInstanceLedgerKey(UNIPROOF_TESTNET_CONTRACT_ID),
            lastModifiedLedgerSeq: 3331562,
            liveUntilLedgerSeq: 3452521
          }
        ]
      });
    });

    const scan = await inspectTestnetContract({ fetcher });

    expect(scan.contractFound).toBe(true);
    expect(scan.networkPassphrase).toBe(STELLAR_TESTNET_PASSPHRASE);
    expect(scan.latestLedger).toBe(3369642);
    expect(scan.lastModifiedLedgerSeq).toBe(3331562);
    expect(scan.liveUntilLedgerSeq).toBe(3452521);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});

function response(result: unknown) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({ jsonrpc: '2.0', id: 1, result })
  };
}
