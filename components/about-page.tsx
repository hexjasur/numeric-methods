'use client';

import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { PsHero, PsStrip, PsPanel, PsPanelHead } from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';
import packageJson from '@/package.json';

export function AboutPage() {
  const { t } = useI18n();

  const features = [
    {
      icon: Zap,
      title: t('about.feat_1_title'),
      desc: t('about.feat_1_desc'),
      badge: 'REALTIME',
    },
    {
      icon: Layers,
      title: t('about.feat_2_title'),
      desc: t('about.feat_2_desc'),
      badge: 'AUDIT',
    },
    {
      icon: Sparkles,
      title: t('about.feat_3_title'),
      desc: t('about.feat_3_desc'),
      badge: 'LATEX',
    },
    {
      icon: Globe,
      title: t('about.feat_4_title'),
      desc: t('about.feat_4_desc'),
      badge: 'TAURI 2.0',
    },
    {
      icon: CheckCircle2,
      title: t('about.feat_5_title'),
      desc: t('about.feat_5_desc'),
      badge: 'I18N (UZ/RU/EN)',
    },
    {
      icon: Cpu,
      title: t('about.feat_6_title'),
      desc: t('about.feat_6_desc'),
      badge: 'DARK / LIGHT',
    },
  ];

  const techStack = [
    { name: 'Next.js 16', cat: 'Framework', bg: 'bg-ink text-panel' },
    { name: 'React 19', cat: 'UI Library', bg: 'bg-cyan-soft text-cyan border border-cyan/30' },
    { name: 'Tailwind CSS 4', cat: 'Styling', bg: 'bg-brand-soft text-brand border border-brand/30' },
    { name: 'TypeScript', cat: 'Strict Mode', bg: 'bg-line/40 text-ink border border-line-2' },
    { name: 'Tauri 2.0', cat: 'Desktop & Mobile', bg: 'bg-ink text-white' },
    { name: 'KaTeX', cat: 'Math Typography', bg: 'bg-bg-2 text-ink border border-line' },
    { name: 'Math.js', cat: 'Symbolic & Eval', bg: 'bg-bg-2 text-ink border border-line' },
    { name: 'Bun', cat: 'Runtime & PM', bg: 'bg-brand-soft text-brand border border-brand/30' },
    { name: 'Lucide Icons', cat: 'Iconography', bg: 'bg-line/40 text-ink border border-line-2' },
  ];

  const history = [
    {
      version: 'v3.0 (Joriy)',
      date: '2026',
      title: t('about.v3_title'),
      desc: t('about.v3_desc'),
      active: true,
    },
    {
      version: 'v2.0 (Arxiv)',
      date: '2026',
      title: t('about.v2_title'),
      desc: t('about.v2_desc'),
      link: 'https://v2.sonli-usullar.uz',
      active: false,
    },
    {
      version: 'v1.0 (Boshlang‘ich)',
      date: '2026-03',
      title: t('about.v1_title'),
      desc: t('about.v1_desc'),
      active: false,
    },
  ];

  return (
    <div className="relative max-w-[1080px] mx-auto px-4 pb-16">
      <PsStrip eyebrow="DOC-002" id="ABOUT" name={t('about.strip')} />

      <PsHero
        eyebrow={t('about.hero_eyebrow')}
        title={<>{t('about.hero_title')} <em>{t('about.hero_titleHighlight')}</em></>}
        titleHighlight=""
        lead={t('about.hero_lead')}
      />

      {/* ── 01: MUALLIF VA KONSEPSIYA ── */}
      <PsPanel className="mb-[18px]">
        <PsPanelHead eyebrow={t('about.author_eyebrow')} title={t('about.author_title')} idx="01" />

        <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl bg-brand-soft border border-brand/30 text-brand grid place-items-center shrink-0 shadow-sm">
            <GraduationCap size={44} />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-extrabold text-ink tracking-tight">
                  {t('about.author_name')}
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand text-brand-ink">
                  QarDU · 2026
                </span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded border border-line bg-panel text-muted">
                  v{packageJson.version}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-brand">
                {t('about.author_role')}
              </p>
            </div>

            <p className="text-[14.5px] leading-relaxed text-ink/90 max-w-2xl">
              {t('about.author_bio')}
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-line">
              <a
                href="https://t.me/KanYonA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line bg-panel hover:bg-brand-soft hover:border-brand/40 text-ink text-xs font-semibold transition-all"
              >
                <Send size={14} className="text-brand" />
                <span>{t('about.contact_tg')}: @KanYonA</span>
                <ExternalLink size={12} className="opacity-50" />
              </a>

              <a
                href="mailto:jasurhaydarovcode@gmail.com"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line bg-panel hover:bg-brand-soft hover:border-brand/40 text-ink text-xs font-semibold transition-all"
              >
                <Mail size={14} className="text-brand" />
                <span>{t('about.contact_email')}</span>
              </a>

              <a
                href="https://github.com/hexjasur/numeric-methods"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line bg-panel hover:bg-brand-soft hover:border-brand/40 text-ink text-xs font-semibold transition-all"
              >
                <Code2 size={14} className="text-brand" />
                <span>{t('about.contact_github')}</span>
                <ExternalLink size={12} className="opacity-50" />
              </a>
            </div>
          </div>
        </div>
      </PsPanel>

      {/* ── 02: IMKONIYATLAR ── */}
      <PsPanel className="mb-[18px]">
        <PsPanelHead eyebrow={t('about.features_eyebrow')} title={t('about.features_title')} idx="02" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {features.map((f, i) => (
            <article
              key={i}
              className="p-4 rounded-xl border border-line bg-bg-2 transition-all hover:border-brand hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand grid place-items-center">
                  <f.icon size={18} />
                </span>
                <span className="font-mono text-[10px] font-bold text-muted border border-line px-1.5 py-0.5 rounded bg-panel">
                  {f.badge}
                </span>
              </div>
              <h4 className="text-[14.5px] font-bold text-ink mb-1.5">
                {f.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </PsPanel>

      {/* ── 03: TEXNOLOGIYALAR ── */}
      <PsPanel className="mb-[18px]">
        <PsPanelHead eyebrow={t('about.tech_eyebrow')} title={t('about.tech_title')} idx="03" />

        <div className="flex flex-wrap gap-2.5">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${tech.bg}`}
            >
              <span className="font-mono opacity-70 text-[10px] uppercase">{tech.cat}:</span>
              <strong>{tech.name}</strong>
            </div>
          ))}
        </div>
      </PsPanel>

      {/* ── 04: TARIX (VERSIONS) ── */}
      <PsPanel>
        <PsPanelHead eyebrow={t('about.history_eyebrow')} title={t('about.history_title')} idx="04" />

        <div className="space-y-4">
          {history.map((h, i) => (
            <div
              key={i}
              className={`relative pl-6 pb-2 border-l-2 ${
                h.active ? 'border-brand' : 'border-line-2'
              }`}
            >
              <span
                className={`absolute -left-[7px] top-0 w-3 h-3 rounded-full border-2 bg-panel ${
                  h.active ? 'border-brand bg-brand' : 'border-line-2'
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <strong className="text-[14.5px] font-bold text-ink">{h.version}</strong>
                <span className="font-mono text-xs text-muted">({h.date})</span>
                {h.active && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-soft text-brand border border-brand/30">
                    CURRENT
                  </span>
                )}
                {h.link && (
                  <a
                    href={h.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-cyan hover:underline"
                  >
                    <span>v2.sonli-usullar.uz</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <h5 className="text-xs font-bold text-ink mb-1">{h.title}</h5>
              <p className="text-xs text-muted leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs text-muted">
            Qarshi Davlat Universiteti · 2026
          </span>
          <Link
            href="/methods/bisection"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-brand-ink font-semibold text-xs transition-all hover:brightness-110"
          >
            <span>Laboratoriyani boshlash</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </PsPanel>
    </div>
  );
}
