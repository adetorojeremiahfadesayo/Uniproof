import { BadgeCheck, CircleDollarSign, GraduationCap, ShieldCheck, WalletCards } from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';

const navItems = [
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
    <div className="min-h-screen bg-[#f7faf8] text-slate-950">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-slate-200 bg-white px-5 py-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-800 text-sm font-bold text-white">UP</div>
            <div>
              <p className="text-lg font-bold">UniProof</p>
              <p className="text-xs font-medium text-slate-500">Stellar testnet</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-1">
            {navItems.map((item) => (
              <a
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                href={`#${item.label.toLowerCase().replaceAll(' ', '-')}`}
                key={item.label}
              >
                <item.icon className="size-4" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="p-4 sm:p-6 xl:p-8">
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

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="grid gap-5 lg:grid-cols-2">{children}</div>
            {proofPanel}
          </div>
        </main>
      </div>
    </div>
  );
}
