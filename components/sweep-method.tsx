'use client';

import { useMemo, useState, type FormEvent } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Calculator, Check, Info } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { ResultActions } from '@/components/ui/result-actions';
import {
  PsHero,
  PsMap,
  PsNote,
  PsPanel,
  PsPanelHead,
  PsStrip,
} from '@/components/ui/print-stream';
import {
  calculateSweep,
  type SweepInputRow,
  type SweepResult,
} from '@/lib/sweep';

const MIN_SIZE = 2;
const MAX_SIZE = 10;
const PRECISION_OPTIONS = [2, 3, 4, 6, 8, 10] as const;

type CoefficientKey = keyof SweepInputRow;

function formatSweep(value: number, digits: number): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? '0' : rounded.toString();
}

function renderMath(tex: string, displayMode = false): string {
  return katex.renderToString(tex, { throwOnError: false, displayMode });
}

function MathMarkup({
  tex,
  displayMode = false,
  className = '',
}: {
  tex: string;
  displayMode?: boolean;
  className?: string;
}) {
  const html = useMemo(() => renderMath(tex, displayMode), [tex, displayMode]);
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function makeDefaultRows(size: number): SweepInputRow[] {
  return Array.from({ length: size }, (_, index) => {
    const a = index === 0 ? 0 : -1;
    const b = 4;
    const c = index === size - 1 ? 0 : -1;
    const expectedX = index + 1;
    const previousX = index > 0 ? index : 0;
    const nextX = index < size - 1 ? index + 2 : 0;
    const d = a * previousX + b * expectedX + c * nextX;
    return { a: String(a), b: String(b), c: String(c), d: String(d) };
  });
}

const V2_EXAMPLE: SweepInputRow[] = [
  { a: '0', b: '1.5', c: '0.5', d: '3.2' },
  { a: '-1', b: '2', c: '1', d: '-1' },
  { a: '2.5', b: '5', c: '-2', d: '4' },
  { a: '1', b: '3', c: '0', d: '1' },
];

function getForwardFormulas(
  step: SweepResult['forwardSteps'][number],
  digits: number,
): string[] {
  const i = step.index;
  const current = (value: number) => formatSweep(value, digits);
  const pivotTex =
    i === 1
      ? `m_1 = b_1 = ${current(step.b)} = ${current(step.pivot)}`
      : `m_{${i}} = b_{${i}} + a_{${i}}\\alpha_{${i - 1}} = ${current(step.b)} + (${current(step.a)})(${current(step.previousAlpha ?? 0)}) = ${current(step.pivot)}`;
  const alphaTex = `\\alpha_{${i}} = -\\frac{c_{${i}}}{m_{${i}}} = -\\frac{${current(step.c)}}{${current(step.pivot)}} = ${current(step.alpha)}`;
  const betaTex =
    i === 1
      ? `\\beta_1 = \\frac{d_1}{m_1} = \\frac{${current(step.d)}}{${current(step.pivot)}} = ${current(step.beta)}`
      : `\\beta_{${i}} = \\frac{d_{${i}} - a_{${i}}\\beta_{${i - 1}}}{m_{${i}}} = \\frac{${current(step.d)} - (${current(step.a)})(${current(step.previousBeta ?? 0)})}{${current(step.pivot)}} = ${current(step.beta)}`;
  return [pivotTex, alphaTex, betaTex];
}

function getBackwardFormula(
  step: SweepResult['backwardSteps'][number],
  digits: number,
): string {
  const current = (value: number) => formatSweep(value, digits);
  if (step.nextX === null) {
    return `x_{${step.index}} = \\beta_{${step.index}} = ${current(step.beta)} = ${current(step.x)}`;
  }
  return `x_{${step.index}} = \\alpha_{${step.index}}x_{${step.index + 1}} + \\beta_{${step.index}} = (${current(step.alpha)})(${current(step.nextX)}) + (${current(step.beta)}) = ${current(step.x)}`;
}

export function SweepMethod() {
  const { t } = useI18n();
  const [size, setSize] = useState(4);
  const [precision, setPrecision] = useState(6);
  const [rows, setRows] = useState<SweepInputRow[]>(() => makeDefaultRows(4));
  const [result, setResult] = useState<SweepResult | null>(null);
  const [error, setError] = useState('');

  const clearResult = () => {
    setResult(null);
    setError('');
  };

  function updateCoefficient(index: number, key: CoefficientKey, value: string) {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    );
    clearResult();
  }

  function resizeSystem(nextSize: number) {
    const defaultRows = makeDefaultRows(nextSize);
    setRows((current) => {
      const next = Array.from({ length: nextSize }, (_, index) => {
        const previous = current[index];
        if (!previous) return defaultRows[index];
        const wasLastRow = index === current.length - 1;
        return {
          ...previous,
          a: index === 0 ? '0' : previous.a,
          c:
            index === nextSize - 1
              ? '0'
              : wasLastRow && nextSize > current.length
                ? defaultRows[index].c
                : previous.c,
        };
      });
      return next;
    });
    setSize(nextSize);
    clearResult();
  }

  function applyExample(example: 'exact' | 'v2') {
    const nextRows = example === 'v2' ? V2_EXAMPLE.map((row) => ({ ...row })) : makeDefaultRows(4);
    setRows(nextRows);
    setSize(4);
    clearResult();
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setError('');
      setResult(calculateSweep(rows, t));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : t('sweep.err_calc'));
    }
  }

  const forwardHeadings = [
    { tex: 'i', label: t('sweep.tbl_row') },
    { tex: 'm_i', label: t('sweep.tbl_pivot') },
    { tex: '\\alpha_i', label: t('sweep.tbl_alpha') },
    { tex: '\\beta_i', label: t('sweep.tbl_beta') },
  ];

  const reportRows = result?.rows ?? [];
  const toleranceChip = result?.diagonallyDominant
    ? t('sweep.diagonal_ok')
    : t('sweep.diagonal_note');

  return (
    <div className="relative mx-auto max-w-[1160px] px-4 pb-12">
      <PsStrip eyebrow="TDMA-001" id="LINEAR" name={t('nav.sweep')} />

      <PsHero
        eyebrow={t('sweep.hero_eyebrow')}
        title={t('sweep.hero_title')}
        titleHighlight={t('sweep.hero_titleHighlight')}
        lead={t('sweep.hero_lead')}
        conditionMain={<>aᵢxᵢ₋₁ + bᵢxᵢ + cᵢxᵢ₊₁ = dᵢ</>}
        conditionSub={t('sweep.hero_condition')}
      />

      <PsMap
        eyebrow={t('sweep.map_eyebrow')}
        title={t('sweep.map_title')}
        steps={[
          { n: '01', t: t('sweep.map_1_t'), s: t('sweep.map_1_s') },
          { n: '02', t: t('sweep.map_2_t'), s: t('sweep.map_2_s') },
          { n: '03', t: t('sweep.map_3_t'), s: t('sweep.map_3_s') },
        ]}
      />

      <div className="grid items-start gap-[18px] lg:grid-cols-[minmax(290px,340px)_minmax(0,1fr)]">
        <aside className="space-y-[18px] lg:sticky lg:top-4">
          <PsPanel>
            <PsPanelHead
              eyebrow={t('sweep.panel_settings_eyebrow')}
              title={t('sweep.panel_settings_title')}
              idx="01"
            />

            <div className="space-y-4">
              <div className="border-b border-line pb-3">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-muted">
                  {t('sweep.goal_label')}:
                </span>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink">
                  {t('sweep.goal_text')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[13px] font-[650] text-ink">{t('sweep.label_size')}</span>
                  <select
                    value={size}
                    onChange={(event) => resizeSystem(Number(event.target.value))}
                    className="w-full rounded-lg border border-line-2 bg-bg-2 p-[10px_12px] font-mono text-[14px] font-medium text-ink outline-none transition-all focus:border-brand focus:bg-panel focus:ring-4 focus:ring-brand-soft"
                  >
                    {Array.from({ length: MAX_SIZE - MIN_SIZE + 1 }, (_, index) => index + MIN_SIZE).map((n) => (
                      <option key={n} value={n}>{n} × {n}</option>
                    ))}
                  </select>
                </label>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[13px] font-[650] text-ink">{t('sweep.label_precision')}</span>
                  <select
                    value={precision}
                    onChange={(event) => setPrecision(Number(event.target.value))}
                    className="w-full rounded-lg border border-line-2 bg-bg-2 p-[10px_12px] font-mono text-[14px] font-medium text-ink outline-none transition-all focus:border-brand focus:bg-panel focus:ring-4 focus:ring-brand-soft"
                  >
                    {PRECISION_OPTIONS.map((digits) => <option key={digits} value={digits}>{digits}</option>)}
                  </select>
                </label>
              </div>

              <div>
                <strong className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[.1em] text-muted">
                  {t('sweep.examples_title')}
                </strong>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyExample('exact')}
                    className="rounded-md border border-line-2 bg-bg-2 px-2.5 py-1.5 font-mono text-[12px] font-semibold text-brand transition-all hover:-translate-y-px hover:border-brand hover:bg-brand-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan cursor-pointer"
                  >
                    {t('sweep.example_exact')}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyExample('v2')}
                    className="rounded-md border border-line-2 bg-bg-2 px-2.5 py-1.5 font-mono text-[12px] font-semibold text-brand transition-all hover:-translate-y-px hover:border-brand hover:bg-brand-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan cursor-pointer"
                  >
                    {t('sweep.example_v2')}
                  </button>
                </div>
              </div>

              <div className="border-t border-line pt-3">
                <span className="text-[12px] font-semibold text-muted">
                  {t('sweep.residual_formula_title')}
                </span>
                <div className="my-2 overflow-x-auto rounded-lg border border-line bg-bg-2 p-2.5 text-center text-[13px] text-cyan">
                  <MathMarkup tex="r_i = d_i - (a_i x_{i-1} + b_i x_i + c_i x_{i+1})" displayMode />
                </div>
                <p className="text-[11.5px] leading-relaxed text-muted">
                  {t('sweep.residual_formula_note')}
                </p>
              </div>

              <PsNote icon={<Info size={16} />}>
                <p><b>{t('sweep.note_method_title')}</b> — {t('sweep.note_method')}</p>
                <p className="mt-1.5">{t('sweep.note_precision')}</p>
              </PsNote>
            </div>
          </PsPanel>
        </aside>

        <div className="grid min-w-0 gap-[18px]">
          <PsPanel>
            <header className="relative mb-5 flex items-start justify-between border-b border-line pl-7 pt-1.5 pb-4">
              <div>
                <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
                  {t('sweep.matrix_eyebrow')}
                </span>
                <h2 className="mt-2 text-[22px] font-[650] tracking-[-.035em]">
                  {t('sweep.matrix_title')}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded border border-line-2 bg-bg-2 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-muted">
                  {t('sweep.matrix_badge')}
                </span>
                <span className="font-mono text-[13px] font-semibold text-muted">02</span>
              </div>
            </header>

            <form onSubmit={calculate}>
              <div className="mb-4 overflow-x-auto rounded-lg border border-line bg-bg-2">
                <table className="w-full min-w-[480px] border-collapse font-mono text-[13px]">
                  <thead className="sticky top-0 z-10 border-b border-line bg-panel text-muted">
                    <tr>
                      <th className="w-12 px-3 py-3 text-center font-semibold">i</th>
                      <th className="px-3 py-3 text-center font-semibold">
                        <span className="text-ink">aᵢ</span>
                        <span className="ml-1 text-[11px] font-normal text-muted">(a[i])</span>
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        <span className="text-ink">bᵢ</span>
                        <span className="ml-1 text-[11px] font-normal text-muted">(b[i])</span>
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        <span className="text-ink">cᵢ</span>
                        <span className="ml-1 text-[11px] font-normal text-muted">(c[i])</span>
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        <span className="text-ink">dᵢ</span>
                        <span className="ml-1 text-[11px] font-normal text-muted">(d[i])</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr className="border-b border-line last:border-b-0" key={index}>
                        <td className="px-3 py-2.5 text-center font-bold text-muted">{index + 1}</td>
                        {(['a', 'b', 'c', 'd'] as const).map((key) => {
                          const fixedBoundary = (key === 'a' && index === 0) || (key === 'c' && index === size - 1);
                          return (
                            <td className="p-1.5" key={key}>
                              <input
                                aria-label={`${key}_${index + 1}`}
                                type="number"
                                step="any"
                                value={row[key]}
                                disabled={fixedBoundary}
                                onChange={(event) => updateCoefficient(index, key, event.target.value)}
                                className={`w-full min-w-[70px] rounded-md border px-3 py-2 text-center sm:text-right font-mono text-[14px] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-soft ${
                                  fixedBoundary
                                    ? 'cursor-not-allowed border-transparent bg-panel/50 text-muted select-none'
                                    : 'border-line bg-panel text-ink hover:border-line-2 focus:bg-bg-2'
                                }`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                <p className="text-[12px] leading-relaxed text-muted">
                  {t('sweep.matrix_hint')}
                </p>
                <button
                  type="submit"
                  className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-lg border border-ink bg-ink px-7 py-3 font-sans text-[15px] font-[650] tracking-[-.01em] text-brand-ink transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_10px_22px_-10px_var(--brand)] active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan shrink-0 cursor-pointer"
                >
                  <span>{t('sweep.btn_calc')}</span>
                  <Calculator size={18} />
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 rounded-lg border border-neg border-l-[5px] bg-[color-mix(in_srgb,var(--neg)_10%,transparent)] p-[16px_18px]" role="alert">
                <b className="text-[14.5px]">{t('sweep.err_calc')}</b>
                <p className="mt-1.5 text-[14px] text-ink-2">{error}</p>
              </div>
            )}
          </PsPanel>
          {result && (
            <ResultActions
              summaryText={`Haydash (Thomas) method: n=${result.rows.length}, x=[${result.rows.map((row) => formatSweep(row.x, precision)).join(', ')}], max residual=${formatSweep(result.maxResidual, precision + 2)}`}
              csvData={result.rows.map((row) => ({
                [t('sweep.tbl_row')]: row.index,
                [t('sweep.tbl_a')]: row.a,
                [t('sweep.tbl_b')]: row.b,
                [t('sweep.tbl_c')]: row.c,
                [t('sweep.tbl_d')]: row.d,
                [t('sweep.tbl_pivot')]: formatSweep(row.pivot, precision),
                [t('sweep.tbl_alpha')]: formatSweep(row.alpha, precision),
                [t('sweep.tbl_beta')]: formatSweep(row.beta, precision),
                [t('sweep.tbl_x')]: formatSweep(row.x, precision),
                [t('sweep.tbl_residual')]: formatSweep(row.residual, precision + 2),
              }))}
              csvFileName="haydash-usuli-hisoboti.csv"
              imageFileName="haydash-usuli-hisoboti.png"
            />
          )}

          <section className={`flex min-h-[150px] flex-wrap items-center justify-between gap-5 rounded-[10px] border p-6 shadow-[var(--shadow)] transition-colors ${result ? 'border-brand bg-[linear-gradient(135deg,var(--brand-soft),var(--panel)_70%)]' : 'border-line bg-panel'}`}>
            <div className="min-w-0 flex-1">
              <span className="block font-mono text-xs font-semibold uppercase tracking-[.14em] text-muted">{t('sweep.result_eyebrow')}</span>
              <div className="my-3 flex flex-wrap gap-2">
                {result ? result.rows.map((row) => (
                  <div className="min-w-[78px] rounded-lg border border-line bg-panel px-3 py-2 text-center" key={row.index}>
                    <span className="block font-mono text-[11px] text-muted">x{row.index}</span>
                    <b className="mt-1 block font-mono text-[17px] text-brand">{formatSweep(row.x, precision)}</b>
                  </div>
                )) : <strong className="font-mono text-[32px] text-muted">{t('sweep.result_empty')}</strong>}
              </div>
              <small className="text-[13.5px] text-muted">{t('sweep.solution_caption')}</small>
            </div>
            <div className="shrink-0 border-l border-line pl-5 text-right">
              <span className="block text-[13px] text-muted">{t('sweep.residual_label')}</span>
              <b className="mt-1 block font-mono text-[clamp(18px,2.4vw,26px)] font-semibold leading-tight text-ink">{result ? formatSweep(result.maxResidual, precision + 2) : '—'}</b>
            </div>
          </section>

          {result && (
            <PsPanel>
              <PsPanelHead eyebrow={t('sweep.summary_eyebrow')} title={t('sweep.summary_title')} idx="03" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pos/30 bg-pos/10 px-3 py-1.5 text-[12px] font-semibold text-pos"><Check size={14} />{t('sweep.verified')}</span>
                <span className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${result.diagonallyDominant ? 'border-cyan/30 bg-cyan-soft text-cyan' : 'border-brand/30 bg-brand-soft text-brand'}`}>{toleranceChip}</span>
              </div>
              <p className="mt-3 text-[13px] leading-[1.6] text-muted">{t('sweep.relative_residual')}: <span className="font-mono text-ink">{formatSweep(result.relativeResidual, precision + 2)}</span></p>
            </PsPanel>
          )}

          {result && (
            <PsPanel>
              <PsPanelHead eyebrow={t('sweep.forward_eyebrow')} title={t('sweep.forward_title')} idx="04" />
              <div className="mb-4 overflow-x-auto rounded-lg border border-line bg-bg-2">
                <table className="w-full min-w-[440px] border-collapse text-right font-mono text-[12px]">
                  <thead className="border-b border-line bg-panel text-muted"><tr>{forwardHeadings.map(({ tex, label }) => <th className="px-4 py-3 font-semibold" key={label}><MathMarkup tex={tex} /></th>)}</tr></thead>
                  <tbody>{result.forwardSteps.map((step) => <tr className="border-b border-line last:border-b-0" key={step.index}>
                    <td className="px-4 py-3 text-center text-muted">{step.index}</td>
                    <td className="px-4 py-3">{formatSweep(step.pivot, precision)}</td>
                    <td className="px-4 py-3">{formatSweep(step.alpha, precision)}</td>
                    <td className="px-4 py-3">{formatSweep(step.beta, precision)}</td>
                  </tr>)}</tbody>
                </table>
              </div>
              <div className="grid gap-3">
                {result.forwardSteps.map((step) => (
                  <article className="rounded-lg border border-line bg-bg-2 p-4" key={step.index}>
                    <b className="mb-2 block font-mono text-xs font-semibold uppercase tracking-[.1em] text-brand">{t('sweep.step_title')} {step.index}</b>
                    <div className="grid gap-2 overflow-x-auto text-[13px] text-cyan">
                      {getForwardFormulas(step, precision).map((tex) => <MathMarkup key={tex} tex={tex} />)}
                    </div>
                  </article>
                ))}
              </div>
            </PsPanel>
          )}

          {result && (
            <PsPanel>
              <PsPanelHead eyebrow={t('sweep.backward_eyebrow')} title={t('sweep.backward_title')} idx="05" />
              <div className="grid gap-3">
                {result.backwardSteps.map((step) => (
                  <article className="rounded-lg border border-line bg-bg-2 p-4" key={step.index}>
                    <b className="mb-2 block font-mono text-xs font-semibold uppercase tracking-[.1em] text-brand">x{step.index}</b>
                    <div className="overflow-x-auto text-[13px] text-cyan"><MathMarkup tex={getBackwardFormula(step, precision)} /></div>
                  </article>
                ))}
              </div>
            </PsPanel>
          )}

          {result && (
            <PsPanel>
              <PsPanelHead eyebrow={t('sweep.check_eyebrow')} title={t('sweep.check_title')} idx="06" />
              <PsNote icon={<Check size={16} />}>
                <p>{t('sweep.check_note')}</p>
              </PsNote>
              <div className="overflow-x-auto rounded-lg border border-line bg-bg-2">
                <table className="w-full min-w-[560px] border-collapse text-right font-mono text-[12px]">
                  <thead className="border-b border-line bg-panel text-muted"><tr>
                    <th className="px-3 py-3 text-center">i</th>
                    <th className="px-3 py-3">dᵢ</th>
                    <th className="px-3 py-3">aᵢxᵢ₋₁ + bᵢxᵢ + cᵢxᵢ₊₁</th>
                    <th className="px-3 py-3">rᵢ</th>
                  </tr></thead>
                  <tbody>{reportRows.map((row, index) => {
                    const previousX = index > 0 ? reportRows[index - 1].x : 0;
                    const nextX = index < reportRows.length - 1 ? reportRows[index + 1].x : 0;
                    const reconstructed = row.a * previousX + row.b * row.x + row.c * nextX;
                    const residualTex = `r_{${row.index}} = ${formatSweep(row.d, precision)} - (${formatSweep(row.a, precision)}\\cdot${formatSweep(previousX, precision)} + ${formatSweep(row.b, precision)}\\cdot${formatSweep(row.x, precision)} + ${formatSweep(row.c, precision)}\\cdot${formatSweep(nextX, precision)}) = ${formatSweep(row.residual, precision + 2)}`;
                    return (
                      <tr className="border-b border-line last:border-b-0" key={row.index}>
                        <td className="px-3 py-3 text-center text-muted">{row.index}</td>
                        <td className="px-3 py-3">{formatSweep(row.d, precision)}</td>
                        <td className="px-3 py-3">{formatSweep(reconstructed, precision)}</td>
                        <td className="px-3 py-3 text-brand"><MathMarkup tex={residualTex} /></td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </PsPanel>
          )}

          {!result && !error && (
            <PsPanel className="grid min-h-[280px] place-content-center text-center">
              <ArrowUpRight size={42} className="mx-auto mb-3 text-cyan" />
              <b className="text-ink">{t('sweep.empty_title')}</b>
              <p className="mx-auto mt-1.5 max-w-[380px] text-[14px] leading-[1.7] text-muted">{t('sweep.empty_desc')}</p>
            </PsPanel>
          )}
        </div>
      </div>
    </div>
  );
}
