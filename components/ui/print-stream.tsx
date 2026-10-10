import React from 'react';

// Barcode strip component
export function PsStrip({ eyebrow, id, name }: { eyebrow: string; id: string; name: string }) {
  return (
    <div className="flex items-center gap-3.5 font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted py-2.5 px-3.5 border border-line rounded-lg bg-panel shadow-[var(--shadow)]">
      <span>{eyebrow}</span>
      <i className="ps-barcode flex-1 h-[14px] opacity-55" aria-hidden />
      <span>{id} · {name}</span>
    </div>
  );
}

// Hero Section
export function PsHero({
  eyebrow,
  title,
  titleHighlight,
  lead,
  conditionMain,
  conditionSub
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  titleHighlight: React.ReactNode;
  lead: React.ReactNode;
  conditionMain?: React.ReactNode;
  conditionSub?: React.ReactNode;
}) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-8 my-8">
      <div>
        <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
          {eyebrow}
        </span>
        <h1 className="my-5 text-[clamp(44px,7vw,84px)] font-bold leading-[.94] tracking-[-.06em]">
          {title} <em className="not-italic text-cyan relative after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[.06em] after:h-[.07em] after:bg-brand">{titleHighlight}</em>
        </h1>
        <p className="m-0 text-muted text-[17px] max-w-[520px]">
          {lead}
        </p>
      </div>
      {conditionMain && (
        <div className="border border-line bg-panel rounded-[10px] py-4 px-5 shadow-[var(--shadow)] relative overflow-hidden whitespace-nowrap before:content-[''] before:absolute before:inset-0 before:bg-[var(--stripe)] before:pointer-events-none mt-5">
          <span className="relative block font-mono text-2xl font-semibold text-ink [&>b]:text-brand">
            {conditionMain}
          </span>
          {conditionSub && (
            <small className="relative block mt-2.5 font-mono text-xs font-medium text-muted tracking-[.04em]">
              {conditionSub}
            </small>
          )}
        </div>
      )}
    </section>
  );
}

// Step Map
export function PsMap({ steps, title = "3 ta oddiy qadam", eyebrow = "Method map" }: { steps: {n: string, t: string, s: string}[], title?: string, eyebrow?: string }) {
  return (
    <section className="flex flex-wrap items-stretch gap-4 my-6 py-4 px-4 bg-panel border border-line rounded-[10px] shadow-[var(--shadow)] sm:flex-nowrap">
      <div className="grid gap-1.5 content-center sm:pr-4 sm:border-r border-dashed border-line-2 shrink-0 pb-3 sm:pb-0 border-b sm:border-b-0 w-full sm:w-auto">
        <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
          {eyebrow}
        </span>
        <strong className="text-[15px]">{title}</strong>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap flex-1 items-stretch gap-4 relative">
        {steps.map((step, i) => (
          <div className="relative flex-1 flex gap-3 items-start min-w-[200px]" key={step.n}>
            {i > 0 && <i className="hidden sm:block absolute -left-3 top-2.5 w-2 h-px bg-line-2" aria-hidden />}
            <span className="font-mono text-sm font-bold text-brand py-1 px-1.5 border border-brand rounded bg-brand-soft">
              {step.n}
            </span>
            <div>
              <b className="block text-sm font-bold">{step.t}</b>
              <small className="block mt-1 text-[13px] text-muted leading-[1.4]">{step.s}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Custom Panel
export function PsPanel({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <section className={`ps-panel ${className}`}>
      {children}
    </section>
  );
}

export function PsPanelHead({ eyebrow, title, idx }: { eyebrow: string; title: string; idx: string }) {
  return (
    <header className="relative flex justify-between items-start mb-5 pt-1.5 pb-4 pl-7 border-b border-line">
      <div>
        <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
          {eyebrow}
        </span>
        <h2 className="mt-2 text-[22px] font-[650] tracking-[-.035em]">
          {title}
        </h2>
      </div>
      <span className="font-mono text-[13px] font-semibold text-muted">{idx}</span>
    </header>
  );
}

// Note Components
export function PsNote({ children, variant = 'cyan', icon }: { children: React.ReactNode; variant?: 'cyan' | 'orange'; icon?: React.ReactNode }) {
  const isOrange = variant === 'orange';
  return (
    <div className={`flex gap-2.5 items-start py-3 px-3.5 mb-4 text-[13.5px] leading-[1.5] text-muted border-l-[3px] rounded-r-md ${isOrange ? 'border-brand bg-brand-soft mt-1.5' : 'border-cyan bg-cyan-soft'}`}>
      {icon && <div className={`shrink-0 mt-px ${isOrange ? 'text-brand' : 'text-cyan'}`}>{icon}</div>}
      <div className="[&>p]:m-0 [&_b]:text-ink flex-1">
        {children}
      </div>
    </div>
  );
}
