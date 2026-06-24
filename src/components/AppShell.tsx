import { BadgeCheck, CircleDollarSign, GraduationCap, ShieldCheck, WalletCards } from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';

const navItems = [
  { label: 'Dashboard', icon: BadgeCheck },
  { label: 'University Admin', icon: GraduationCap },
  { label: 'Student Passport', icon: ShieldCheck },
  { label: 'Aid Pools', icon: WalletCards },
  { label: 'Donor Funding', icon: CircleDollarSign },
  { label: 'Proof Status', icon: BadgeCheck }
];

export function AppShell({
  children,
  message,
  proofPanel
}: PropsWithChildren<{ message: string; proofPanel: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f5f8f6] text-slate-950">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col border-b border-emerald-950 bg-emerald-950 px-5 py-5 text-white lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg border border-white/25 bg-white/10 text-sm font-bold text-white">UP</div>
            <div>
              <p className="text-lg font-bold">UniProof</p>
              <p className="text-xs font-medium text-emerald-100">Stellar testnet</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-1">
            {navItems.map((item) => (
              <a
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-emerald-50/85 hover:bg-white/10 hover:text-white"
                href={`#${item.label.toLowerCase().replaceAll(' ', '-')}`}
                key={item.label}
              >
                <item.icon className="size-4" />
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 rounded-lg border border-white/15 bg-white/5 p-4 lg:mt-auto">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
              <span className="size-2 rounded-full bg-lime-400" />
              Stellar testnet
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold text-emerald-100/75">Admin Wallet</p>
              <p className="mt-1 font-mono text-sm text-white">GB...I3ZL</p>
            </div>
          </div>
        </aside>

        <main>
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
            <button className="w-fit rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
              University Admin
            </button>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-bold text-white">AU</div>
              <div>
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-xs text-slate-500">admin@uni.edu</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 xl:p-8">
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

            <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
              <div className="grid gap-5 lg:grid-cols-2">{children}</div>
              {proofPanel}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
