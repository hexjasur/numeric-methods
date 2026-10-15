'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Activity,
  ArrowRightLeft,
  ArrowUpRight,
  BookOpenText,
  ExternalLink,
  Info,
  LayoutDashboard,
  Menu,
  Sigma,
  Spline,
  Split,
  X,
} from 'lucide-react';
import logo from '@/public/logo.webp';
import { ThemeToggle } from '@/components/theme-toggle';
import { LangToggle } from '@/components/lang-toggle';
import { useI18n } from '@/components/i18n-provider';
import { UpdaterHost } from '@/components/updater/updater-host';
import { UpdateProvider } from '@/components/updater/update-context';
import { UpdateCheckButton } from '@/components/updater/update-check-button';
import { BackToTop } from '@/components/back-to-top';
import packageJson from '@/package.json';

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  const navigation = useMemo(
    () => [
      {
        href: '/',
        label: t('nav.workspace'),
        code: '01',
        icon: LayoutDashboard,
      },
      {
        href: '/about',
        label: t('nav.about'),
        code: '02',
        icon: Info,
      },
      {
        href: '/docs/syntax',
        label: t('nav.syntax'),
        code: '03',
        icon: BookOpenText,
      },
      {
        href: '/learn',
        label: t('nav.learn'),
        code: '04',
        icon: BookOpenText,
      },
      {
        href: '/methods/bisection',
        label: t('nav.bisection'),
        code: '05',
        icon: Split,
      },
      {
        href: '/methods/newton',
        label: t('nav.newton'),
        code: '06',
        icon: ArrowUpRight,
      },
      {
        href: '/methods/iteration',
        label: t('nav.iteration'),
        code: '07',
        icon: ArrowUpRight,
      },
      {
        href: '/methods/sweep',
        label: t('nav.sweep'),
        code: '08',
        icon: ArrowRightLeft,
      },
      {
        href: '/methods/lagrange',
        label: t('nav.lagrange'),
        code: '09',
        icon: Spline,
      },
      {
        href: '/methods/spline',
        label: t('nav.spline'),
        code: '10',
        icon: Spline,
      },
      {
        href: '/methods/rectangles',
        label: t('nav.rectangles'),
        code: '11',
        icon: Sigma,
      },
      {
        href: '/methods/trapezoid',
        label: t('nav.trapezoid'),
        code: '12',
        icon: Sigma,
      },
      {
        href: '/methods/simpson',
        label: t('nav.simpson'),
        code: '13',
        icon: Sigma,
      },
      {
        href: '/methods/euler',
        label: t('nav.euler'),
        code: '14',
        icon: Activity,
        isNew: true,
      },
      {
        href: '/methods/runge-kutta',
        label: t('nav.rungeKutta'),
        code: '15',
        icon: Activity,
        isNew: true,
      },
    ],
    [t],
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({
      block: 'nearest',
    });
  }, [pathname]);

  const pageTitle =
    pathname === '/'
      ? t('nav.workspace')
      : pathname.startsWith('/about')
        ? t('nav.about')
        : pathname.startsWith('/docs')
          ? t('nav.syntax')
          : pathname.startsWith('/learn')
            ? t('nav.learn')
          : pathname.startsWith('/methods/bisection')
            ? t('nav.bisection')
            : pathname.startsWith('/methods/newton')
              ? t('nav.newton')
              : pathname.startsWith('/methods/iteration')
                ? t('nav.iteration')
                : pathname.startsWith('/methods/sweep')
                  ? t('nav.sweep')
                  : pathname.startsWith('/methods/lagrange')
                    ? t('nav.lagrange')
                    : pathname.startsWith('/methods/spline')
                      ? t('nav.spline')
                      : pathname.startsWith('/methods/rectangles')
                        ? t('nav.rectangles')
                        : pathname.startsWith('/methods/trapezoid')
                          ? t('nav.trapezoid')
                          : pathname.startsWith('/methods/simpson')
                            ? t('nav.simpson')
                            : pathname.startsWith('/methods/euler')
                              ? t('nav.euler')
                              : pathname.startsWith('/methods/runge-kutta')
                                ? t('nav.rungeKutta')
                                : t('nav.workspace');

  return (
    <UpdateProvider>
      <div className="flex min-h-screen text-ink font-sans text-[15px] leading-[1.5]">
      {/* ───────── SIDEBAR ───────── */}
      <aside
        className={`ps-side-panel fixed inset-y-0 left-0 z-30 w-[272px] flex flex-col p-[26px_18px_18px] max-md:pt-[calc(20px+var(--sat))] max-md:pb-[calc(18px+var(--sab))] bg-panel border-r border-line transition-transform duration-220 ease-out overflow-hidden max-md:w-[min(300px,86vw)] max-md:shadow-[var(--shadow)] ${
          mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
        }`}
        aria-label="Asosiy navigatsiya"
      >
        <div className="relative z-10 flex items-center justify-between p-[6px_4px_20px_18px] shrink-0">
          <Link
            href="/"
            className="flex items-center gap-[12px]"
            aria-label="Sonli Usullar bosh sahifasi"
          >
            <span className="grid place-items-center w-[46px] h-[46px]">
              <Image src={logo} width={40} height={40} alt="Sonli Usullar" />
            </span>
            <span className="flex flex-col leading-none">
              <strong className="text-[15px] font-bold tracking-[.16em]">
                {t('app.title')}
              </strong>
              <small className="mt-[7px] font-mono text-[11.5px] font-semibold tracking-[.08em] text-muted">
                {t('app.subtitle')}
              </small>
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

        {/* Scrollable navigation area */}
        <div className="relative z-10 flex-1 min-h-0 -mx-[18px] px-[18px] overflow-y-auto overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:var(--line-2)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line-2/60 hover:[&::-webkit-scrollbar-thumb]:bg-line-2 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="flex items-center gap-[10px] p-[0_12px_12px] font-mono text-[12px] font-semibold tracking-[.14em] uppercase text-muted">
            <span>{t('nav.lab')}</span>
            <i
              className="flex-1 h-px bg-[repeating-linear-gradient(90deg,var(--line-2)_0_4px,transparent_4px_8px)]"
              aria-hidden
            />
          </div>

          <nav className="grid gap-[6px]">
            {navigation.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  ref={active ? activeLinkRef : undefined}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center gap-[12px] min-h-[48px] px-[14px] border border-transparent rounded-[9px] text-[15px] font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-ink text-panel border-ink font-bold shadow-[0_10px_22px_-14px_var(--ink)] before:content-[""] before:absolute before:-left-[18px] before:top-[10px] before:bottom-[10px] before:w-[4px] before:rounded-r-[3px] before:bg-brand'
                      : 'text-muted hover:bg-bg-2 hover:text-ink hover:border-line hover:translate-x-[2px]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <item.icon
                    size={20}
                    strokeWidth={active ? 2.4 : 2}
                    className={active ? 'text-brand' : ''}
                  />
                  <span className="flex-1">{item.label}</span>
                  {'isNew' in item && item.isNew && <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-amber-700 dark:text-amber-300">{t('dashboard.badge_new')}</span>}
                  <em
                    className={`font-mono text-[12px] font-semibold not-italic ${active ? 'text-brand opacity-100' : 'opacity-60'}`}
                  >
                    {item.code}
                  </em>
                </Link>
              );
            })}
          </nav>

          {/* V2 Old Version Switcher */}
          <div className="my-3 pt-3 border-t border-line/60">
            <a
              href="https://v2.sonli-usullar.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between min-h-[42px] px-3.5 rounded-lg border border-line bg-bg-2/50 text-muted hover:text-ink hover:border-brand/40 hover:bg-brand-soft/40 transition-all text-[13px] font-semibold"
              title={t('nav.v2_tooltip')}
            >
              <span className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
                </span>
                <span>{t('nav.v2_link')}</span>
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.5 rounded border border-line-2 bg-panel text-muted group-hover:text-brand group-hover:border-brand/40 transition-colors">
                <span>v2.0</span>
                <ExternalLink size={12} />
              </span>
            </a>
          </div>
        </div>

        {/* Bottom footer: "Hisoblash muhiti" + Version */}
        <div className="relative z-10 mt-auto pt-3 shrink-0 grid gap-[14px]">
          <div className="flex items-center gap-[12px] p-[14px] border border-line rounded-[9px] bg-bg-2">
            <span className="w-2 h-2 rounded-full bg-ok shadow-[0_0_0_4px_color-mix(in_srgb,var(--ok)_18%,transparent)] animate-[pulse_2.4s_ease-in-out_infinite]" />
            <div>
              <strong className="block text-[13.5px]">{t('app.env')}</strong>
              <small className="block mt-[3px] font-mono text-[12px] font-medium text-muted">
                Math.js + KaTeX
              </small>
            </div>
          </div>
          <div
            className="flex items-center gap-[10px] font-mono text-[11.5px] font-semibold tracking-[.14em] text-muted"
            aria-hidden
          >
            <span>v{packageJson.version}</span>
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
        <header className="sticky top-0 z-20 flex items-center justify-between h-[76px] px-[clamp(22px,5vw,70px)] bg-head-bg backdrop-blur-[12px] border-b border-line max-md:h-[calc(66px+var(--sat))] max-md:pt-[var(--sat)] max-md:px-[16px] after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[1px] after:bg-[linear-gradient(90deg,var(--brand)_0_64px,transparent_64px)]">
          <div className="flex items-center gap-[10px]">
            <button
              className="hidden max-md:grid place-items-center w-[42px] h-[42px] cursor-pointer border border-line-2 rounded-md bg-panel text-ink transition-all hover:border-brand hover:text-brand hover:bg-brand-soft"
              onClick={() => setMobileOpen(true)}
              aria-label="Menyuni ochish"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-[10px] text-[14px] text-muted">
              <span className="max-md:hidden">Sonli Usullar</span>
              <b className="font-normal text-line-2 max-md:hidden">/</b>
              <strong className="font-[650] text-ink">{pageTitle}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://v2.sonli-usullar.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-[38px] px-2.5 rounded-lg border border-line bg-panel text-muted hover:text-ink hover:border-brand/40 hover:bg-brand-soft/40 font-mono text-[12px] font-semibold transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              title={t('nav.v2_tooltip')}
            >
              <span>v2</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
            <UpdateCheckButton />
            <LangToggle />
            <ThemeToggle />
          </div>
        </header>

        <main className="w-full max-w-[1420px] mx-auto flex-1 p-[clamp(28px,5vw,68px)_clamp(22px,5vw,70px)] max-md:p-[24px_16px] max-md:pb-[calc(24px+var(--sab))]">
          {children}
        </main>
        <BackToTop />
        <UpdaterHost />
      </div>
    </div>
    </UpdateProvider>
  );
}

export default AppShell;
