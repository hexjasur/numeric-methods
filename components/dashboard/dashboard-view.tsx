'use client';

import { ArrowUpRight, BookOpenText, Clock3, Radio, Sparkles } from 'lucide-react';
import Link from 'next/link';
import {
  PsHero,
  PsStrip,
  PsPanel,
  PsPanelHead,
} from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';
import { MethodsHub } from '@/components/dashboard/methods-hub';

export function DashboardView() {
  const { t } = useI18n();

  const stats = [
    ['01', t('dashboard.stat1_label'), t('dashboard.stat1_val'), 'A'],
    ['02', t('dashboard.stat2_label'), t('dashboard.stat2_val'), 'B'],
    ['03', t('dashboard.stat3_label'), t('dashboard.stat3_val'), 'C'],
  ];

  return (
    <div className="relative ax-w-290 mx-auto px-4 pb-12">
      <PsStrip eyebrow="DSH-000" id="MAIN" name={t('dashboard.strip')} />

      <PsHero
        eyebrow={t('dashboard.hero_eyebrow')}
        title={
          <>
            {t('dashboard.hero_title_1')}{' '}
            <em className="not-italic text-cyan relative after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[.06em] after:h-[.07em] after:bg-brand">
              {t('dashboard.hero_title_em')}
            </em>
            <br />
            {t('dashboard.hero_title_2')}
          </>
        }
        titleHighlight=""
        lead={t('dashboard.hero_lead')}
      />

      <section className="retro-console mb-[18px]" aria-labelledby="retro-console-title">
        <div className="retro-console__topline">
          <span className="retro-console__eyebrow"><Radio size={14} aria-hidden="true" /> 1957 / CONTROL ROOM</span>
          <span className="retro-console__signal"><span aria-hidden="true" /> signal: stable</span>
        </div>
        <div className="retro-console__body">
          <div className="retro-console__copy">
            <p className="retro-console__kicker">SONLI USULLAR PRESENTS</p>
            <h2 id="retro-console-title">Hisoblash — <em>kelajakdan</em> kelgan.</h2>
            <p>1950-yillar ilmiy laboratoriyasi ruhi bilan sonli usullarni qayta kashf eting. Har bir formula — kichik bir ixtiro.</p>
            <div className="retro-console__actions">
              <span><Clock3 size={15} aria-hidden="true" /> 09:42:16 UTC</span>
              <span><Sparkles size={15} aria-hidden="true" /> MK-1 ONLINE</span>
            </div>
          </div>
          <div className="retro-console__dial" aria-hidden="true">
            <div className="retro-console__dial-ring"><b>∞</b></div>
            <span>PRECISION</span>
          </div>
        </div>
      </section>

      <PsPanel className="mb-[18px]">
        <PsPanelHead
          eyebrow="01 / OVERVIEW"
          title={t('dashboard.overview')}
          idx="SYS"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
          {stats.map(([number, label, value, mark]) => (
            <article
              className="relative min-h-[140px] rounded-lg border border-line bg-bg-2 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-brand"
              key={number}
            >
              <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft py-1 px-1.5 rounded">
                {number}
              </span>
              <span className="absolute right-[20px] top-[20px] rounded border border-line px-1.5 py-1 font-mono text-[11px] font-bold text-muted bg-panel">
                {mark}
              </span>
              <small className="mt-8 block font-mono text-[11px] font-semibold tracking-wider uppercase text-muted">
                {label}
              </small>
              <strong className="mt-2 block text-xl font-bold tracking-tight text-ink">
                {value}
              </strong>
              <span className="absolute bottom-[22px] right-[20px] text-brand opacity-60">
                ↗
              </span>
            </article>
          ))}
        </div>
      </PsPanel>

      <MethodsHub />

      <PsPanel>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-7">
          <div>
            <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
              {t('dashboard.next_step')}
            </span>
            <h2 className="mt-2 text-[22px] font-[650] tracking-[-.035em]">
              {t('dashboard.next_title')}
            </h2>
            <p className="mt-2 max-w-[600px] text-[14px] leading-[1.6] text-muted">
              {t('dashboard.next_desc')}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/learn"
              className="flex min-h-12 items-center gap-2 rounded-lg border border-line bg-panel px-4 font-sans text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              <BookOpenText aria-hidden="true" size={17} />
              {t('dashboard.learn_cta')}
            </Link>
            <Link
              href="/methods/bisection"
              className="flex min-h-12 items-center gap-3 rounded-lg border border-ink bg-ink px-5 font-sans text-[15px] font-[650] tracking-[-.01em] text-brand-ink transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_10px_22px_-10px_var(--brand)] active:translate-y-0"
            >
              {t('dashboard.start_lab')} <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </PsPanel>
    </div>
  );
}
