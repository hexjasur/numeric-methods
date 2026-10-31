'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import { Calculator, BookOpen, ChevronDown, Copy, Check } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { ResultActions } from '@/components/ui/result-actions';
import { calculateAdamsPredictor, type AdamsPredictorOptions, type AdamsPredictorResult } from '@/lib/adams-predictor';

const defaults = { expression: 'x - 2*y', a: '-1', b: '2', x0: '0', y0: '1', h: '0.6' };
const formulaTex = katex.renderToString(
  String.raw`\Delta y_i=q_i+\frac{1}{2}\Delta q_{i-1}+\frac{5}{12}\Delta^2q_{i-2}+\frac{3}{8}\Delta^3q_{i-3},\qquad y_{i+1}=y_i+\Delta y_i`,
  { throwOnError: false, displayMode: true }
);

function MathKatex({
  tex,
  display = false,
  className = '',
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        throwOnError: false,
        displayMode: display,
      });
    } catch {
      return tex;
    }
  }, [tex, display]);

  return (
    <span
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function AdamsPredictorMethod() {
  const { t } = useI18n();
  const [inputs, setInputs] = useState(defaults);
  const [calculationInputs, setCalculationInputs] = useState(defaults);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [notebookExpanded, setNotebookExpanded] = useState(false);
  const [copiedNotebook, setCopiedNotebook] = useState(false);

  const calculation = useMemo(() => {
    try {
      const options: AdamsPredictorOptions = {
        a: Number(calculationInputs.a),
        b: Number(calculationInputs.b),
        x0: Number(calculationInputs.x0),
        y0: Number(calculationInputs.y0),
        h: Number(calculationInputs.h),
      };
      return { rows: calculateAdamsPredictor(calculationInputs.expression, options), error: '' };
    } catch {
      return { rows: [] as AdamsPredictorResult[], error: t('adams.error') };
    }
  }, [calculationInputs, t]);

  const setInput = (key: keyof typeof defaults, value: string) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const rows = calculation.rows;
  const last = rows[rows.length - 1];

  const handleCopyNotebook = () => {
    if (!rows.length) return;
    const lines: string[] = [
      `=== ${t('adams.notebook_title').toUpperCase()} ===`,
      `${t('adams.notebook_sec_1')}:`,
      `  y' = ${calculationInputs.expression}`,
      `  y(${calculationInputs.x0}) = ${calculationInputs.y0}`,
      `  [a, b] = [${calculationInputs.a}, ${calculationInputs.b}],  h = ${calculationInputs.h}`,
      '',
      `${t('adams.notebook_sec_2')}:`,
      `  q_i = h * f(x_i, y_i)`,
      `  Δy_i = q_i + 1/2 Δq_{i-1} + 5/12 Δ²q_{i-2} + 3/8 Δ³q_{i-3}`,
      `  y_{i+1} = y_i + Δy_i`,
      '',
      `${t('adams.notebook_sec_3')}:`,
    ];

    rows.forEach((r) => {
      lines.push(`- Step ${r.step} (${r.method}): x_${r.step} = ${r.x}, y_${r.step} = ${r.y}, q_${r.step} = ${r.q}, Δy_${r.step} = ${r.increment}`);
      if (r.details?.k0 !== undefined) {
        lines.push(`    k0 = ${r.details.k0}, k1 = ${r.details.k1}, k2 = ${r.details.k2}, k3 = ${r.details.k3}`);
      }
      if (r.details?.delta1 !== undefined) {
        lines.push(`    Δq = ${r.details.delta1}, Δ²q = ${r.details.delta2}, Δ³q = ${r.details.delta3}`);
      }
    });

    lines.push('');
    lines.push(`${t('adams.notebook_sec_4')}:`);
    lines.push(`  y(${last?.x}) ≈ ${last?.y}`);

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopiedNotebook(true);
      setTimeout(() => setCopiedNotebook(false), 2000);
    });
  };

  const isLarge = rows.length > 7;
  const visibleSteps = isLarge && !notebookExpanded
    ? [...rows.slice(0, 4), null, ...rows.slice(-2)]
    : rows;

  return (
    <div className="relative mx-auto max-w-[1160px] px-0 sm:px-2 md:px-4 pb-12">
      <PsStrip eyebrow="ODE-003" id="ADAMS" name={t('adams.strip')} />
      <PsHero
        eyebrow={t('adams.eyebrow')}
        title={t('adams.title')}
        titleHighlight={t('adams.highlight')}
        lead={t('adams.lead')}
        conditionMain={<>y&apos; = f(x, y),&nbsp;&nbsp;y(x₀) = y₀</>}
        conditionSub={t('adams.condition')}
      />

      <div className="grid grid-cols-1 items-start gap-4.5 xl:grid-cols-[minmax(280px,.7fr)_minmax(0,1.3fr)]">
        <PsPanel>
          <PsPanelHead eyebrow="INPUT / PARAMETERS" title={t('adams.parameters')} idx="01" />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setCalculationInputs({ ...inputs });
            }}
            className="space-y-4"
          >
            <label className="block text-sm font-semibold text-ink">
              {t('adams.expression')}
              <span className="mt-1.5 flex w-full items-center gap-2 rounded-lg border border-brand bg-brand-soft px-3 focus-within:ring-2 focus-within:ring-brand/20">
                <span className="whitespace-nowrap font-mono text-brand">f(x,y) =</span>
                <input
                  type="text"
                  value={inputs.expression}
                  onChange={(event) => setInput('expression', event.target.value)}
                  className="min-w-0 flex-1 border-0 bg-transparent py-3 font-mono font-normal text-ink outline-none"
                  aria-label="f(x, y)"
                  spellCheck={false}
                  required
                />
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([['a', 'a'], ['b', 'b'], ['x0', 'x₀'], ['y0', 'y₀'], ['h', 'h']] as const).map(
                ([key, label]) => (
                  <label key={key} className="block text-sm font-semibold text-ink">
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
                )
              )}
            </div>
            <p className="text-xs text-muted">{t('adams.initial_hint')}</p>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-semibold text-brand-ink transition-opacity hover:opacity-90 cursor-pointer"
            >
              <Calculator size={17} aria-hidden="true" /> {t('adams.calculate')}
            </button>
            {calculation.error && (
              <p role="alert" className="rounded-lg border border-neg/30 bg-neg/10 px-3 py-2 text-sm text-neg">
                {calculation.error}
              </p>
            )}
          </form>
          <div className="mt-6 border-t border-line pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
              {t('adams.formula_title')}
            </p>
            <div className="overflow-x-auto text-cyan" dangerouslySetInnerHTML={{ __html: formulaTex }} />
            <p className="mt-3 text-xs leading-5 text-muted">{t('adams.startup_note')}</p>
          </div>
        </PsPanel>

        <div className="space-y-[18px]">
          {last && (
            <PsPanel>
              <PsPanelHead eyebrow="INITIAL VALUE PROBLEM" title={t('adams.result_title')} idx="02" />
              <div className="text-sm text-ink-2 flex flex-wrap items-center gap-2">
                <span>{t('adams.result_summary')}</span>
                <MathKatex
                  tex={String.raw`y(${last.x}) \approx \mathbf{${last.y}}`}
                  className="text-brand font-bold text-base"
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                {t('adams.example')}{' '}
                <span className="font-mono">y&apos; = x − 2y, y(0)=1, [−1,2], h=0.6</span>
              </p>
            </PsPanel>
          )}

          {rows.length > 0 && (
            <>
              <ResultActions
                summaryText={`Adams predictor: y'=${calculationInputs.expression}, [${calculationInputs.a}, ${calculationInputs.b}], y(${calculationInputs.x0})=${calculationInputs.y0}, h=${calculationInputs.h}; y(${last?.x})≈${last?.y}`}
                csvData={rows.map((row) => ({
                  i: row.step,
                  x: row.x,
                  y: row.y,
                  q: row.q,
                  increment: row.increment,
                  method: row.method,
                }))}
                csvFileName="adams-predictor-natija.csv"
                imageFileName="adams-predictor-natija.png"
              />

              <PsPanel>
                <PsPanelHead eyebrow="CALCULATION / TRACE" title={t('adams.table_title')} idx="03" />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                        <th className="px-2 py-3">i</th>
                        <th className="px-2 py-3"><MathKatex tex="x_i" /></th>
                        <th className="px-2 py-3"><MathKatex tex="y_i" /></th>
                        <th className="px-2 py-3"><MathKatex tex="q_i = h \cdot f(x_i, y_i)" /></th>
                        <th className="px-2 py-3"><MathKatex tex="\Delta y_i" /></th>
                        <th className="px-2 py-3">{t('adams.method')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={`${row.step}-${row.x}`} className="border-b border-line/70 font-mono text-xs text-ink-2">
                          <td className="px-2 py-2.5">{row.step}</td>
                          <td className="px-2 py-2.5">{row.x}</td>
                          <td className="px-2 py-2.5">{row.y}</td>
                          <td className="px-2 py-2.5">{row.q}</td>
                          <td className="px-2 py-2.5 font-semibold text-brand">{row.increment}</td>
                          <td className="px-2 py-2.5 font-sans">
                            {t(
                              `adams.method_${
                                row.method === 'Initial'
                                  ? 'initial'
                                  : row.method === 'RK4 startup'
                                    ? 'rk4'
                                    : row.method === 'Adams predictor'
                                      ? 'predictor'
                                      : 'boundary'
                              }`
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PsPanel>
            </>
          )}
        </div>
      </div>

      {/* ───────── STUDENT NOTEBOOK DERIVATION PROTOCOL ───────── */}
      {rows.length > 0 && (
        <PsPanel className="mt-8 transition-all">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsNotebookOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsNotebookOpen((prev) => !prev);
              }
            }}
            className="flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none relative z-10 group"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="p-2.5 rounded-lg bg-brand/10 text-brand border border-brand/20 shrink-0 mt-0.5 group-hover:bg-brand/15 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
                    {t('adams.notebook_eyebrow')}
                  </span>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-brand/15 text-brand border border-brand/25">
                    {t('adams.notebook_badge')}
                  </span>
                </div>
                <h2 className="mt-1 text-[21px] font-[650] tracking-[-.035em] group-hover:text-brand transition-colors">
                  {t('adams.notebook_title')}
                </h2>
                <p className="mt-0.5 text-[13px] text-muted max-w-xl">
                  {t('adams.notebook_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotebookOpen((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-line bg-panel hover:bg-bg-2 text-ink text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>{isNotebookOpen ? t('adams.notebook_toggle_close') : t('adams.notebook_toggle_open')}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isNotebookOpen ? 'rotate-180 text-brand' : 'text-muted'
                  }`}
                />
              </button>
            </div>
          </div>

          {isNotebookOpen && (
            <div className="mt-5 pt-5 border-t border-line space-y-6 relative z-10 animate-in fade-in duration-200">
              {/* Copy Protocol Button Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-panel/60 p-2.5 rounded-lg border border-line">
                <span className="font-mono text-xs text-muted">
                  {rows.length} {t('adams.notebook_step')}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNotebook}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-brand/30 bg-brand/10 hover:bg-brand/20 text-brand text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {copiedNotebook ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('adams.notebook_copy_done')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t('adams.notebook_copy_btn')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Section 1: Given Data */}
              <div className="p-4 rounded-lg border border-line bg-bg-2 space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                  {t('adams.notebook_sec_1')}:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-muted block text-xs mb-1">Differensial tenglama:</span>
                    <div className="p-2.5 rounded bg-panel border border-line text-cyan overflow-x-auto">
                      <MathKatex
                        tex={String.raw`y' = f(x, y) = ${calculationInputs.expression}`}
                        display
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-muted block text-xs mb-1">Boshlang‘ich shart va oraliq:</span>
                    <div className="p-2.5 rounded bg-panel border border-line text-cyan overflow-x-auto">
                      <MathKatex
                        tex={String.raw`y(x_0) = y(${calculationInputs.x0}) = ${calculationInputs.y0}, \quad [a, b] = [${calculationInputs.a}, \, ${calculationInputs.b}], \quad h = ${calculationInputs.h}`}
                        display
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Formulas */}
              <div className="p-4 rounded-lg border border-line bg-bg-2 space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                  {t('adams.notebook_sec_2')}:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded bg-panel border border-line space-y-2">
                    <span className="font-semibold text-ink block">1. Boshlang‘ich qadamlar (RK4):</span>
                    <div className="text-cyan overflow-x-auto text-xs py-1">
                      <MathKatex
                        tex={String.raw`k_0 = h f(x_i, y_i), \quad k_1 = h f\left(x_i + \frac{h}{2}, \, y_i + \frac{k_0}{2}\right)`}
                        display
                      />
                      <MathKatex
                        tex={String.raw`k_2 = h f\left(x_i + \frac{h}{2}, \, y_i + \frac{k_1}{2}\right), \quad k_3 = h f(x_i + h, \, y_i + k_2)`}
                        display
                      />
                      <MathKatex
                        tex={String.raw`\Delta y_i = \frac{k_0 + 2k_1 + 2k_2 + k_3}{6}, \quad y_{i+1} = y_i + \Delta y_i`}
                        display
                      />
                    </div>
                  </div>
                  <div className="p-3 rounded bg-panel border border-line space-y-2">
                    <span className="font-semibold text-ink block">2. 3-tartibli Adams prediktor formulasi:</span>
                    <div className="text-cyan overflow-x-auto text-xs py-1">
                      <MathKatex
                        tex={String.raw`q_i = h \cdot f(x_i, y_i)`}
                        display
                      />
                      <MathKatex
                        tex={String.raw`\Delta y_i = q_i + \frac{1}{2}\Delta q_{i-1} + \frac{5}{12}\Delta^2 q_{i-2} + \frac{3}{8}\Delta^3 q_{i-3}`}
                        display
                      />
                      <MathKatex
                        tex={String.raw`y_{i+1} = y_i + \Delta y_i`}
                        display
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Step-by-Step Derivations */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                  {t('adams.notebook_sec_3')}:
                </h3>

                <div className="space-y-3">
                  {visibleSteps.map((step, idx) => {
                    if (step === null) {
                      return (
                        <div
                          key={`collapsed-divider-${idx}`}
                          className="p-3 rounded-lg border border-dashed border-line bg-bg-2/50 text-center font-mono text-xs text-muted flex items-center justify-center gap-3"
                        >
                          <span>{t('adams.notebook_etc')}</span>
                          <button
                            type="button"
                            onClick={() => setNotebookExpanded(true)}
                            className="text-brand hover:underline font-semibold cursor-pointer"
                          >
                            {t('adams.notebook_show_all', { count: rows.length })}
                          </button>
                        </div>
                      );
                    }

                    const isAdams = step.method === 'Adams predictor';
                    const isRK4 = step.method === 'RK4 startup' || step.method === 'RK4 boundary';
                    const isInitial = step.method === 'Initial';

                    return (
                      <div
                        key={`step-card-${step.step}-${step.x}`}
                        className="p-4 rounded-lg border border-line bg-panel space-y-3 hover:border-brand/40 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                              i = {step.step}
                            </span>
                            <span className="text-xs font-semibold text-ink">
                              {t(
                                `adams.method_${
                                  step.method === 'Initial'
                                    ? 'initial'
                                    : step.method === 'RK4 startup'
                                      ? 'rk4'
                                      : isAdams
                                        ? 'predictor'
                                        : 'boundary'
                                }`
                              )}
                            </span>
                          </div>
                          <MathKatex
                            tex={String.raw`x_{${step.step}} = ${step.x}, \quad y_{${step.step}} = ${step.y}`}
                            className="text-xs text-muted font-mono"
                          />
                        </div>

                        {/* Step Details */}
                        {isInitial && (
                          <div className="space-y-2 text-sm text-ink-2">
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-bg-2 border border-line">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Nuqta:</span>
                              <MathKatex
                                tex={String.raw`x_0 = ${step.x}, \quad y_0 = ${step.y}`}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-bg-2 border border-line">
                              <span className="text-xs text-muted font-mono min-w-[70px]">q₀:</span>
                              <MathKatex
                                tex={String.raw`q_0 = h \cdot f(x_0, y_0) = ${step.details?.stepSize} \cdot (${step.details?.k0Eval?.fVal}) = \mathbf{${step.q}}`}
                              />
                            </div>
                          </div>
                        )}

                        {isRK4 && step.details && (
                          <div className="space-y-2 text-sm text-ink-2">
                            {/* Koeffitsiyentlar hisobi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <div className="p-2 rounded bg-bg-2 border border-line">
                                <MathKatex
                                  tex={String.raw`k_0 = h \cdot f(${step.details.k0Eval?.x}, \, ${step.details.k0Eval?.y}) = ${step.details.stepSize} \cdot (${step.details.k0Eval?.fVal}) = \mathbf{${step.details.k0}}`}
                                />
                              </div>
                              <div className="p-2 rounded bg-bg-2 border border-line">
                                <MathKatex
                                  tex={String.raw`k_1 = h \cdot f(${step.details.k1Eval?.x}, \, ${step.details.k1Eval?.y}) = ${step.details.stepSize} \cdot (${step.details.k1Eval?.fVal}) = \mathbf{${step.details.k1}}`}
                                />
                              </div>
                              <div className="p-2 rounded bg-bg-2 border border-line">
                                <MathKatex
                                  tex={String.raw`k_2 = h \cdot f(${step.details.k2Eval?.x}, \, ${step.details.k2Eval?.y}) = ${step.details.stepSize} \cdot (${step.details.k2Eval?.fVal}) = \mathbf{${step.details.k2}}`}
                                />
                              </div>
                              <div className="p-2 rounded bg-bg-2 border border-line">
                                <MathKatex
                                  tex={String.raw`k_3 = h \cdot f(${step.details.k3Eval?.x}, \, ${step.details.k3Eval?.y}) = ${step.details.stepSize} \cdot (${step.details.k3Eval?.fVal}) = \mathbf{${step.details.k3}}`}
                                />
                              </div>
                            </div>

                            {/* O'sish va keyingi nuqta */}
                            <div className="p-2.5 rounded bg-bg-2 border border-line space-y-1.5">
                              <div className="overflow-x-auto text-xs">
                                <MathKatex
                                  tex={String.raw`\Delta y_{${step.step - 1}} = \frac{k_0 + 2k_1 + 2k_2 + k_3}{6} = \frac{${step.details.k0} + 2(${step.details.k1}) + 2(${step.details.k2}) + ${step.details.k3}}{6} = \mathbf{${step.increment}}`}
                                />
                              </div>
                              <div className="overflow-x-auto text-xs text-brand font-bold pt-1 border-t border-line/60">
                                <MathKatex
                                  tex={String.raw`y_{${step.step}} = y_{${step.step - 1}} + \Delta y_{${step.step - 1}} = \mathbf{${step.y}}`}
                                />
                              </div>
                              <div className="overflow-x-auto text-xs text-muted pt-1">
                                <MathKatex
                                  tex={String.raw`q_{${step.step}} = h \cdot f(x_{${step.step}}, y_{${step.step}}) = \mathbf{${step.q}}`}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {isAdams && step.details && (
                          <div className="space-y-2 text-sm text-ink-2">
                            {/* Chekli ayirmalar */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <div className="p-2 rounded bg-bg-2 border border-line overflow-x-auto">
                                <MathKatex
                                  tex={String.raw`\Delta q_{${step.step - 1}} = q_{${step.step - 1}} - q_{${step.step - 2}} = \mathbf{${step.details.delta1}}`}
                                />
                              </div>
                              <div className="p-2 rounded bg-bg-2 border border-line overflow-x-auto">
                                <MathKatex
                                  tex={String.raw`\Delta^2 q_{${step.step - 2}} = \mathbf{${step.details.delta2}}`}
                                />
                              </div>
                              <div className="p-2 rounded bg-bg-2 border border-line overflow-x-auto">
                                <MathKatex
                                  tex={String.raw`\Delta^3 q_{${step.step - 3}} = \mathbf{${step.details.delta3}}`}
                                />
                              </div>
                            </div>

                            {/* Formula bo'yicha hisoblash */}
                            <div className="p-2.5 rounded bg-bg-2 border border-line space-y-1.5 text-xs">
                              <div className="overflow-x-auto">
                                <MathKatex
                                  tex={String.raw`\Delta y_{${step.step - 1}} = q_{${step.step - 1}} + \frac{1}{2}\Delta q_{${step.step - 1}} + \frac{5}{12}\Delta^2 q_{${step.step - 2}} + \frac{3}{8}\Delta^3 q_{${step.step - 3}}`}
                                />
                              </div>
                              <div className="overflow-x-auto text-muted">
                                <MathKatex
                                  tex={String.raw`= ${step.details.qTerm} + \frac{1}{2}(${step.details.delta1}) + \frac{5}{12}(${step.details.delta2}) + \frac{3}{8}(${step.details.delta3}) = \mathbf{${step.increment}}`}
                                />
                              </div>
                              <div className="overflow-x-auto text-brand font-bold pt-1 border-t border-line/60">
                                <MathKatex
                                  tex={String.raw`y_{${step.step}} = y_{${step.step - 1}} + \Delta y_{${step.step - 1}} = \mathbf{${step.y}}`}
                                />
                              </div>
                              <div className="overflow-x-auto text-muted pt-1">
                                <MathKatex
                                  tex={String.raw`q_{${step.step}} = h \cdot f(x_{${step.step}}, y_{${step.step}}) = \mathbf{${step.q}}`}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isLarge && notebookExpanded && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setNotebookExpanded(false)}
                      className="px-4 py-2 rounded-lg border border-line bg-panel hover:bg-bg-2 text-xs font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      {t('adams.notebook_collapse')}
                    </button>
                  </div>
                )}
              </div>

              {/* Section 4: Final Summary Answer */}
              <div className="p-4 rounded-lg border border-line bg-gradient-to-r from-brand-soft/40 to-panel space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-brand">
                    {t('adams.notebook_sec_4')}
                  </h3>
                  <MathKatex
                    tex={String.raw`x = ${last?.x}`}
                    className="text-xs text-muted font-mono"
                  />
                </div>
                <div className="p-3 rounded-lg bg-panel border border-line flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-muted block">{t('adams.notebook_ans_desc')}</span>
                    <div className="text-base font-mono text-ink mt-0.5">
                      <MathKatex
                        tex={String.raw`y(${last?.x}) \approx \mathbf{${last?.y}}`}
                        className="text-brand font-bold"
                      />
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-ok/10 text-ok border border-ok/25">
                    {rows.length} {t('adams.notebook_step')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </PsPanel>
      )}
    </div>
  );
}
