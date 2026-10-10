'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Activity, LayoutDashboard, Menu, Split, X } from 'lucide-react';
import logo from '@/public/logo.png';
import { ThemeToggle } from '@/components/theme-toggle';
import { LangToggle } from '@/components/lang-toggle';
import { useI18n } from '@/components/i18n-provider';

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const navigation = useMemo(() => [
    { href: '/', label: t('nav.dashboard'), code: '00', icon: LayoutDashboard },
    {
      href: '/methods/bisection',
      label: t('nav.bisection'),
      code: '01',
      icon: Split,
    },
    {
      href: '/methods/euler',
      label: t('nav.euler'),
      code: '02',
      icon: Activity,
    },
  ], [t]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const pageTitle =
    pathname === '/'
      ? t('nav.dashboard')
      : pathname.startsWith('/methods/euler')
        ? t('nav.euler')
        : t('nav.bisection');

  return (
    <div className="flex min-h-screen text-ink font-sans text-[15px] leading-[1.5]">
      {/* ───────── SIDEBAR ───────── */}
      <aside
        className={`ps-side-panel fixed inset-y-0 left-0 z-30 w-[272px] flex flex-col p-[26px_18px_18px] bg-panel border-r border-line transition-transform duration-220 ease-out overflow-hidden max-md:w-[min(300px,86vw)] max-md:shadow-[var(--shadow)] ${
          mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
        }`}
        aria-label="Asosiy navigatsiya"
      >
        <div className="relative z-10 flex items-center justify-between p-[6px_4px_30px_18px]">
          <Link
            href="/"
            className="flex items-center gap-[12px]"
            aria-label="Numeric Methods bosh sahifasi"
          >
            <span className="grid place-items-center w-[46px] h-[46px]">
              <Image src={logo} width={40} height={40} alt="Numeric Methods" />
            </span>
            <span className="flex flex-col leading-none">
              <strong className="text-[15px] font-bold tracking-[.16em]">{t('app.title')}</strong>
              <small className="mt-[7px] font-mono text-[11.5px] font-semibold tracking-[.08em] text-muted">{t('app.subtitle')}</small>
            </span>
          </Link>
          <button
            className="hidden max-md:grid place-items-center w-[42px] h-[42px] cursor-pointer border border-line-2 rounded-md bg-panel text-ink transition-all hover:border-brand hover:text-brand hover:bg-brand-soft"
            onClick={() => setMobileOpen(false)}
            aria-label="Menyuni yopish"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10 flex items-center gap-[10px] p-[0_12px_12px] font-mono text-[12px] font-semibold tracking-[.14em] uppercase text-muted">
          <span>{t('nav.lab')}</span>
          <i className="flex-1 h-px bg-[repeating-linear-gradient(90deg,var(--line-2)_0_4px,transparent_4px_8px)]" aria-hidden />
        </div>

        <nav className="relative z-10 grid gap-[6px]">
          {navigation.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-[12px] min-h-[48px] px-[14px] border border-transparent rounded-[9px] text-[15px] font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-ink text-panel border-ink font-bold shadow-[0_10px_22px_-14px_var(--ink)] before:content-[""] before:absolute before:-left-[18px] before:top-[10px] before:bottom-[10px] before:w-[4px] before:rounded-r-[3px] before:bg-brand'
                    : 'text-muted hover:bg-bg-2 hover:text-ink hover:border-line hover:translate-x-[2px]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon size={20} strokeWidth={active ? 2.4 : 2} className={active ? 'text-brand' : ''} />
                <span className="flex-1">{item.label}</span>
                <em className={`font-mono text-[12px] font-semibold not-italic ${active ? 'text-brand opacity-100' : 'opacity-60'}`}>{item.code}</em>
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 mt-auto grid gap-[14px]">
          <div className="flex items-center gap-[12px] p-[14px] border border-line rounded-[9px] bg-bg-2">
            <span className="w-2 h-2 rounded-full bg-ok shadow-[0_0_0_4px_color-mix(in_srgb,var(--ok)_18%,transparent)] animate-[pulse_2.4s_ease-in-out_infinite]" />
            <div>
              <strong className="block text-[13.5px]">{t('app.env')}</strong>
              <small className="block mt-[3px] font-mono text-[12px] font-medium text-muted">Math.js + KaTeX</small>
            </div>
          </div>
          <div className="flex items-center gap-[10px] font-mono text-[11.5px] font-semibold tracking-[.14em] text-muted" aria-hidden>
            <span>SN-3.0</span>
            <i className="ps-barcode flex-1 h-[12px] opacity-50" />
            <span>MK-1</span>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-25 border-0 cursor-pointer bg-[rgba(5,6,8,.55)] backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
          aria-label="Menyuni yopish"
        />
      )}

      {/* ───────── CONTENT ───────── */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen md:ml-[272px]">
        <header className="sticky top-0 z-20 flex items-center justify-between h-[76px] px-[clamp(22px,5vw,70px)] bg-head-bg backdrop-blur-[12px] border-b border-line max-md:h-[66px] max-md:px-[16px] after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[1px] after:bg-[linear-gradient(90deg,var(--brand)_0_64px,transparent_64px)]">
          <div className="flex items-center gap-[10px]">
            <button
              className="hidden max-md:grid place-items-center w-[42px] h-[42px] cursor-pointer border border-line-2 rounded-md bg-panel text-ink transition-all hover:border-brand hover:text-brand hover:bg-brand-soft"
              onClick={() => setMobileOpen(true)}
              aria-label="Menyuni ochish"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-[10px] text-[14px] text-muted">
              <span className="max-md:hidden">Numeric Methods</span>
              <b className="font-normal text-line-2 max-md:hidden">/</b>
              <strong className="font-[650] text-ink">{pageTitle}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <LangToggle />
            <ThemeToggle />
          </div>
        </header>

        <main className="w-full max-w-[1420px] mx-auto flex-1 p-[clamp(28px,5vw,68px)_clamp(22px,5vw,70px)] max-md:p-[24px_16px]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
