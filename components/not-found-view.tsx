'use client';

import Link from 'next/link';
import katex from 'katex';
import {
  ArrowLeft,
  Home,
  Split,
  Spline,
  ArrowRightLeft,
  Activity,
  Sigma,
  Grid3X3,
  HelpCircle,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PsPanel, PsStrip } from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';

function renderKatexSafe(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false });
  } catch {
    return tex;
  }
}

export function NotFoundView() {
  const { t } = useI18n();

  const suggestedMethods = [
    {
      href: '/methods/bisection',
      code: '01',
      title: t('nav.bisection'),
      icon: Split,
      formulaTex: String.raw`c = \frac{a + b}{2}`,
    },
    {
      href: '/methods/newton',
      code: '02',
      title: t('nav.newton'),
      icon: Spline,
      formulaTex: String.raw`x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}`,
    },
    {
      href: '/methods/euler',
      code: '03',
      title: t('nav.euler'),
      icon: ArrowRightLeft,
      formulaTex: String.raw`y_{i+1} = y_i + h \cdot f(x_i, y_i)`,
    },
    {
      href: '/methods/runge-kutta',
      code: '04',
      title: t('nav.rungeKutta'),
      icon: Activity,
      formulaTex: String.raw`y_{i+1} = y_i + \frac{k_0+2k_1+2k_2+k_3}{6}`,
    },
    {
      href: '/methods/simpson',
      code: '05',
      title: t('nav.simpson'),
      icon: Sigma,
      formulaTex: String.raw`I \approx \frac{h}{3}[y_0 + 4\sum y_{toq} + 2\sum y_{juft} + y_n]`,
    },
    {
      href: '/methods/sweep',
      code: '06',
      title: t('nav.sweep'),
      icon: Grid3X3,
      formulaTex: String.raw`x_i = \alpha_{i+1} x_{i+1} + \beta_{i+1}`,
    },
  ];

  return (
    <AppShell>
      <div className="relative max-w-290 mx-auto px-4 pb-16">
        <PsStrip
          eyebrow={t('not_found.eyebrow')}
          id="ERR-404"
          name={t('not_found.code_val')}
        />

        {/* 404 Hero Banner */}
        <section className="my-10 relative overflow-hidden rounded-xl border border-line bg-panel p-8 sm:p-12 shadow-[var(--shadow)]">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-brand/5 blur-3xl pointer-events-none" />
          <div className="absolute left-1/2 bottom-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-brand/20 bg-brand-soft px-3 py-1 font-mono text-xs font-bold text-brand mb-4">
              <HelpCircle size={14} />
              <span>{t('not_found.code_label')}: 404_PAGE_MISSING</span>
            </div>

            <div className="flex items-baseline gap-4">
              <h1 className="text-6xl sm:text-8xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand via-cyan to-ink">
                {t('not_found.title_main')}
              </h1>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                {t('not_found.title_sub')}
              </span>
            </div>

            <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
              {t('not_found.desc')}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 rounded-lg bg-brand px-5 py-3 font-sans text-sm font-bold text-brand-ink transition-all hover:bg-brand/90 hover:shadow-[0_8px_20px_-6px_var(--brand)] active:translate-y-0.5"
              >
                <Home size={16} />
                <span>{t('not_found.back_home')}</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-bg-2 px-4 py-3 font-sans text-sm font-semibold text-ink transition-all hover:border-brand/60 hover:text-brand"
              >
                <ArrowLeft size={16} />
                <span>{t('nav.about')}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Suggested Methods Panel */}
        <PsPanel>
          <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                02 / NAVIGATION RECOVERY
              </span>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
                {t('not_found.popular_title')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedMethods.map((method) => {
              const Icon = method.icon;
              const formulaHtml = renderKatexSafe(method.formulaTex);
              return (
                <Link
                  key={method.href}
                  href={method.href}
                  className="group relative flex flex-col justify-between rounded-lg border border-line bg-bg-2 p-5 transition-all hover:-translate-y-1 hover:border-brand hover:bg-panel hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded bg-brand-soft px-2 py-1 font-mono text-xs font-bold text-brand">
                      {method.code}
                    </span>
                    <Icon
                      size={20}
                      className="text-muted transition-colors group-hover:text-cyan"
                    />
                  </div>

                  <div className="mt-5">
                    <h3 className="text-base font-bold text-ink transition-colors group-hover:text-brand">
                      {method.title}
                    </h3>
                    <div
                      className="mt-3 p-2 bg-panel border border-dashed border-line rounded-lg text-center overflow-x-auto text-[13px] text-cyan [&_.katex]:text-[1.05em] group-hover:border-cyan/40 transition-colors [scrollbar-width:none]"
                      dangerouslySetInnerHTML={{ __html: formulaHtml }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </PsPanel>
      </div>
    </AppShell>
  );
}
