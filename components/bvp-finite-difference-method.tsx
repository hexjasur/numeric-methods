'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { Activity, Calculator, Check, Copy, Info } from 'lucide-react';
import katex from 'katex';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsMap, PsNote, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { solveBvp, type BvpInput, type BvpResult } from '@/lib/bvp-finite-difference';
import { DEFAULT_BVP_INTERVALS, parseBvpProblem } from '@/lib/parse-bvp-problem';

const INITIAL: BvpInput = {
  p: '0', q: '0', f: '0', a: '0', b: '1', h: String(1 / DEFAULT_BVP_INTERVALS), intervals: String(DEFAULT_BVP_INTERVALS),
  m0: '1', m1: '0', m2: '0', g0: '1', g1: '0', g2: '1',
};
const EMPTY_PROBLEM = { equation: '', leftBoundary: '', rightBoundary: '' };
const EXAMPLE_PROBLEM = {
  equation: "y'' - 2(1 + x^2)y = 0",
  leftBoundary: 'y(0) = 0',
  rightBoundary: 'y(0.8) = 3.5',
};
const fmt = (value: number) => Number(value.toFixed(6)).toString();
type KnownBoundaries = { left: number; right: number; lastInteriorIndex: number };

function getSystemEquation(
  row: BvpResult['rows'][number],
  knownBoundaries?: KnownBoundaries,
) {
  const index = row.index - 1;
  const leftCoefficient = knownBoundaries && row.index === 2 ? 0 : row.a;
  const rightCoefficient = knownBoundaries && row.index === knownBoundaries.lastInteriorIndex
    ? 0
    : row.c;
  const rhs = (knownBoundaries && row.index === 2
    ? row.d - row.a * knownBoundaries.left
    : row.d) - (knownBoundaries && row.index === knownBoundaries.lastInteriorIndex
    ? row.c * knownBoundaries.right
    : 0);
  const terms = [
    { coefficient: leftCoefficient, variable: index - 1 },
    { coefficient: row.b, variable: index },
    { coefficient: rightCoefficient, variable: index + 1 },
  ].filter(({ coefficient }) => Math.abs(coefficient) > 1e-12);
  return { terms, rhs };
}

function formatSystemEquation(row: BvpResult['rows'][number], knownBoundaries?: KnownBoundaries): string {
  const { terms, rhs } = getSystemEquation(row, knownBoundaries);

  const left = terms.map(({ coefficient, variable }, termIndex) => {
    const sign = coefficient < 0 ? '−' : '+';
    const magnitude = fmt(Math.abs(coefficient));
    const term = Math.abs(Math.abs(coefficient) - 1) < 1e-12
      ? `y${variable}`
      : `${magnitude}·y${variable}`;
    return `${termIndex === 0 ? (coefficient < 0 ? '− ' : '') : ` ${sign} `}${term}`;
  }).join('');

  return `${left} = ${fmt(rhs)}`;
}

function formatSystemEquationTex(row: BvpResult['rows'][number], knownBoundaries?: KnownBoundaries): string {
  const { terms, rhs } = getSystemEquation(row, knownBoundaries);
  const left = terms.map(({ coefficient, variable }, termIndex) => {
    const sign = coefficient < 0 ? '-' : '+';
    const magnitude = Math.abs(coefficient);
    const term = Math.abs(magnitude - 1) < 1e-12
      ? `y_{${variable}}`
      : `${fmt(magnitude)}\\,y_{${variable}}`;
    return `${termIndex === 0 ? (coefficient < 0 ? '-' : '') : sign}${term}`;
  }).join('');
  return `${left}&=${fmt(rhs)}`;
}

function MathDisplay({ tex }: { tex: string }) {
  const markup = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: true }),
    [tex],
  );
  return (
    <div
      className="w-full max-w-full overflow-x-auto text-cyan [&_.katex-display]:!my-1 [&_.katex-display]:!w-max [&_.katex-display]:!min-w-full [&_.katex]:!max-w-none"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function SolutionPlot({ result }: { result: BvpResult }) {
  const width = 720;
  const height = 240;
  const pad = 28;
  const ys = result.rows.map((row) => row.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const points = result.rows.map((row, index) => {
    const x = pad + (index / Math.max(result.rows.length - 1, 1)) * (width - 2 * pad);
    const y = height - pad - ((row.y - min) / span) * (height - 2 * pad);
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-line bg-bg-2 p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[520px] w-full" role="img" aria-label="Numerical solution plot">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="currentColor" opacity=".25" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="currentColor" opacity=".25" />
        <polyline points={points} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {result.rows.map((row, index) => {
          const x = pad + (index / Math.max(result.rows.length - 1, 1)) * (width - 2 * pad);
          const y = height - pad - ((row.y - min) / span) * (height - 2 * pad);
          return <circle key={row.index} cx={x} cy={y} r="3" fill="var(--brand)" />;
        })}
        <text x={pad} y={height - 7} fontSize="11" fill="currentColor">x = {fmt(result.rows[0].x)}</text>
        <text x={width - pad} y={height - 7} textAnchor="end" fontSize="11" fill="currentColor">x = {fmt(result.rows[result.rows.length - 1].x)}</text>
        <text x={pad + 5} y={pad + 13} fontSize="11" fill="currentColor">y ∈ [{fmt(min)}, {fmt(max)}]</text>
      </svg>
    </div>
  );
}

export function BvpFiniteDifferenceMethod() {
  const { t } = useI18n();
  const [input, setInput] = useState(INITIAL);
  const [problemFields, setProblemFields] = useState(EMPTY_PROBLEM);
  const [result, setResult] = useState<BvpResult | null>(null);
  const [error, setError] = useState('');
  const [parsedNotice, setParsedNotice] = useState('');
  const [copiedNotebook, setCopiedNotebook] = useState(false);
  const [copyError, setCopyError] = useState('');
  const updateProblemField = (key: keyof typeof EMPTY_PROBLEM, value: string) => {
    setProblemFields((current) => ({ ...current, [key]: value }));
    setError('');
    setParsedNotice('');
    setCopiedNotebook(false);
    setCopyError('');
  };
  const update = (key: keyof BvpInput, value: string) => {
    setInput((current) => {
      const next = { ...current, [key]: value };
      if (key === 'a' || key === 'b') {
        const step = (Number(next.b) - Number(next.a)) / DEFAULT_BVP_INTERVALS;
        if (Number.isFinite(step) && step > 0) {
          next.intervals = String(DEFAULT_BVP_INTERVALS);
          next.h = String(step);
        }
      }
      return next;
    });
    setResult(null);
    setError('');
    setParsedNotice('');
    setCopiedNotebook(false);
    setCopyError('');
  };
  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setResult(solveBvp(input));
      setError('');
      setCopiedNotebook(false);
      setCopyError('');
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : t('bvp.error'));
    }
  };
  const parseProblem = (fields = problemFields) => {
    try {
      const text = [fields.equation, fields.leftBoundary, fields.rightBoundary]
        .filter(Boolean)
        .join('\n');
      const parsed = parseBvpProblem(text, input);
      setInput(parsed);
      setResult(null);
      setError('');
      setParsedNotice(t('bvp.parsed_summary', {
        h: fmt((Number(parsed.b) - Number(parsed.a)) / Number(parsed.intervals)),
        a: parsed.a, b: parsed.b, n: parsed.intervals,
      }));
    } catch (cause) {
      setResult(null);
      setParsedNotice('');
      setError(cause instanceof Error ? cause.message : t('bvp.parse_error'));
    }
  };
  const applyExample = () => {
    setProblemFields(EXAMPLE_PROBLEM);
    setResult(null);
    setError('');
    setParsedNotice('');
    parseProblem(EXAMPLE_PROBLEM);
  };
  const fields: Array<{ key: keyof BvpInput; label: string; step?: string }> = [
    { key: 'p', label: 'P(x)' }, { key: 'q', label: 'Q(x)' }, { key: 'f', label: 'f(x)' },
    { key: 'a', label: 'a =', step: 'any' }, { key: 'b', label: 'b =', step: 'any' },
    { key: 'm0', label: 'm₀' }, { key: 'm1', label: 'm₁' }, { key: 'm2', label: 'm₂' },
    { key: 'g0', label: 'g₀' }, { key: 'g1', label: 'g₁' }, { key: 'g2', label: 'g₂' },
  ];
  const nodes = result?.rows ?? [];
  const backwards = result?.backward ?? [];
  const tableHeaders = useMemo(() => ['k', 'xₖ', 'aₖ', 'bₖ', 'cₖ', 'dₖ', 'pivotₖ', 'uₖ', 'vₖ', 'yₖ', 'rₖ'], []);
  const hasDirichletBoundaries = Number(input.m1) === 0 && Number(input.g1) === 0;
  const knownBoundaries = hasDirichletBoundaries && nodes.length > 2
    ? {
        left: Number(input.m2) / Number(input.m0),
        right: Number(input.g2) / Number(input.g0),
        lastInteriorIndex: nodes.length - 1,
      }
    : undefined;
  const systemRows = hasDirichletBoundaries ? nodes.slice(1, -1) : nodes;
  const copyNotebook = async () => {
    if (!result) return;
    const notebook = [
      t('bvp.notebook_title'),
      '',
      `1. ${t('bvp.notebook_grid')}: xᵢ = a + ih, a = ${input.a}, b = ${input.b}, h = ${fmt(result.h)}, n = ${input.intervals}.`,
      `2. ${t('bvp.notebook_equation')}: y″ + (${input.p})y′ + (${input.q})y = ${input.f}.`,
      `3. ${t('bvp.notebook_differences')}: y′ᵢ ≈ (yᵢ₊₁ − yᵢ₋₁)/(2h), y″ᵢ ≈ (yᵢ₋₁ − 2yᵢ + yᵢ₊₁)/h².`,
      `4. ${t('bvp.notebook_boundary')}: (${input.m0} − ${input.m1}/h)y₀ + (${input.m1}/h)y₁ = ${input.m2}; −(${input.g1}/h)yₙ₋₁ + (${input.g0} + ${input.g1}/h)yₙ = ${input.g2}.`,
      `5. ${t('bvp.notebook_interior')}: (1 − hP(xᵢ)/2)yᵢ₋₁ + (−2 + h²Q(xᵢ))yᵢ + (1 + hP(xᵢ)/2)yᵢ₊₁ = h²f(xᵢ).`,
      `6. ${t('bvp.notebook_system')}:`,
      ...systemRows.map((row, index) => `  ${index + 1}) x = ${fmt(row.x)}: ${formatSystemEquation(row, knownBoundaries)}`),
      `7. ${t('bvp.notebook_sweep')}: u₁ = −c₁/b₁, v₁ = d₁/b₁; uₖ = −cₖ/(aₖuₖ₋₁ + bₖ), vₖ = (dₖ − aₖvₖ₋₁)/(aₖuₖ₋₁ + bₖ); yₙ = vₙ, yₖ = uₖyₖ₊₁ + vₖ.`,
      '',
      t('bvp.notebook_values'),
      ...result.rows.map((row) => `  k=${row.index}: x=${fmt(row.x)}, pivot=${fmt(row.pivot)}, u=${fmt(row.u)}, v=${fmt(row.v)}, y=${fmt(row.y)}`),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(notebook);
      setCopiedNotebook(true);
      setCopyError('');
    } catch {
      setCopiedNotebook(false);
      setCopyError(t('bvp.copy_error'));
    }
  };
  return (
    <div className="relative mx-auto max-w-[1160px] px-0 pb-12 sm:px-2 md:px-4">
      <PsStrip eyebrow="ODE / FD" id="ODE" name={t('nav.bvp')} />
      <PsHero eyebrow={t('bvp.eyebrow')} title={t('bvp.title')} titleHighlight={t('bvp.title_highlight')} lead={t('bvp.lead')} conditionMain={<>y″ + P(x)y′ + Q(x)y = f(x)</>} conditionSub={t('bvp.boundaries')} />
      <PsMap eyebrow={t('bvp.map_eyebrow')} title={t('bvp.map_title')} steps={[
        { n: '01', t: t('bvp.map_1'), s: t('bvp.map_1_desc') },
        { n: '02', t: t('bvp.map_2'), s: t('bvp.map_2_desc') },
        { n: '03', t: t('bvp.map_3'), s: t('bvp.map_3_desc') },
      ]} />
      <div className="grid min-w-0 items-start gap-[18px] lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-[18px] lg:sticky lg:top-4">
          <PsPanel>
            <PsPanelHead eyebrow={t('bvp.input_eyebrow')} title={t('bvp.input_title')} idx="01" />
            <form onSubmit={calculate} className="space-y-4">
              <details open className="rounded-lg border border-line bg-bg-2 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-ink">{t('bvp.full_problem_label')}</summary>
                <div className="mt-3 space-y-3">
                  <p id="bvp-problem-hint" className="text-xs leading-relaxed text-muted">{t('bvp.full_problem_hint')}</p>
                  {([
                    { key: 'equation', label: t('bvp.equation_label') },
                    { key: 'leftBoundary', label: t('bvp.left_boundary_label') },
                    { key: 'rightBoundary', label: t('bvp.right_boundary_label') },
                  ] as const).map(({ key, label }) => (
                    <label key={key} className="block min-w-0">
                      <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
                      <input
                        id={`bvp-problem-${key}`}
                        name={`bvp-problem-${key}`}
                        type="text"
                        value={problemFields[key]}
                        onChange={(event) => updateProblemField(key, event.target.value)}
                        aria-describedby="bvp-problem-hint"
                        autoCapitalize="off"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder={
                          key === 'equation' ? "y'' - 2(1 + x^2)y = 0"
                            : key === 'leftBoundary' ? 'y(0) = 0'
                              : 'y(0.8) = 3.5'
                        }
                        className="block w-full min-w-0 rounded-lg border border-line bg-panel px-3 py-2 font-mono text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft"
                      />
                    </label>
                  ))}
                  <div className="flex flex-col gap-2">
                    <button type="button" onClick={() => parseProblem()} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-3 py-2 text-center text-sm font-semibold leading-snug text-brand-ink hover:opacity-90">{t('bvp.parse_button')}</button>
                    <button type="button" onClick={applyExample} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-brand/40 bg-brand-soft px-3 py-2 text-center text-sm font-semibold leading-snug text-brand transition-colors hover:bg-brand/15">{t('bvp.example_button')}</button>
                  </div>
                  {parsedNotice && <p role="status" className="rounded-md bg-emerald-500/10 p-2 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">{parsedNotice}</p>}
                </div>
              </details>
              <p className="text-xs leading-relaxed text-muted">{t('bvp.expression_hint')}</p>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {fields.map(({ key, label, step }) => (
                  <label key={key} className="min-w-0">
                    <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
                    <input type={['a', 'b'].includes(key) ? 'number' : 'text'} step={step ?? 'any'} value={input[key]} onChange={(event) => update(key, event.target.value)} required className="w-full min-w-0 rounded-lg border border-line bg-bg-2 px-2 py-2 font-mono text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft" />
                  </label>
                ))}
              </div>
              <p className="-mt-2 text-[11px] text-muted">{t('bvp.steps_derived', { count: input.intervals, h: fmt((Number(input.b) - Number(input.a)) / Number(input.intervals)) })}</p>
              <div className="rounded-lg border border-line bg-bg-2 p-3 text-xs leading-relaxed text-muted">
                <strong className="text-ink">{t('bvp.left')}:</strong> m₀y(a) + m₁y′(a) = m₂<br />
                <strong className="text-ink">{t('bvp.right')}:</strong> g₀y(b) + g₁y′(b) = g₂
              </div>
              <button type="submit" className="flex min-h-12 w-full flex-wrap items-center justify-center gap-2 rounded-lg bg-brand px-3 py-3 text-center font-semibold leading-snug text-brand-ink transition-opacity hover:opacity-90"><Calculator size={17} className="shrink-0" /><span className="min-w-0">{t('bvp.calculate')}</span></button>
              {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
            </form>
          </PsPanel>
          <PsNote icon={<Info size={15} />} variant="cyan"><span className="text-sm">{t('bvp.note')}</span></PsNote>
        </aside>
        <div className="min-w-0 space-y-[18px]">
          {result && (
            <PsPanel>
              <PsPanelHead eyebrow={t('bvp.derivation_eyebrow')} title={t('bvp.notebook_title')} idx="02" />
              <p className="mb-4 text-sm leading-relaxed text-muted">{t('bvp.notebook_intro')}</p>
              <div className="mb-5 flex flex-wrap items-start gap-3 rounded-lg border border-line bg-bg-2 p-3 text-sm">
                <span className="font-semibold text-ink">{t('bvp.notebook_grid')}:</span>
                <MathDisplay tex={`x_i=a+ih,\\quad a=${input.a},\\quad b=${input.b},\\quad h=\\frac{${input.b}-${input.a}}{${input.intervals}}=${fmt(result.h)},\\quad n=${input.intervals}`} />
              </div>
              <ol className="space-y-4">
                <li className="rounded-lg border border-line bg-bg-2 p-3">
                  <h3 className="mb-2 text-sm font-semibold text-ink">{t('bvp.notebook_equation')}</h3>
                  <MathDisplay tex={String.raw`y''+P(x)y'+Q(x)y=f(x)`} />
                  <p className="mt-2 overflow-x-auto font-mono text-sm text-muted">
                    y″ + ({input.p})y′ + ({input.q})y = {input.f}
                  </p>
                </li>
                <li className="rounded-lg border border-line bg-bg-2 p-3">
                  <h3 className="mb-2 text-sm font-semibold text-ink">{t('bvp.notebook_differences')}</h3>
                  <div className="space-y-2">
                    <MathDisplay tex={String.raw`y_i' \approx \frac{y_{i+1}-y_{i-1}}{2h}`} />
                    <MathDisplay tex={String.raw`y_i'' \approx \frac{y_{i-1}-2y_i+y_{i+1}}{h^2}`} />
                    <p className="text-xs leading-relaxed text-muted">{t('bvp.notebook_substitution')}</p>
                    <MathDisplay tex={String.raw`\left(1-\frac{hP(x_i)}{2}\right)y_{i-1}+\left(-2+h^2Q(x_i)\right)y_i+\left(1+\frac{hP(x_i)}{2}\right)y_{i+1}=h^2f(x_i)`} />
                  </div>
                </li>
                <li className="rounded-lg border border-line bg-bg-2 p-3">
                  <h3 className="mb-2 text-sm font-semibold text-ink">{t('bvp.notebook_boundary')}</h3>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted">{t('bvp.left')}</p>
                    <MathDisplay tex={String.raw`m_0y_0+m_1\frac{y_1-y_0}{h}=m_2`} />
                    <MathDisplay tex={`\\Rightarrow\\left(${input.m0}-\\frac{${input.m1}}{${fmt(result.h)}}\\right)y_0+\\frac{${input.m1}}{${fmt(result.h)}}y_1=${input.m2}`} />
                    <p className="text-xs text-muted">{t('bvp.notebook_left_after')}</p>
                    <p className="text-xs font-semibold text-muted">{t('bvp.right')}</p>
                    <MathDisplay tex={String.raw`g_0y_n+g_1\frac{y_n-y_{n-1}}{h}=g_2`} />
                    <MathDisplay tex={`\\Rightarrow-\\frac{${input.g1}}{${fmt(result.h)}}y_{${Number(input.intervals) - 1}}+\\left(${input.g0}+\\frac{${input.g1}}{${fmt(result.h)}}\\right)y_${input.intervals}=${input.g2}`} />
                    <p className="text-xs text-muted">{t('bvp.notebook_right_after')}</p>
                    <div className="overflow-x-auto rounded-md bg-panel px-3 py-2">
                      <MathDisplay tex={`\\begin{aligned}${formatSystemEquationTex(nodes[0])}\\\\${formatSystemEquationTex(nodes[nodes.length - 1])}\\end{aligned}`} />
                    </div>
                  </div>
                </li>
                <li className="rounded-lg border border-brand/30 bg-brand-soft/30 p-3">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-ink">{t('bvp.notebook_system')}</h3>
                    <span className="text-xs text-muted">
                      {hasDirichletBoundaries
                        ? t('bvp.notebook_system_reduced_hint')
                        : t('bvp.notebook_system_hint')}
                    </span>
                  </div>
                  <div className="max-h-[28rem] overflow-auto rounded-md bg-panel px-3 py-4">
                    <MathDisplay tex={`\\left\\{\\begin{aligned}${systemRows.map((row) => formatSystemEquationTex(row, knownBoundaries)).join('\\\\')}\\end{aligned}\\right.`} />
                  </div>
                </li>
                <li className="rounded-lg border border-line bg-bg-2 p-3">
                  <h3 className="mb-2 text-sm font-semibold text-ink">{t('bvp.notebook_sweep')}</h3>
                  <div className="space-y-2">
                    <MathDisplay tex={String.raw`u_1=-\frac{c_1}{b_1},\quad v_1=\frac{d_1}{b_1}`} />
                    <MathDisplay tex={String.raw`u_k=-\frac{c_k}{a_ku_{k-1}+b_k},\quad v_k=\frac{d_k-a_kv_{k-1}}{a_ku_{k-1}+b_k}`} />
                    <MathDisplay tex={String.raw`y_n=v_n,\quad y_k=u_ky_{k+1}+v_k`} />
                    <p className="text-xs leading-relaxed text-muted">{t('bvp.notebook_sweep_hint')}</p>
                  </div>
                </li>
              </ol>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" onClick={copyNotebook} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-sm font-semibold text-brand hover:bg-brand/20">
                  {copiedNotebook ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copiedNotebook ? t('bvp.copy_done') : t('bvp.copy_button')}
                </button>
                {copyError && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{copyError}</p>}
                <span className="text-xs text-muted">{t('bvp.notebook_values')}: {nodes.length}</span>
              </div>
            </PsPanel>
          )}
          <PsPanel>
            <PsPanelHead eyebrow={t('bvp.matrix_eyebrow')} title={t('bvp.matrix_title')} idx={result ? '03' : '02'} />
            {!result ? <p className="py-8 text-center text-sm text-muted">{t('bvp.empty')}</p> : <>
              <div className="mb-3 overflow-x-auto">
                <MathDisplay tex={`h=\\frac{${input.b}-${input.a}}{${input.intervals}}=${fmt(result.h)}`} />
              </div>
              <div className="overflow-x-auto rounded-lg border border-line">
                <table className="w-full min-w-[760px] text-right font-mono text-xs"><thead className="bg-bg-2 text-muted"><tr>{tableHeaders.map((head) => <th key={head} className="px-2 py-2">{head}</th>)}</tr></thead><tbody>{nodes.map((row) => <tr key={row.index} className="border-t border-line"><td className="px-2 py-2">{row.index}</td><td className="px-2 py-2">{fmt(row.x)}</td><td className="px-2 py-2">{fmt(row.a)}</td><td className="px-2 py-2">{fmt(row.b)}</td><td className="px-2 py-2">{fmt(row.c)}</td><td className="px-2 py-2">{fmt(row.d)}</td><td className="px-2 py-2">{fmt(row.pivot)}</td><td className="px-2 py-2">{fmt(row.u)}</td><td className="px-2 py-2">{fmt(row.v)}</td><td className="px-2 py-2 font-bold text-brand">{fmt(row.y)}</td><td className="px-2 py-2">{row.residual.toExponential(2)}</td></tr>)}</tbody></table>
              </div>
            </>}
          </PsPanel>
          {result && <>
            <PsPanel>
              <PsPanelHead eyebrow={t('bvp.backward_eyebrow')} title={t('bvp.backward_title')} idx="04" />
              <p className="mb-3 font-mono text-xs text-muted">yₖ = uₖ · yₖ₊₁ + vₖ, &nbsp; yₙ₊₁ = vₙ₊₁</p>
              <div className="space-y-1.5">{backwards.map((step) => <div key={step.index} className="rounded-md bg-bg-2 px-3 py-2 font-mono text-xs"><span className="text-muted">{step.nextY === null ? `y${step.index} = v${step.index}` : `y${step.index} = u${step.index} · ${fmt(step.nextY)} + v${step.index}`} = </span><strong className="text-brand">{fmt(step.y)}</strong></div>)}</div>
            </PsPanel>
            <PsPanel>
              <PsPanelHead eyebrow={t('bvp.result_eyebrow')} title={t('bvp.result_title')} idx="05" />
              <div className="mb-4 flex items-center gap-2 text-sm"><Activity size={17} className="text-brand" />{t('bvp.max_residual')}: <strong className="font-mono text-brand">{result.maxResidual.toExponential(3)}</strong></div>
              <SolutionPlot result={result} />
              <div className="mt-4 overflow-x-auto rounded-lg border border-line"><table className="w-full min-w-[280px] text-left font-mono text-xs"><thead className="bg-bg-2 text-muted"><tr><th className="px-3 py-2">xₖ</th><th className="px-3 py-2">yₖ</th></tr></thead><tbody>{nodes.map((row) => <tr key={row.index} className="border-t border-line"><td className="px-3 py-2">{fmt(row.x)}</td><td className="px-3 py-2 font-semibold text-brand">{fmt(row.y)}</td></tr>)}</tbody></table></div>
            </PsPanel>
          </>}
        </div>
      </div>
    </div>
  );
}
