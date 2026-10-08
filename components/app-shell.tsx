'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Menu, Sigma, X } from 'lucide-react';
import logo from '@/public/logo.png';
import { ThemeToggle } from '@/components/theme-toggle';

const navigation = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/methods/bisection', label: 'Bisection Method', icon: Sigma },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-line bg-surface px-[18px] py-7 transition-transform duration-200 max-[900px]:shadow-[var(--shadow)] ${mobileOpen ? 'translate-x-0' : 'max-[900px]:-translate-x-full'}`} aria-label="Asosiy navigatsiya">
        <div className="flex items-center justify-between px-2 pb-11">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Numeric Methods bosh sahifasi">
            <Image src={logo} width={40} height={40} alt="Numeric Methods" className="h-10 w-10 object-contain" />
            <span className="flex flex-col leading-none"><strong className="text-[13px] tracking-[.14em]">NUMERIC</strong><small className="mt-1.5 font-mono text-[9px] tracking-[.08em] text-muted">METHODS / 3.0</small></span>
          </Link>
          <button className="hidden rounded-md border border-line bg-surface p-1.5 text-muted max-[900px]:block" onClick={() => setMobileOpen(false)} aria-label="Menyuni yopish"><X size={18} /></button>
        </div>
        <div className="px-3 pb-3 font-mono text-[10px] uppercase tracking-[.15em] text-muted">LABORATORIYA</div>
        <nav className="grid gap-1.5">
          {navigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-[13px] font-semibold transition-colors ${active ? 'bg-brand/12 text-brand font-bold' : 'text-muted hover:bg-surface-soft hover:text-ink'}`} aria-current={active ? 'page' : undefined}>
              <item.icon size={18} strokeWidth={active ? 2.5 : 2} /><span>{item.label}</span>
            </Link>;
          })}
        </nav>
        <div className="mt-auto">
          <div className="flex items-center gap-2 rounded-lg border border-line p-3"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(56,201,140,.12)]" /><div><strong className="block text-[11px]">Hisoblash muhiti</strong><small className="mt-1 block text-[10px] text-muted">Math.js + KaTeX</small></div></div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-20 bg-black/40 min-[901px]:hidden" onClick={() => setMobileOpen(false)} aria-label="Menyuni yopish" />}
      <div className="ml-64 flex min-w-0 w-[calc(100%-16rem)] flex-1 max-[900px]:ml-0 max-[900px]:w-full">
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-line bg-bg/90 px-[clamp(22px,5vw,70px)] backdrop-blur-md max-[620px]:h-16 max-[620px]:px-4">
            <button className="hidden place-items-center rounded-md border border-line bg-surface p-2 text-ink max-[900px]:grid" onClick={() => setMobileOpen(true)} aria-label="Menyuni ochish"><Menu size={18} /></button>
            <div className="ml-0 flex items-center gap-2.5 text-xs text-muted max-[900px]:ml-3 max-[620px]:text-[10px]"><span className="max-[620px]:hidden">Numeric Methods</span><b className="text-line max-[620px]:hidden">/</b><strong className="text-ink">{pathname === '/' ? 'Dashboard' : 'Bisection Method'}</strong></div>
            <div className="flex items-center gap-[18px]"><span className="flex items-center gap-2 font-mono text-[10px] text-muted max-[900px]:hidden"><i className="h-2 w-2 rounded-full bg-emerald-400" /> Online</span><ThemeToggle /></div>
          </header>
          <main className="mx-auto w-full max-w-[1420px] flex-1 px-[clamp(22px,5vw,70px)] py-[clamp(28px,5vw,68px)] max-[620px]:px-4 max-[620px]:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
