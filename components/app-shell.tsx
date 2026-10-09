'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, LayoutDashboard, Menu, Sigma, X } from 'lucide-react';
import logo from '@/public/logo.png';
import { ThemeToggle } from '@/components/theme-toggle';

const navigation = [
  { href: '/', label: 'Dashboard', code: '00', icon: LayoutDashboard },
  { href: '/methods/bisection', label: 'Bisection Method', code: '01', icon: Sigma },
  { href: '/methods/euler', label: 'Euler Methods', code: '02', icon: Activity },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = pathname === '/' ? 'Dashboard' : pathname.startsWith('/methods/euler') ? 'Euler Methods' : 'Bisection Method';

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return <div className="flex min-h-screen bg-[var(--bg)] font-sans text-[var(--ink)]">
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-[272px] flex-col overflow-hidden border-r border-[var(--line)] bg-[var(--panel)] px-[18px] py-[26px] opacity-100 transition-transform duration-200 max-[900px]:w-[min(300px,86vw)] max-[900px]:shadow-[var(--shadow)] ${mobileOpen ? 'translate-x-0' : 'max-[900px]:-translate-x-full'}`} aria-label="Asosiy navigatsiya">
      <div className="relative z-10 flex items-center justify-between px-1 pb-[30px] pl-[18px]">
        <Link href="/" className="flex items-center gap-3" aria-label="Numeric Methods bosh sahifasi"><span className="grid h-[46px] w-[46px] place-items-center rounded-[10px] border border-[var(--line-2)] bg-[var(--bg-2)]"><Image src={logo} width={34} height={34} alt="Numeric Methods" className="object-contain" /></span><span className="flex flex-col leading-none"><strong className="text-[15px] tracking-[.16em]">NUMERIC</strong><small className="mt-2 font-mono text-[11px] font-semibold tracking-[.08em] text-[var(--muted)]">METHODS / 3.0</small></span></Link>
        <button className="hidden place-items-center rounded-[9px] border border-[var(--line-2)] bg-[var(--panel)] p-2 text-[var(--ink)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] max-[900px]:grid" onClick={() => setMobileOpen(false)} aria-label="Menyuni yopish"><X size={20} /></button>
      </div>
      <div className="relative z-10 flex items-center gap-2.5 px-3 pb-3 font-mono text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]"><span>Laboratoriya</span><i className="h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--line-2)_0_4px,transparent_4px_8px)]" /></div>
      <nav className="relative z-10 grid gap-1.5">
        {navigation.map((item) => { const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`group relative flex min-h-12 items-center gap-3 rounded-[9px] border px-3.5 text-[15px] font-semibold transition ${active ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--panel)] shadow-[0_10px_22px_-14px_var(--ink)]' : 'border-transparent text-[var(--muted)] hover:translate-x-0.5 hover:border-[var(--line)] hover:bg-[var(--bg-2)] hover:text-[var(--ink)]'}`} aria-current={active ? 'page' : undefined}><item.icon size={20} strokeWidth={active ? 2.4 : 2} className={active ? 'text-[var(--brand)]' : ''} /><span className="flex-1">{item.label}</span><em className={`font-mono text-xs not-italic ${active ? 'text-[var(--brand)] opacity-100' : 'opacity-60'}`}>{item.code}</em>{active && <i className="absolute -left-[19px] top-2.5 bottom-2.5 w-1 rounded-r bg-[var(--brand)]" />}</Link>; })}
      </nav>
      <div className="relative z-10 mt-auto grid gap-3.5"><div className="flex items-center gap-3 rounded-[9px] border border-[var(--line)] bg-[var(--bg-2)] p-3.5"><span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--ok)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--ok)_18%,transparent)]" /><div><strong className="block text-[13px]">Hisoblash muhiti</strong><small className="mt-0.5 block font-mono text-xs text-[var(--muted)]">Math.js + KaTeX</small></div></div><div className="flex items-center gap-2.5 font-mono text-xs font-semibold tracking-[.14em] text-[var(--muted)]"><span>SN-3.0</span><i className="h-3 flex-1 bg-[repeating-linear-gradient(90deg,var(--ink)_0_1px,transparent_1px_3px,var(--ink)_3px_5px,transparent_5px_6px,var(--ink)_6px_7px,transparent_7px_11px)] opacity-50" /><span>MK-1</span></div></div>
    </aside>
    {mobileOpen && <button className="fixed inset-0 z-20 cursor-pointer border-0 bg-black/75 backdrop-blur-md min-[901px]:hidden" onClick={() => setMobileOpen(false)} aria-label="Menyuni yopish" />}
    <div className="ml-[272px] flex min-h-screen min-w-0 w-[calc(100%-272px)] flex-1 flex-col max-[900px]:ml-0 max-[900px]:w-full">
      <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[var(--line)] bg-[var(--panel)] px-[clamp(22px,5vw,70px)] shadow-[0_8px_24px_-20px_var(--ink)] max-[620px]:h-[66px] max-[620px]:px-4"><div className="flex items-center gap-3.5"><button className="hidden place-items-center rounded-[9px] border border-[var(--line-2)] bg-[var(--panel)] p-2.5 text-[var(--ink)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] max-[900px]:grid" onClick={() => setMobileOpen(true)} aria-label="Menyuni ochish"><Menu size={20} /></button><div className="flex items-center gap-2.5 text-sm text-[var(--muted)] max-[620px]:text-xs"><span className="max-[620px]:hidden">Numeric Methods</span><b className="text-[var(--line-2)] max-[620px]:hidden">/</b><strong className="font-semibold text-[var(--ink)]">{pageTitle}</strong></div></div><div className="flex items-center gap-[18px]"><span className="flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-mono text-xs font-semibold tracking-wide text-[var(--ink-2)] max-[900px]:hidden"><i className="h-2 w-2 animate-pulse rounded-full bg-[var(--ok)]" /> Online</span><ThemeToggle /></div></header>
      <main className="mx-auto w-full max-w-[1420px] flex-1 px-[clamp(22px,5vw,70px)] py-[clamp(28px,5vw,68px)] max-[620px]:px-4 max-[620px]:py-6">{children}</main>
    </div>
  </div>;
}

export default AppShell;
