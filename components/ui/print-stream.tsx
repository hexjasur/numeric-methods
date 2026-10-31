import React from 'react';

// Barcode strip component
export function PsStrip({ eyebrow, id, name }: { eyebrow: string; id: string; name: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3.5 font-mono text-[11px] sm:text-xs font-semibold tracking-[.1em] sm:tracking-[.14em] uppercase text-muted py-2 px-3 sm:py-2.5 sm:px-3.5 border border-line rounded-lg bg-panel shadow-[var(--shadow)] overflow-hidden">
      <span className="shrink-0">{eyebrow}</span>
      <i className="ps-barcode flex-1 h-[12px] sm:h-[14px] opacity-55 min-w-[20px]" aria-hidden />
      <span className="shrink-0 truncate text-right max-w-[200px] sm:max-w-none">{id} · {name}</span>
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
    <section className="flex flex-wrap items-end justify-between gap-4 sm:gap-8 my-4 sm:my-8">
      <div className="min-w-0 max-w-full">
        <span className="block font-mono text-[11px] sm:text-xs font-semibold tracking-[.12em] sm:tracking-[.14em] uppercase text-muted leading-[1.2]">
          {eyebrow}
        </span>
        <h1 className="my-2.5 sm:my-5 text-[clamp(28px,6.5vw,72px)] font-bold leading-[1.05] tracking-[-.04em] sm:tracking-[-.06em] break-words">
          {title} <em className="not-italic text-cyan relative after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[.06em] after:h-[.07em] after:bg-brand">{titleHighlight}</em>
        </h1>
        <p className="m-0 text-muted text-[14px] sm:text-[17px] max-w-[520px] leading-relaxed">
          {lead}
        </p>
      </div>
      {conditionMain && (
        <div className="border border-line bg-panel rounded-[10px] py-2.5 px-3 sm:py-3.5 sm:px-4.5 shadow-[var(--shadow)] relative overflow-x-auto overflow-y-hidden max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap before:content-[''] before:absolute before:inset-0 before:bg-[var(--stripe)] before:pointer-events-none mt-2 sm:mt-5">
          <span className="relative block font-mono text-base sm:text-lg md:text-xl font-semibold text-ink [&>b]:text-brand [&_.katex]:font-normal [&_.katex]:text-[0.92em]">
            {conditionMain}
          </span>
          {conditionSub && (
            <small className="relative block mt-1.5 sm:mt-2.5 font-mono text-[11px] sm:text-xs font-medium text-muted tracking-[.04em]">
              {conditionSub}
            </small>
          )}
        </div>
      )}
    </section>
  );
}

// Step Map
export function PsMap({ steps, title = "3 ta oddiy qadam", eyebrow = "Method map" }: { steps: {n: string, t: React.ReactNode, s: React.ReactNode}[], title?: string, eyebrow?: string }) {
  return (
    <section className="flex flex-col lg:flex-row items-stretch gap-4 my-6 p-4 bg-panel border border-line rounded-[10px] shadow-[var(--shadow)]">
      <div className="grid gap-1.5 content-center pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-dashed border-line-2 shrink-0 lg:pr-5 w-full lg:w-auto min-w-[170px]">
        <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
          {eyebrow}
        </span>
        <strong className="text-[15px] text-ink">{title}</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 flex-1 gap-4 items-stretch relative min-w-0">
        {steps.map((step, i) => (
          <div className="relative flex gap-3 items-start min-w-0" key={step.n}>
            {i > 0 && <i className="hidden md:block absolute -left-2.5 top-3 w-1.5 h-px bg-line-2" aria-hidden />}
            <span className="font-mono text-sm font-bold text-brand py-1 px-1.5 border border-brand rounded bg-brand-soft shrink-0">
              {step.n}
            </span>
            <div className="flex-1 min-w-0">
              <b className="block text-sm font-bold text-ink">{step.t}</b>
              <div className="mt-1 text-[13px] text-muted leading-[1.4]">{step.s}</div>
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
