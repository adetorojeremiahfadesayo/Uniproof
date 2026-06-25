import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  Shield,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useState, type CSSProperties, type PropsWithChildren } from 'react';
import { ProgressBar } from './ProgressBar';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin', label: 'University Admin', icon: Shield },
  { id: 'passport', label: 'Student Passport', icon: GraduationCap },
  { id: 'pools', label: 'Aid Pools', icon: Wallet },
  { id: 'donor', label: 'Donor Funding', icon: DollarSign },
  { id: 'proof', label: 'Proof Status', icon: FileCheck }
];

export function AppShell({
  children,
  message,
  currentStep
}: PropsWithChildren<{ message: string; currentStep: number }>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const heroStatus = getHeroStatus(message);
  const sidebarStyle = { '--sidebar-width': sidebarCollapsed ? '60px' : '220px' } as CSSProperties;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950" style={sidebarStyle}>
      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col bg-[#0B3D2E] text-white transition-[width] duration-300 lg:flex ${
          sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'
        }`}
      >
        <div className="flex h-14 items-center border-b border-[#165A43] px-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#165A43] text-xs font-bold text-white">UP</div>
          {!sidebarCollapsed ? (
            <div className="ml-2.5 min-w-0 overflow-hidden">
              <div className="text-sm font-bold leading-tight">UniProof</div>
              <div className="text-[10px] leading-tight text-[#94A3B8]">Stellar testnet</div>
            </div>
          ) : null}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-hidden px-2 py-3">
          {navItems.map((item) => (
            <button
              className={`relative flex w-full items-center rounded-md transition ${
                sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
              } ${activeNav === item.id ? 'bg-[#165A43] text-white' : 'text-[#94A3B8] hover:bg-[#165A43]/50 hover:text-white'}`}
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              type="button"
            >
              {activeNav === item.id && !sidebarCollapsed ? (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-emerald-500" />
              ) : null}
              <item.icon className="size-4 shrink-0" />
              {!sidebarCollapsed ? <span className="ml-2.5 whitespace-nowrap text-[13px] font-medium">{item.label}</span> : null}
            </button>
          ))}
        </nav>

        <div className="border-t border-[#165A43] p-2">
          <button
            className={`flex w-full items-center py-2 text-[#94A3B8] transition hover:text-white ${
              sidebarCollapsed ? 'justify-center' : 'justify-between px-3'
            }`}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            type="button"
          >
            {!sidebarCollapsed ? <span className="text-[11px] font-medium">Collapse</span> : null}
            {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 transition-[left] duration-300 lg:left-[var(--sidebar-width)] lg:px-6">
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          University Admin
          <ChevronDown className="size-4 text-slate-400" />
        </button>
        <div className="hidden items-center md:flex">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">{message}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-slate-700">Admin User</div>
            <div className="text-[11px] text-slate-400">admin@uni.edu</div>
          </div>
          <div className="grid size-8 place-items-center rounded-full bg-[#0B3D2E] text-xs font-bold text-white">AU</div>
        </div>
      </header>

      <main className="min-h-screen pt-14 transition-[margin] duration-300 lg:ml-[var(--sidebar-width)]">
        <div className="mx-auto max-w-6xl p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-slate-900">University privacy passport</h1>
              <p className="text-sm text-slate-500">
                Verify a student once, prove eligibility privately, and release aid through Stellar-backed pools.
              </p>
            </div>
            <div
              className={`flex shrink-0 items-center gap-2 self-start whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium ${heroStatus.bg} ${heroStatus.textColor}`}
            >
              <heroStatus.icon className="size-4" />
              {heroStatus.text}
            </div>
          </div>

          <ProgressBar currentStep={currentStep} />

          <div className="space-y-3">{children}</div>

          <p className="mx-auto mb-4 mt-8 max-w-xl text-center text-xs leading-5 text-slate-400">
            UniProof lets universities verify students once, then lets students privately prove eligibility for
            scholarships and emergency aid. Stellar smart contracts enforce proof-gated claims, donor-funded pool
            balances, and one-time nullifier checks.
          </p>
        </div>
      </main>
    </div>
  );
}

function getHeroStatus(message: string) {
  if (/released|confirmed|approved|ready/i.test(message)) {
    return {
      icon: CheckCircle,
      text: message,
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    };
  }

  if (/rejected|blocked|already used/i.test(message)) {
    return {
      icon: XCircle,
      text: message,
      bg: 'bg-red-50',
      textColor: 'text-red-700'
    };
  }

  return {
    icon: AlertTriangle,
    text: message || 'Select a student and pool to begin',
    bg: 'bg-slate-100',
    textColor: 'text-slate-500'
  };
}
