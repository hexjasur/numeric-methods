'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import { Activity, BookOpen, Calculator, ChevronDown } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useI18n } from '@/components/i18n-provider';
import {
  PsHero,
  PsPanel,
  PsPanelHead,
  PsStrip,
} from '@/components/ui/print-stream';
import { findExactSolution, type ExactODEResult } from '@/lib/euler';
import {
  calculateRK4,
  type RK4Options,
  type RK4Result,
} from '@/lib/runge-kutta';
import { ResultActions } from '@/components/ui/result-actions';

const initialInputs = {
  expression: 'x^2 + y',
  x0: '0',
  y0: '1',
  xEnd: '0.3',
  h: '0.1',
};
const formula = katex.renderToString(
  String.raw`\begin{aligned}k_0&=h f(x_i,y_i)\\k_1&=h f\left(x_i+\frac{h}{2},y_i+\frac{k_0}{2}\right)\\k_2&=h f\left(x_i+\frac{h}{2},y_i+\frac{k_1}{2}\right)\\k_3&=h f(x_i+h,y_i+k_2)\\y_{i+1}&=y_i+\frac{k_0+2k_1+2k_2+k_3}{6},\quad x_{i+1}=x_i+h\end{aligned}`,
  { throwOnError: false, displayMode: true },
);
const number = (value: number) => value.toFixed(6);

function MathFormula({ html }: { html: string }) {
  return (
    <div
      className="overflow-x-auto text-cyan [&_.katex-display]:!my-1 [&_.katex-display]:!w-max [&_.katex-display]:!min-w-full [&_.katex]:!max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function safeMathMarkup(tex: string): string {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode: true,
    });
  } catch {
    return tex;
  }
}

export function RungeKuttaMethod() {
  const { t } = useI18n();
  const [inputs, setInputs] = useState(initialInputs);
  const [calculationInputs, setCalculationInputs] = useState(initialInputs);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [visibleNotebookSteps, setVisibleNotebookSteps] = useState(20);
  const calculation = useMemo(() => {
    const options: RK4Options = {
      x0: Number(calculationInputs.x0),
      y0: Number(calculationInputs.y0),
      xEnd: Number(calculationInputs.xEnd),
      h: Number(calculationInputs.h),
    };
    try {
      const rows = calculateRK4(calculationInputs.expression, options);
      const exactResult = findExactSolution(
        calculationInputs.expression,
        options.x0,
        options.y0,
        t,
      );
      return { rows, exactResult, error: '' };
    } catch {
      return {
        rows: [] as RK4Result[],
        exactResult: null as ExactODEResult | null,
        error: t('rk4.error'),
      };
    }
  }, [calculationInputs, t]);
  const { rows, exactResult, error } = calculation;
  const exactSolution = exactResult?.hasExact ? exactResult : null;
  const exactMarkup = useMemo(
    () => (exactSolution ? safeMathMarkup(exactSolution.tex) : ''),
    [exactSolution],
  );
  const chartData = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        exact: exactSolution ? exactSolution.fn(row.x) : null,
      })),
    [rows, exactSolution],
  );
  const setInput = (key: keyof typeof initialInputs, value: string) =>
    setInputs((current) => ({ ...current, [key]: value }));

  return (
    <div className="relative mx-auto max-w-[1160px] px-4 pb-12">
      <PsStrip eyebrow="ODE-002" id="RK4" name={t('rk4.strip')} />
      <PsHero
        eyebrow={t('rk4.eyebrow')}
        title={t('rk4.title')}
        titleHighlight={t('rk4.highlight')}
        lead={t('rk4.lead')}
        conditionMain={<>y&apos; = f(x, y),&nbsp;&nbsp;y(x₀) = y₀</>}
        conditionSub={t('rk4.condition')}
      />

      <div className="grid grid-cols-1 items-start gap-4.5 xl:grid-cols-[minmax(280px,.7fr)_minmax(0,1.3fr)]">
        <PsPanel>
          <PsPanelHead
            eyebrow="INPUT / PARAMETERS"
            title={t('rk4.parameters')}
            idx="01"
          />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setCalculationInputs({ ...inputs });
            }}
            className="space-y-4"
          >
            <label className="block text-sm font-semibold text-ink">
              {t('rk4.expression')}
              <span className="mt-1.5 flex w-full items-center gap-2 rounded-lg border border-brand bg-brand-soft px-3 focus-within:ring-2 focus-within:ring-brand/20">
                <span className="whitespace-nowrap font-mono text-brand">
                  f(x,y) =
                </span>
                <input
                  type="text"
                  value={inputs.expression}
                  onChange={(event) =>
                    setInput('expression', event.target.value)
                  }
                  className="min-w-0 flex-1 border-0 bg-transparent py-3 font-mono font-normal text-ink outline-none"
                  aria-label="f(x, y)"
                  placeholder="x^2 + y"
                  spellCheck={false}
                  required
                />
              </span>
              <span className="mt-1 block text-xs font-normal text-muted">
                {t('rk4.expression_hint')}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ['x0', 'x₀'],
                  ['y0', 'y₀'],
                  ['xEnd', 'x end'],
                  ['h', 'h'],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="block text-sm font-semibold text-ink"
                >
                  {label}
                  <input
                    type="number"
                    step="any"
                    value={inputs[key]}
                    onChange={(event) => setInput(key, event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 font-mono font-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    aria-label={label}
                  />
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-semibold text-brand-ink transition-opacity hover:opacity-90"
            >
              <Calculator size={17} aria-hidden="true" /> {t('rk4.calculate')}
            </button>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-neg/30 bg-neg/10 px-3 py-2 text-sm text-neg"
              >
                {error}
              </p>
            )}
          </form>
          <div className="mt-6 border-t border-line pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
              {t('rk4.formulas')}
            </p>
            <MathFormula html={formula} />
          </div>
        </PsPanel>

        <div className="space-y-[18px]">
          <PsPanel>
            <PsPanelHead
              eyebrow="ANALYTIC / EXACT"
              title={t('rk4.exact_title')}
              idx="02"
            />
            {exactSolution ? (
              <>
                <MathFormula html={exactMarkup} />
                <p className="mt-2 text-xs text-muted">
                  {t('rk4.exact_description')}
                </p>
              </>
            ) : (
              <p className="rounded-lg border border-line bg-bg-2 px-3 py-3 text-sm text-ink-2">
                {exactResult && !exactResult.hasExact
                  ? exactResult.reasonText
                  : t('rk4.exact_unavailable')}
              </p>
            )}
          </PsPanel>

          {rows.length > 0 && (
            <ResultActions
              summaryText={`Runge-Kutta 4-tartib: f(x,y) = ${calculationInputs.expression}, x₀=${calculationInputs.x0}, y₀=${calculationInputs.y0}, xEnd=${calculationInputs.xEnd}, h=${calculationInputs.h} → y(${rows[rows.length - 1].x.toFixed(4)}) ≈ ${rows[rows.length - 1].y.toFixed(8)}`}
              csvData={rows.map((row) => {
                const exactValue = exactSolution?.fn(row.x);
                const base: Record<string, string | number> = {
                  i: row.step,
                  x: row.x.toFixed(6),
                  'y (RK4)': row.y.toFixed(8),
                  k0: row.k0.toFixed(8),
                  k1: row.k1.toFixed(8),
                  k2: row.k2.toFixed(8),
                  k3: row.k3.toFixed(8),
                };
                if (exactValue !== undefined) {
                  base['y (exact)'] = exactValue.toFixed(8);
                  base['|error|'] = Math.abs(row.y - exactValue).toFixed(8);
                }
                return base;
              })}
              csvFileName="runge-kutta-natija.csv"
              imageFileName="runge-kutta-natija.png"
            />
          )}

          <PsPanel>
            <PsPanelHead
              eyebrow="VISUALIZATION / RK4"
              title={t('rk4.chart_title')}
              idx="03"
            />
            {chartData.length > 0 ? (
              <div
                className="h-[300px] w-full"
                role="img"
                aria-label={t('rk4.chart_title')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 12, right: 16, bottom: 4, left: 4 }}
                  >
                    <CartesianGrid stroke="var(--line)" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tick={{ fill: 'var(--muted)', fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: 'var(--muted)', fontSize: 12 }}
                      width={58}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--panel)',
                        border: '1px solid var(--line)',
                        borderRadius: 8,
                        color: 'var(--ink)',
                      }}
                      labelFormatter={(label) =>
                        `x = ${Number(label).toFixed(4)}`
                      }
                      formatter={(value, name) => [
                        Number(value).toFixed(8),
                        name === 'y' ? 'RK4' : t('rk4.exact'),
                      ]}
                    />
                    <Legend
                      formatter={(value) =>
                        value === 'y' ? 'RK4' : t('rk4.exact')
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      name="y"
                      stroke="var(--brand)"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    {exactSolution && (
                      <Line
                        type="monotone"
                        dataKey="exact"
                        name="exact"
                        stroke="var(--cyan)"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        dot={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted">
                {t('rk4.no_chart')}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <Activity size={14} aria-hidden="true" />
              {exactSolution
                ? t('rk4.chart_note')
                : t('rk4.chart_note_no_exact')}
            </div>
          </PsPanel>

          <PsPanel>
            <PsPanelHead
              eyebrow="RESULTS / STEP TABLE"
              title={t('rk4.table_title')}
              idx="04"
            />
            {rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                  <thead className="bg-bg-2 text-xs uppercase tracking-wide text-muted">
                    <tr>
                      {[
                        'i',
                        'xᵢ',
                        'yᵢ (RK4)',
                        'k₀',
                        'k₁',
                        'k₂',
                        'k₃',
                        ...(exactSolution
                          ? [t('rk4.exact_col'), t('rk4.error_col')]
                          : []),
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="border-b border-line px-3 py-3 font-semibold"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const exactValue = exactSolution?.fn(row.x);
                      return (
                        <tr
                          key={row.step}
                          className="border-b border-line last:border-0 hover:bg-bg-2/70"
                        >
                          <td className="px-3 py-3 text-muted">{row.step}</td>
                          <td className="px-3 py-3 font-mono">
                            {row.x.toFixed(4)}
                          </td>
                          <td className="px-3 py-3 font-mono font-semibold text-brand">
                            {number(row.y)}
                          </td>
                          {[row.k0, row.k1, row.k2, row.k3].map(
                            (value, index) => (
                              <td
                                key={index}
                                className="px-3 py-3 font-mono text-xs text-muted"
                              >
                                {number(value)}
                              </td>
                            ),
                          )}
                          {exactValue !== undefined && (
                            <td className="px-3 py-3 font-mono text-cyan">
                              {number(exactValue)}
                            </td>
                          )}
                          {exactValue !== undefined && (
                            <td className="px-3 py-3 font-mono text-muted">
                              {number(Math.abs(row.y - exactValue))}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted">
                {t('rk4.no_results')}
              </p>
            )}
            {rows.length > 0 && (
              <p className="mt-4 rounded-lg border border-cyan/20 bg-cyan-soft px-3 py-2 text-sm text-ink-2">
                {t('rk4.final_value')}:{' '}
                <strong className="font-mono text-brand">
                  y({rows[rows.length - 1].x.toFixed(4)}) ≈{' '}
                  {number(rows[rows.length - 1].y)}
                </strong>
                {exactSolution && (
                  <span className="ml-2">
                    · {t('rk4.exact_value')}:{' '}
                    <strong className="font-mono text-cyan">
                      {number(exactSolution.fn(rows[rows.length - 1].x))}
                    </strong>
                  </span>
                )}
              </p>
            )}
            {rows.length > 1 && (
              <section className="mt-5 border-t border-line pt-4">
                <button
                  type="button"
                  aria-expanded={notebookOpen}
                  onClick={() => setNotebookOpen((open) => !open)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 text-left font-semibold text-ink transition-colors hover:border-brand/60"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen size={18} className="text-brand" aria-hidden="true" />
                    {t('rk4.notebook_title')}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-brand transition-transform ${notebookOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {notebookOpen && (
                  <div className="mt-3 space-y-3">
                    <p className="rounded-lg border border-line bg-bg-2 px-3 py-2.5 text-sm leading-relaxed text-muted">
                      {t('rk4.notebook_intro')}
                    </p>
                    {rows.slice(0, -1).slice(0, visibleNotebookSteps).map((row, index) => {
                      const nextRow = rows[index + 1];
                      const stepH = Math.min(
                        Number(calculationInputs.h),
                        Number(calculationInputs.xEnd) - row.x,
                      );
                      const halfStep = stepH / 2;
                      const stages = [
                        { index: 0, x: row.x, y: row.y, k: row.k0 },
                        {
                          index: 1,
                          x: row.x + halfStep,
                          y: row.y + row.k0 / 2,
                          k: row.k1,
                        },
                        {
                          index: 2,
                          x: row.x + halfStep,
                          y: row.y + row.k1 / 2,
                          k: row.k2,
                        },
                        {
                          index: 3,
                          x: row.x + stepH,
                          y: row.y + row.k2,
                          k: row.k3,
                        },
                      ];
                      const substituted = (x: number, y: number) =>
                        calculationInputs.expression
                          .replace(/\bx\b/g, `(${number(x)})`)
                          .replace(/\by\b/g, `(${number(y)})`);
                      return (
                        <article
                          key={row.step}
                          className="rounded-lg border border-line bg-panel p-3 sm:p-4"
                        >
                          <h3 className="mb-3 font-mono text-sm font-bold text-brand">
                            {t('rk4.notebook_step', {
                              step: row.step,
                              x: number(row.x),
                              y: number(row.y),
                            })}
                          </h3>
                          <div className="space-y-3">
                            {stages.map((stage) => {
                              const stageLabel = `k_${stage.index}`;
                              const stageTex = stage.index === 0
                                ? String.raw`k_0 = h_i f(x_i,y_i) = ${number(stepH)}\cdot f(${number(row.x)},${number(row.y)}) = ${number(stage.k)}`
                                : stage.index === 1
                                  ? String.raw`k_1 = h_i f\left(x_i+\frac{h_i}{2},y_i+\frac{k_0}{2}\right) = ${number(stepH)}\cdot f(${number(stage.x)},${number(stage.y)}) = ${number(stage.k)}`
                                  : stage.index === 2
                                    ? String.raw`k_2 = h_i f\left(x_i+\frac{h_i}{2},y_i+\frac{k_1}{2}\right) = ${number(stepH)}\cdot f(${number(stage.x)},${number(stage.y)}) = ${number(stage.k)}`
                                    : String.raw`k_3 = h_i f(x_i+h_i,y_i+k_2) = ${number(stepH)}\cdot f(${number(stage.x)},${number(stage.y)}) = ${number(stage.k)}`;
                              return (
                                <div key={stage.index} className="rounded-md border border-line/70 bg-bg-2/60 p-2.5">
                                  <MathFormula html={safeMathMarkup(stageTex)} />
                                  <p className="mt-1 break-words text-xs leading-relaxed text-muted">
                                    {t('rk4.notebook_substitution', { stage: stageLabel })}{' '}
                                    <code className="font-mono text-ink-2">
                                      f({number(stage.x)}, {number(stage.y)}) = {substituted(stage.x, stage.y)} = {number(stage.k / stepH)}
                                    </code>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-3 space-y-2 border-t border-dashed border-line pt-3">
                            <MathFormula
                              html={safeMathMarkup(
                                String.raw`y_{i+1} = y_i + \frac{k_0+2k_1+2k_2+k_3}{6} = ${number(row.y)} + \frac{${number(row.k0)}+2(${number(row.k1)})+2(${number(row.k2)})+${number(row.k3)}}{6} = ${number(nextRow.y)}`,
                              )}
                            />
                            <MathFormula
                              html={safeMathMarkup(
                                String.raw`x_{i+1} = x_i + h_i = ${number(row.x)} + ${number(stepH)} = ${number(nextRow.x)}`,
                              )}
                            />
                          </div>
                        </article>
                      );
                    })}
                    {visibleNotebookSteps < rows.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setVisibleNotebookSteps((visible) => Math.min(visible + 20, rows.length - 1))}
                        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
                      >
                        {t('rk4.notebook_more', {
                          count: Math.min(20, rows.length - 1 - visibleNotebookSteps),
                        })}
                      </button>
                    ) : (
                      <p className="text-center text-xs text-muted">
                        {t('rk4.notebook_complete', { count: rows.length - 1 })}
                      </p>
                    )}
                  </div>
                )}
              </section>
            )}
          </PsPanel>
        </div>
      </div>
    </div>
  );
}
