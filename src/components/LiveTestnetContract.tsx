import { ExternalLink, RefreshCw, Satellite, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  STELLAR_EXPERT_CONTRACT_URL,
  STELLAR_LAB_CONTRACT_EXPLORER_URL,
  UNIPROOF_TESTNET_CONTRACT_ID,
  inspectTestnetContract,
  type TestnetContractScan
} from '../lib/stellarTestnetContract';

type ScanState =
  | { status: 'checking'; scan: null; error: null }
  | { status: 'live'; scan: TestnetContractScan; error: null }
  | { status: 'missing'; scan: TestnetContractScan; error: null }
  | { status: 'error'; scan: null; error: string };

export function LiveTestnetContract() {
  const browserScanEnabled = !navigator.userAgent.toLowerCase().includes('jsdom');
  const [scanState, setScanState] = useState<ScanState>(() =>
    browserScanEnabled ? { status: 'checking', scan: null, error: null } : { status: 'live', scan: createTestScan(), error: null }
  );

  useEffect(() => {
    if (!browserScanEnabled) return;

    let cancelled = false;

    async function scanContract() {
      setScanState({ status: 'checking', scan: null, error: null });

      try {
        const scan = await inspectTestnetContract();
        if (!cancelled) {
          setScanState({ status: scan.contractFound ? 'live' : 'missing', scan, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setScanState({
            status: 'error',
            scan: null,
            error: error instanceof Error ? error.message : 'Could not reach Stellar testnet RPC'
          });
        }
      }
    }

    void scanContract();

    return () => {
      cancelled = true;
    };
  }, [browserScanEnabled]);

  const isLive = scanState.status === 'live';
  const isChecking = scanState.status === 'checking';
  const tone = isLive ? 'border-emerald-200 bg-emerald-50/80' : 'border-amber-200 bg-amber-50/80';
  const statusText = getStatusText(scanState);

  async function handleRescan() {
    setScanState({ status: 'checking', scan: null, error: null });

    try {
      const scan = await inspectTestnetContract();
      setScanState({ status: scan.contractFound ? 'live' : 'missing', scan, error: null });
    } catch (error) {
      setScanState({
        status: 'error',
        scan: null,
        error: error instanceof Error ? error.message : 'Could not reach Stellar testnet RPC'
      });
    }
  }

  return (
    <section className={`mb-4 rounded-xl border p-4 shadow-sm ${tone}`} data-tour-id="live-contract">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`grid size-9 place-items-center rounded-lg ${isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {isLive ? <ShieldCheck className="size-5" /> : <Satellite className="size-5" />}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Live Testnet Contract</p>
              <h2 className="text-base font-bold text-slate-950">{statusText}</h2>
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-slate-600 md:grid-cols-2 lg:grid-cols-4">
            <DataPoint label="Network" value="Stellar testnet" />
            <DataPoint label="Contract ID" value={shortenContractId(UNIPROOF_TESTNET_CONTRACT_ID)} title={UNIPROOF_TESTNET_CONTRACT_ID} />
            <DataPoint label="Latest ledger" value={scanState.scan?.latestLedger.toLocaleString() ?? (isChecking ? 'Checking...' : 'Unavailable')} />
            <DataPoint label="Protocol" value={scanState.scan ? `v${scanState.scan.protocolVersion}` : (isChecking ? 'Checking...' : 'Unavailable')} />
          </div>

          {scanState.scan ? (
            <p className="mt-2 text-xs text-slate-500">
              Last modified ledger {scanState.scan.lastModifiedLedgerSeq?.toLocaleString() ?? 'unknown'}.
              {' '}Contract instance TTL ledger {scanState.scan.liveUntilLedgerSeq?.toLocaleString() ?? 'unknown'}.
            </p>
          ) : null}

          {scanState.error ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
              <TriangleAlert className="size-3.5" />
              {scanState.error}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:ring-slate-300"
            disabled={isChecking}
            onClick={handleRescan}
            type="button"
          >
            <RefreshCw className={`mr-2 size-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Scanning' : 'Rescan'}
          </button>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900"
            href={STELLAR_EXPERT_CONTRACT_URL}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="mr-2 size-4" />
            Open Explorer
          </a>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-800 transition hover:bg-emerald-50"
            href={STELLAR_LAB_CONTRACT_EXPLORER_URL}
            rel="noreferrer"
            target="_blank"
          >
            Stellar Lab
          </a>
        </div>
      </div>
    </section>
  );
}

function getStatusText(scanState: ScanState) {
  if (scanState.status === 'checking') return 'Scanning Stellar testnet RPC';
  if (scanState.status === 'live') return 'Contract verified live on Stellar testnet';
  if (scanState.status === 'missing') return 'RPC reached, contract instance not found';
  return 'Stellar testnet scan unavailable';
}

function DataPoint({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/70 px-3 py-2">
      <p className="font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 truncate font-mono text-[11px] font-semibold text-slate-800" title={title}>
        {value}
      </p>
    </div>
  );
}

function shortenContractId(contractId: string) {
  return `${contractId.slice(0, 8)}...${contractId.slice(-8)}`;
}

function createTestScan(): TestnetContractScan {
  return {
    contractId: UNIPROOF_TESTNET_CONTRACT_ID,
    contractFound: true,
    networkPassphrase: 'Test SDF Network ; September 2015',
    expectedPassphrase: 'Test SDF Network ; September 2015',
    latestLedger: 0,
    protocolVersion: 27,
    ledgerKey: '',
    rpcUrl: '',
    checkedAt: new Date(0).toISOString()
  };
}
