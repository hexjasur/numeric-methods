'use client';

import {
  ArrowUpRight,
  Atom,
  Binary,
  Calculator,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  FileCode2,
  Globe,
  GraduationCap,
  Layers,
  LineChart,
  Mail,
  MonitorSmartphone,
  Palette,
  Send,
  Shapes,
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
    {
      name: 'Next.js 16',
      cat: 'Framework',
      desc: 'App Router · Turbopack · Static Export',
      icon: Globe,
      color: 'text-brand bg-brand-soft border-brand/20',
      tag: 'Core',
    },
    {
      name: 'React 19',
      cat: 'UI Library',
      desc: 'Hooks · Concurrent UI · Components',
      icon: Atom,
      color: 'text-cyan bg-cyan-soft border-cyan/20',
      tag: 'Frontend',
    },
    {
      name: 'Tailwind CSS 4',
      cat: 'Styling',
      desc: 'High-performance utility styling',
      icon: Palette,
      color: 'text-cyan bg-cyan-soft border-cyan/20',
      tag: 'Design',
    },
    {
      name: 'TypeScript',
      cat: 'Strict Mode',
      desc: 'Strict type safety throughout codebase',
      icon: FileCode2,
      color: 'text-brand bg-brand-soft border-brand/20',
      tag: 'Language',
    },
    {
      name: 'Tauri 2.0',
      cat: 'Desktop & Mobile',
      desc: 'Rust runtime for Windows, Linux & Android',
      icon: MonitorSmartphone,
      color: 'text-brand bg-brand-soft border-brand/20',
      tag: 'Native App',
    },
    {
      name: 'KaTeX',
      cat: 'Math Typography',
      desc: 'Ultra-fast client-side formula rendering',
      icon: Binary,
      color: 'text-cyan bg-cyan-soft border-cyan/20',
      tag: 'LaTeX',
    },
    {
      name: 'Math.js',
      cat: 'Symbolic & Eval',
      desc: 'Mathematical parsing & numerical solver',
      icon: Calculator,
      color: 'text-brand bg-brand-soft border-brand/20',
      tag: 'Engine',
    },
    {
      name: 'Bun',
      cat: 'Runtime & PM',
      desc: 'Speedy package manager & build pipeline',
      icon: Zap,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      tag: 'Tooling',
    },
    {
      name: 'Recharts',
      cat: 'Visualization',
      desc: 'Dynamic SVG function graphs & traces',
      icon: LineChart,
      color: 'text-cyan bg-cyan-soft border-cyan/20',
      tag: 'Charts',
    },
    {
      name: 'Lucide Icons',
      cat: 'Iconography',
      desc: 'Clean & accessible vector icons',
      icon: Shapes,
      color: 'text-ink bg-bg-2 border-line-2',
      tag: 'Icons',
    },
  ];

  const history = [
    {
      version: `v${packageJson.version} (${t('about.status_current')})`,
      date: '2026',
      title: t('about.v3_title'),
      desc: t('about.v3_desc'),
      active: true,
    },
    {
      version: `v2.0 (${t('about.status_archive')})`,
      date: '2026',
      title: t('about.v2_title'),
      desc: t('about.v2_desc'),
      link: 'https://v2.sonli-usullar.uz',
      active: false,
    },
    {
      version: `v1.0 (${t('about.status_initial')})`,
      date: '2026-03',
      title: t('about.v1_title'),
      desc: t('about.v1_desc'),
      active: false,
    },
  ];

  return (
    <div className="relative mx-auto max-w-[1080px] px-0 sm:px-2 md:px-4 pb-16">
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
                  {t('about.author_badge')}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group flex items-start gap-3 p-3.5 rounded-xl border border-line bg-bg-2 hover:border-brand/40 hover:bg-panel transition-all"
            >
              <span
                className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 border transition-transform group-hover:scale-105 ${tech.color}`}
              >
                <tech.icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-[13.5px] font-bold text-ink truncate">
                    {tech.name}
                  </strong>
                  <span className="font-mono text-[10px] font-semibold text-muted px-1.5 py-0.5 rounded border border-line bg-panel shrink-0">
                    {tech.tag}
                  </span>
                </div>
                <span className="block font-mono text-[11px] font-semibold text-brand mt-0.5">
                  {tech.cat}
                </span>
                <p className="text-[11.5px] text-muted leading-relaxed mt-1 line-clamp-1">
                  {tech.desc}
                </p>
              </div>
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
                    {t('about.status_badge_current')}
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
            {t('about.footer_univ')}
          </span>
          <Link
            href="/methods/bisection"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-brand-ink font-semibold text-xs transition-all hover:brightness-110"
          >
            <span>{t('about.btn_start_lab')}</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </PsPanel>
    </div>
  );
}
