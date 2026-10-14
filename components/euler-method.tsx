'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
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
import {
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import {
  solveEulerMethods,
  formatNum,
  substituteLatex,
  type EulerResult,
} from '@/lib/euler';
import { PsHero, PsStrip, PsPanel, PsPanelHead, PsNote } from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';
import { ResultActions } from '@/components/ui/result-actions';

const initialInputs = {
  expression: 'x - 2*y',
  x0: '-1',
  y0: '1',
  xEnd: '2',
  h: '0.6',
};

const formulaMarkup = {
  euler: katex.renderToString(
    String.raw`y_{i+1}=y_i+h\,f(x_i,y_i)`,
    { throwOnError: false, displayMode: true },
  ),
  improved: katex.renderToString(
    String.raw`\begin{aligned}\bar{y}_{i+1}&=y_i+h\,f(x_i,y_i)\\y_{i+1}&=y_i+\frac{h}{2}\Bigl[f(x_i,y_i)+f(x_{i+1},\bar{y}_{i+1})\Bigr]\end{aligned}`,
    { throwOnError: false, displayMode: true },
  ),
  exact: katex.renderToString(
    String.raw`\begin{aligned}y(x)&=\frac{x}{2}-\frac{1}{4}+C e^{-2(x-x_0)}\\C&=y_0-\frac{x_0}{2}+\frac{1}{4}\end{aligned}`,
    { throwOnError: false, displayMode: true },
  ),
  steps: katex.renderToString(
    String.raw`n=\left\lceil\frac{x_{\mathrm{end}}-x_0}{h}\right\rceil`,
    { throwOnError: false },
  ),
};

const numeric = (value: number | null) =>
  value === null || !Number.isFinite(value) ? '—' : value.toFixed(6);

function Formula({ html }: { html: string }) {
  return (
    <div
      className="w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain text-[clamp(.72rem,1.1vw,.9rem)] text-ink [&_.katex-display]:!my-0 [&_.katex-display]:!w-max [&_.katex-display]:!min-w-full [&_.katex]:!max-w-none [&_.katex]:!overflow-visible [&_.katex]:!px-0 text-cyan"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function MathInline({ html }: { html: string }) {
  return (
    <span
      className="[&_.katex]:!px-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

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
      className={`[&_.katex]:!px-0 ${display ? 'block my-1 overflow-x-auto overflow-y-hidden text-cyan' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function EulerMethod() {
  const { t } = useI18n();
  const [inputs, setInputs] = useState(initialInputs);
  const [calculationInputs, setCalculationInputs] = useState(initialInputs);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [notebookTab, setNotebookTab] = useState<'simple' | 'improved'>('simple');
  const [notebookExpanded, setNotebookExpanded] = useState(false);

  const calculation = useMemo(() => {
    try {
      const result = solveEulerMethods(
        calculationInputs.expression,
        Number(calculationInputs.x0),
        Number(calculationInputs.y0),
        Number(calculationInputs.xEnd),
        Number(calculationInputs.h),
        t,
      );
      return { result, error: '' };
    } catch (cause) {
      return {
        result: null,
        error:
          cause instanceof Error
            ? cause.message
            : "Parametrlarni tekshirib qayta urinib ko'ring.",
      };
    }
  }, [calculationInputs, t]);

  const result = calculation.result;
  const rows = result?.rows ?? [];

  const intervalMarkup = useMemo(() => {
    const formatEndpoint = (value: string) => {
      if (!value.trim() || !Number.isFinite(Number(value))) return String.raw`\text{—}`;
      return Number(Number(value).toFixed(4)).toString();
    };
    return katex.renderToString(
      String.raw`\left[${formatEndpoint(inputs.x0)},\,${formatEndpoint(inputs.xEnd)}\right]`,
      { throwOnError: false },
    );
  }, [inputs.x0, inputs.xEnd]);

  const exactMarkup = useMemo(() => {
    if (result?.exactResult.hasExact) {
      return katex.renderToString(result.exactResult.tex, {
        throwOnError: false,
        displayMode: true,
      });
    }
    return '';
  }, [result]);

  const differenceMarkup = useMemo(() => {
    return katex.renderToString(
      String.raw`\Delta y=\left|y_{\text{${t('euler.sub_impr')}}}-y_{\text{${t('euler.sub_euler')}}}\right|`,
      { throwOnError: false },
    );
  }, [t]);
  
  const setValue = (key: keyof typeof initialInputs, value: string) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const tableHeadings = [
    { tex: String.raw`i`, label: 'i' },
    { tex: String.raw`x_i`, label: 'x_i' },
    { tex: String.raw`y_i^{\text{${t('euler.sub_euler')}}}`, label: t('euler.tbl_euler') },
    { tex: String.raw`y_i^{\text{${t('euler.sub_impr')}}}`, label: t('euler.tbl_impr') },
    { tex: String.raw`y(x_i)^{\text{${t('euler.sub_exact')}}}`, label: t('euler.tbl_exact') },
    { tex: String.raw`\Delta y`, label: t('euler.tbl_diff') },
  ].map(({ tex, label }) => ({
    label,
    html: katex.renderToString(tex, { throwOnError: false }),
  }));

  return (
    <div className="relative max-w-[1160px] mx-auto px-4 pb-12">
      <PsStrip eyebrow="ELR-002" id="ODE" name={t('euler.strip')} />

      <PsHero 
        eyebrow={t('euler.hero_eyebrow')}
        title={<>{t('euler.hero_title')}</>}
        titleHighlight={t('euler.hero_titleHighlight')}
        lead={t('euler.hero_lead')}
        conditionMain={<>y&apos; = f(x, y),&nbsp;&nbsp;y(x₀) = y₀</>}
        conditionSub={t('euler.hero_condition')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(300px,.82fr)_minmax(0,1.4fr)] gap-[18px] items-start mb-[18px]">
        <PsPanel>
          <PsPanelHead eyebrow="Input / Parametrlar" title={t('euler.panel_input')} idx="01" />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setCalculationInputs({ ...inputs });
            }}
          >
            <label className="block mb-4">
              <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
                <span>{t('euler.label_fn')}</span>
                <span className="font-mono text-xs font-medium not-italic text-muted">{t('euler.label_syntax')}</span>
              </span>
              <div className="mt-2 w-full border border-brand bg-brand-soft rounded-lg flex items-center gap-2.5 px-3.5 focus-within:ring-4 focus-within:ring-brand-soft focus-within:bg-panel transition-all">
                <b className="text-brand text-[15px] whitespace-nowrap">f(x, y) =</b>
                <input
                  value={inputs.expression}
                  onChange={(event) => setValue('expression', event.target.value)}
                  aria-label="f(x, y)"
                  className="flex-1 min-w-0 border-0 outline-0 bg-transparent text-ink py-[15px] font-mono text-[16px] font-semibold"
                  placeholder="x - 2*y"
                  spellCheck={false}
                />
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {(
                [
                  ['x0', t('euler.label_x0')],
                  ['xEnd', t('euler.label_xEnd')],
                  ['y0', t('euler.label_y0')],
                  ['h', t('euler.label_h')],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block min-w-0">
                  <span className="mb-1.5 block text-[13.5px] font-[650] text-ink">
                    {label}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={inputs[key as keyof typeof initialInputs]}
                    onChange={(event) => setValue(key as keyof typeof initialInputs, event.target.value)}
                    aria-label={label}
                    className="w-full border border-line-2 bg-bg-2 rounded-lg text-ink font-mono text-[15px] font-medium p-[13px_14px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft focus:bg-panel transition-all"
                  />
                </label>
              ))}
            </div>

            <PsNote icon={<Info size={15} />} variant="cyan">
              <div className="flex justify-between items-center w-full">
                <span>{t('euler.note_interval')}</span>
                <span className="font-mono text-brand font-semibold"><MathInline html={intervalMarkup} /></span>
              </div>
              <p className="mt-1.5 text-[12px] text-muted">
                {t('euler.hero_condition')}
              </p>
            </PsNote>

            <button
              type="submit"
              className="flex w-full items-center justify-between gap-3 mt-1.5 p-[16px_18px] font-sans text-[15px] font-[650] tracking-[-.01em] cursor-pointer text-brand-ink bg-ink border border-ink rounded-lg transition-all hover:-translate-y-0.5 hover:bg-brand hover:border-brand hover:text-white hover:shadow-[0_10px_22px_-10px_var(--brand)] active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {t('euler.btn_calc')} <Calculator size={20} />
            </button>

            {calculation.error && (
              <div className="mt-4 p-[16px_18px] border border-neg border-l-[5px] rounded-lg bg-[color-mix(in_srgb,var(--neg)_10%,transparent)]" role="alert">
                <b className="text-[14.5px]">{t('euler.err_calc')}</b>
                <p className="mt-1.5 text-[14px] text-ink-2">{calculation.error}</p>
              </div>
            )}
          </form>
        </PsPanel>

        <div className="grid gap-[18px] min-w-0">
          <PsPanel className="flex min-h-[420px] flex-col">
            <PsPanelHead eyebrow={t('euler.plot_eyebrow')} title={t('euler.plot_title')} idx="02" />
            <div className="h-[350px] w-full min-w-0 flex-1">
              {result && <EulerChart result={result} t={t} />}
            </div>
            {!result?.hasExactSolution && result && (
              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                <span className="font-semibold text-brand mr-1.5">●</span>
                {result.exactResult.hasExact ? '' : result.exactResult.reasonText}
              </p>
            )}
          </PsPanel>
        </div>
      </div>

      <PsPanel className="mb-[18px]">
        <PsPanelHead eyebrow={t('euler.method_eyebrow')} title={t('euler.method_title')} idx="03" />
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          <article className="min-w-0 rounded-lg border border-line bg-bg-2 p-5">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-muted">{t('euler.method_simple')}</span>
            <div className="mt-4 mb-2 min-h-[40px]">
              <Formula html={formulaMarkup.euler} />
            </div>
            <p className="mt-2 text-[13px] text-muted">{t('euler.method_simple_desc')}</p>
          </article>
          <article className="min-w-0 rounded-lg border border-line bg-bg-2 p-5">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-muted">{t('euler.method_improved')}</span>
            <div className="mt-4 mb-2 min-h-[40px]">
              <Formula html={formulaMarkup.improved} />
            </div>
            <p className="mt-2 text-[13px] text-muted">{t('euler.method_improved_desc')}</p>
          </article>
        </div>
      </PsPanel>

      <div className="grid gap-[18px] xl:grid-cols-2 mb-[18px]">
        <PsPanel>
          <div className="flex items-center justify-between mb-4">
            <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted">
              {t('euler.exact_title')}
            </span>
            {result && (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                  result.hasExactSolution
                    ? 'border-pos/30 bg-pos/10 text-pos'
                    : 'border-brand/30 bg-brand-soft text-brand'
                }`}
              >
                {result.hasExactSolution
                  ? t('euler.exact_badge_available')
                  : t('euler.exact_badge_numerical_only')}
              </span>
            )}
          </div>

          {result?.hasExactSolution && exactMarkup ? (
            <>
              <div className="min-h-[48px] overflow-x-auto text-cyan">
                <Formula html={exactMarkup} />
              </div>
              <p className="mt-4 text-[13px] text-muted leading-relaxed">
                {result.exactResult.description}
              </p>
            </>
          ) : result ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-line bg-bg-2 p-3.5 text-[13px]">
                <b className="block text-brand mb-1">
                  {t('euler.exact_not_found')}:
                </b>
                <p className="leading-relaxed text-ink-2">
                  {result.exactResult.hasExact ? '' : result.exactResult.reasonText}
                </p>
              </div>
              <p className="text-[12px] leading-relaxed text-muted">
                {t('euler.exact_numerical_hint')}
              </p>
            </div>
          ) : (
            <div className="min-h-[48px] overflow-x-auto text-cyan">
              <Formula html={formulaMarkup.exact} />
            </div>
          )}
        </PsPanel>
        <PsPanel>
          <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted mb-4">{t('euler.steps_title')}</span>
          <strong className="block font-mono text-[36px] font-semibold text-brand mb-2">
            {result ? result.steps : '—'}
          </strong>
          <p className="text-cyan text-[1.1em] mb-2">
            <MathInline html={formulaMarkup.steps} />
          </p>
          <p className="text-[13px] text-muted">
            {result
              ? `${numeric(Number(calculationInputs.xEnd) - Number(calculationInputs.x0))} ${t('euler.steps_desc')}`
              : t('euler.steps_err')}
          </p>
        </PsPanel>
      </div>

      {result && rows.length > 0 && (
        <ResultActions
          summaryText={`Eyler usuli: y' = ${calculationInputs.expression}, x0 = ${calculationInputs.x0}, y0 = ${calculationInputs.y0}, h = ${calculationInputs.h} -> qadamlar soni: ${result.steps}`}
          csvData={rows.map((r) => ({
            i: r.step,
            x_i: numeric(r.x),
            [t('euler.tbl_euler')]: numeric(r.yEuler),
            [t('euler.tbl_impr')]: numeric(r.yImproved),
            [t('euler.tbl_exact')]: r.yExact !== null ? numeric(r.yExact) : '—',
            [t('euler.tbl_diff')]: numeric(r.difference),
          }))}
          csvFileName="eyler-differensial.csv"
          imageFileName="eyler-differensial.png"
        />
      )}

      <PsPanel>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5 border-b border-line pb-4 relative z-10">
          <div>
            <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
              {t('euler.data_eyebrow')}
            </span>
            <h2 className="mt-2 text-[22px] font-[650] tracking-[-.035em]">{t('euler.data_title')}</h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
              <span>{t('euler.data_desc_1')}</span>
              <span className="text-brand font-semibold"><MathInline html={differenceMarkup} /></span>
            </p>
          </div>
          <span className="font-mono text-sm text-muted">
            {rows.length ? `${rows.length} ${t('euler.data_pts')}` : t('euler.data_empty')}
          </span>
        </div>

        <div className="max-h-[500px] overflow-x-auto overflow-y-auto relative z-10 rounded-lg border border-line bg-bg-2">
          <table className="w-full min-w-max border-collapse text-right font-mono text-[13px]">
            <thead className="sticky top-0 z-10 bg-panel text-muted border-b border-line shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <tr>
                {tableHeadings.map(({ label, html }) => (
                  <th className="px-5 py-3.5 font-semibold border-b border-line" key={label}>
                    <MathInline html={html} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-b border-line last:border-b-0 hover:bg-panel transition-colors" key={row.step}>
                  <td className="px-5 py-3 text-muted">{row.step}</td>
                  <td className="px-5 py-3">{numeric(row.x)}</td>
                  <td className="px-5 py-3 text-neg font-medium">{numeric(row.yEuler)}</td>
                  <td className="px-5 py-3 text-[#3b82f6] font-medium">{numeric(row.yImproved)}</td>
                  <td className="px-5 py-3 text-pos font-medium">{numeric(row.yExact)}</td>
                  <td className="px-5 py-3">{numeric(row.difference)}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td className="px-5 py-10 text-center text-muted" colSpan={6}>
                    {t('euler.tbl_calc_req')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PsPanel>

      {/* Notebook derivation protocol for students */}
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
                  {t('euler.notebook_eyebrow')}
                </span>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-brand/15 text-brand border border-brand/25">
                  {t('euler.notebook_badge')}
                </span>
              </div>
              <h2 className="mt-1 text-[21px] font-[650] tracking-[-.035em] group-hover:text-brand transition-colors">
                {t('euler.notebook_title')}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted max-w-xl">
                {t('euler.notebook_desc')}
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
              <span>{isNotebookOpen ? t('euler.notebook_toggle_close') : t('euler.notebook_toggle_open')}</span>
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
            {/* Tab switch control */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-panel/60 p-2 rounded-lg border border-line">
              <div className="inline-flex p-1 rounded-lg bg-bg-2 border border-line">
                <button
                  type="button"
                  onClick={() => setNotebookTab('simple')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    notebookTab === 'simple'
                      ? 'bg-panel text-ink shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {t('euler.notebook_tab_simple')}
                </button>
                <button
                  type="button"
                  onClick={() => setNotebookTab('improved')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    notebookTab === 'improved'
                      ? 'bg-panel text-ink shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {t('euler.notebook_tab_improved')}
                </button>
              </div>

              <span className="font-mono text-xs text-muted">
                {result?.detailedSteps.length ?? 0} {t('euler.notebook_step')}
              </span>
            </div>

            {result && result.detailedSteps.length > 0 ? (
              <>
                {/* Section 1: Given data in KaTeX */}
                <div className="p-4 rounded-lg border border-line bg-bg-2 space-y-3">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                    {t('euler.notebook_sec_1')}:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-md border border-line bg-panel flex flex-col justify-center">
                      <span className="text-muted block text-xs mb-1.5">Differensial tenglama:</span>
                      <MathKatex
                        tex={String.raw`y' = f(x, y) = ${calculationInputs.expression}`}
                        className="text-sm font-semibold text-ink"
                      />
                    </div>
                    <div className="p-3 rounded-md border border-line bg-panel flex flex-col justify-center">
                      <span className="text-muted block text-xs mb-1.5">Boshlang&apos;ich shart (Koshi):</span>
                      <MathKatex
                        tex={String.raw`x_0 = ${formatNum(Number(calculationInputs.x0))}, \quad y(x_0) = y_0 = ${formatNum(Number(calculationInputs.y0))}`}
                        className="text-sm font-semibold text-ink"
                      />
                    </div>
                    <div className="p-3 rounded-md border border-line bg-panel flex flex-col justify-center">
                      <span className="text-muted block text-xs mb-1.5">
                        {t('euler.notebook_interval')} va qadam:
                      </span>
                      <MathKatex
                        tex={String.raw`h = ${formatNum(Number(calculationInputs.h))}, \quad x \in \left[${formatNum(Number(calculationInputs.x0))}, \, ${formatNum(Number(calculationInputs.xEnd))}\right]`}
                        className="text-sm font-semibold text-ink"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Step-by-step arithmetic in KaTeX */}
                <div className="space-y-3">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                    {t('euler.notebook_sec_2')}:
                  </h3>

                  {(() => {
                    const steps = result.detailedSteps;
                    const isLarge = steps.length > 6;
                    const showCollapsed = isLarge && !notebookExpanded;
                    const headSteps = showCollapsed ? steps.slice(0, 4) : steps;
                    const lastStep = showCollapsed ? steps[steps.length - 1] : null;

                    const renderStepCard = (step: typeof steps[0]) => (
                      <div
                        key={step.i}
                        className="p-4 rounded-lg border border-line bg-bg-2 hover:border-line-2 transition-colors space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-line/60">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                            i = {step.i}
                          </span>
                          <MathKatex
                            tex={
                              notebookTab === 'simple'
                                ? String.raw`x_{${step.i}} = ${formatNum(step.x)}`
                                : String.raw`x_{${step.i}} = ${formatNum(step.xImproved)}`
                            }
                            className="text-xs text-muted"
                          />
                        </div>

                        {notebookTab === 'simple' ? (
                          <div className="space-y-2 text-ink text-sm">
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Nuqta:</span>
                              <MathKatex
                                tex={String.raw`x_{${step.i}} = ${formatNum(step.x)}, \quad y_{${step.i}} = ${formatNum(step.y)}`}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Hosila:</span>
                              <MathKatex
                                tex={String.raw`f(x_{${step.i}}, \, y_{${step.i}}) = ${substituteLatex(calculationInputs.expression, formatNum(step.x), formatNum(step.y))} = ${formatNum(step.f_xy)}`}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Keyingi y:</span>
                              <MathKatex
                                tex={String.raw`y_{${step.i + 1}} = y_{${step.i}} + h \cdot f(x_{${step.i}}, \, y_{${step.i}}) = ${formatNum(step.y)} + ${formatNum(step.h)} \cdot (${formatNum(step.f_xy)}) = \mathbf{${formatNum(step.nextY)}}`}
                                className="text-neg"
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Keyingi x:</span>
                              <MathKatex
                                tex={String.raw`x_{${step.i + 1}} = x_{${step.i}} + h = ${formatNum(step.x)} + ${formatNum(step.h)} = ${formatNum(step.nextX)}`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-ink text-sm">
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Nuqta:</span>
                              <MathKatex
                                tex={String.raw`x_{${step.i}} = ${formatNum(step.xImproved)}, \quad y_{${step.i}} = ${formatNum(step.yImproved)}`}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">k₁:</span>
                              <MathKatex
                                tex={String.raw`k_1 = f(x_{${step.i}}, \, y_{${step.i}}) = ${substituteLatex(calculationInputs.expression, formatNum(step.xImproved), formatNum(step.yImproved))} = ${formatNum(step.k1)}`}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Bashorat:</span>
                              <MathKatex
                                tex={String.raw`\bar{y}_{${step.i + 1}} = y_{${step.i}} + h \cdot k_1 = ${formatNum(step.yImproved)} + ${formatNum(step.h)} \cdot (${formatNum(step.k1)}) = ${formatNum(step.yPred)}`}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">k₂:</span>
                              <MathKatex
                                tex={String.raw`k_2 = f(x_{${step.i + 1}}, \, \bar{y}_{${step.i + 1}}) = ${substituteLatex(calculationInputs.expression, formatNum(step.nextX), formatNum(step.yPred))} = ${formatNum(step.k2)}`}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Korrektor:</span>
                              <MathKatex
                                tex={String.raw`y_{${step.i + 1}} = y_{${step.i}} + \frac{h}{2}(k_1 + k_2) = ${formatNum(step.yImproved)} + \frac{${formatNum(step.h)}}{2}\bigl(${formatNum(step.k1)} + (${formatNum(step.k2)})\bigr) = \mathbf{${formatNum(step.nextYImproved)}}`}
                                className="text-[#3b82f6]"
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-panel/60 border border-line/40">
                              <span className="text-xs text-muted font-mono min-w-[70px]">Keyingi x:</span>
                              <MathKatex
                                tex={String.raw`x_{${step.i + 1}} = x_{${step.i}} + h = ${formatNum(step.xImproved)} + ${formatNum(step.h)} = ${formatNum(step.nextX)}`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );

                    return (
                      <div className="space-y-3">
                        {headSteps.map(renderStepCard)}

                        {showCollapsed && lastStep && (
                          <>
                            <div className="py-2.5 px-4 rounded-lg border border-dashed border-line bg-panel text-center font-mono text-xs text-muted flex flex-wrap items-center justify-between gap-2">
                              <span>{t('euler.notebook_etc')}</span>
                              <button
                                type="button"
                                onClick={() => setNotebookExpanded(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-bg-2 hover:bg-bg border border-line text-ink font-semibold text-xs cursor-pointer transition-colors"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                                {t('euler.notebook_show_all', { count: steps.length })}
                              </button>
                            </div>
                            {renderStepCard(lastStep)}
                          </>
                        )}

                        {isLarge && notebookExpanded && (
                          <div className="text-center pt-2">
                            <button
                              type="button"
                              onClick={() => setNotebookExpanded(false)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel hover:bg-bg border border-line text-ink font-semibold text-xs cursor-pointer transition-colors shadow-xs"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                              {t('euler.notebook_collapse')}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Section 3: Final Answers Table in KaTeX */}
                <div className="space-y-2">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                    {t('euler.notebook_sec_3')}:
                  </h3>
                  <div className="max-h-[360px] overflow-x-auto overflow-y-auto rounded-lg border border-line bg-bg-2">
                    <table className="w-full min-w-max border-collapse text-right font-mono text-[13px]">
                      <thead className="sticky top-0 z-10 bg-panel text-muted border-b border-line shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                        <tr>
                          {notebookTab === 'simple' ? (
                            <>
                              <th className="px-4 py-2.5 font-semibold text-center border-b border-line">
                                <MathKatex tex="i" />
                              </th>
                              <th className="px-4 py-2.5 font-semibold border-b border-line">
                                <MathKatex tex="x_i" />
                              </th>
                              <th className="px-4 py-2.5 font-semibold border-b border-line">
                                <MathKatex tex="y_i" />
                              </th>
                              <th className="px-4 py-2.5 font-semibold border-b border-line">
                                <MathKatex tex="f(x_i, y_i)" />
                              </th>
                            </>
                          ) : (
                            <>
                              <th className="px-4 py-2.5 font-semibold text-center border-b border-line">
                                <MathKatex tex="i" />
                              </th>
                              <th className="px-4 py-2.5 font-semibold border-b border-line">
                                <MathKatex tex="x_i" />
                              </th>
                              <th className="px-4 py-2.5 font-semibold border-b border-line">
                                <MathKatex tex="y_i" />
                              </th>
                              <th className="px-4 py-2.5 font-semibold border-b border-line">
                                <MathKatex tex="k_1" />
                              </th>
                              <th className="px-4 py-2.5 font-semibold border-b border-line">
                                <MathKatex tex="\bar{y}_{i+1}" />
                              </th>
                              <th className="px-4 py-2.5 font-semibold border-b border-line">
                                <MathKatex tex="k_2" />
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {result.detailedSteps.map((step) => (
                          <tr
                            key={step.i}
                            className="border-b border-line last:border-b-0 hover:bg-panel transition-colors"
                          >
                            {notebookTab === 'simple' ? (
                              <>
                                <td className="px-4 py-2 text-center text-muted">
                                  <MathKatex tex={String(step.i)} />
                                </td>
                                <td className="px-4 py-2">
                                  <MathKatex tex={formatNum(step.x)} />
                                </td>
                                <td className="px-4 py-2 font-medium text-neg">
                                  <MathKatex tex={formatNum(step.y)} />
                                </td>
                                <td className="px-4 py-2">
                                  <MathKatex tex={formatNum(step.f_xy)} />
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-2 text-center text-muted">
                                  <MathKatex tex={String(step.i)} />
                                </td>
                                <td className="px-4 py-2">
                                  <MathKatex tex={formatNum(step.xImproved)} />
                                </td>
                                <td className="px-4 py-2 font-medium text-[#3b82f6]">
                                  <MathKatex tex={formatNum(step.yImproved)} />
                                </td>
                                <td className="px-4 py-2">
                                  <MathKatex tex={formatNum(step.k1)} />
                                </td>
                                <td className="px-4 py-2">
                                  <MathKatex tex={formatNum(step.yPred)} />
                                </td>
                                <td className="px-4 py-2">
                                  <MathKatex tex={formatNum(step.k2)} />
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        {result.detailedSteps.length > 0 && (
                          <tr className="bg-panel/70 font-semibold border-t-2 border-line">
                            {notebookTab === 'simple' ? (
                              <>
                                <td className="px-4 py-2.5 text-center text-muted">
                                  <MathKatex
                                    tex={String(result.detailedSteps[result.detailedSteps.length - 1].i + 1)}
                                  />
                                </td>
                                <td className="px-4 py-2.5">
                                  <MathKatex
                                    tex={formatNum(result.detailedSteps[result.detailedSteps.length - 1].nextX)}
                                  />
                                </td>
                                <td className="px-4 py-2.5 text-neg font-bold">
                                  <MathKatex
                                    tex={formatNum(result.detailedSteps[result.detailedSteps.length - 1].nextY)}
                                  />
                                </td>
                                <td className="px-4 py-2.5 text-muted">—</td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-2.5 text-center text-muted">
                                  <MathKatex
                                    tex={String(result.detailedSteps[result.detailedSteps.length - 1].i + 1)}
                                  />
                                </td>
                                <td className="px-4 py-2.5">
                                  <MathKatex
                                    tex={formatNum(result.detailedSteps[result.detailedSteps.length - 1].nextX)}
                                  />
                                </td>
                                <td className="px-4 py-2.5 text-[#3b82f6] font-bold">
                                  <MathKatex
                                    tex={formatNum(
                                      result.detailedSteps[result.detailedSteps.length - 1].nextYImproved
                                    )}
                                  />
                                </td>
                                <td className="px-4 py-2.5 text-muted">—</td>
                                <td className="px-4 py-2.5 text-muted">—</td>
                                <td className="px-4 py-2.5 text-muted">—</td>
                              </>
                            )}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-muted font-mono text-sm relative z-10">
                {t('euler.tbl_calc_req')}
              </div>
            )}
          </div>
        )}
      </PsPanel>
    </div>
  );
}

function EulerChart({ result, t }: { result: EulerResult, t: (k: string) => string }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <LineChart data={result.rows} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="3 5" />
        <XAxis
          dataKey="x"
          type="number"
          domain={['dataMin', 'dataMax']}
          tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
          tickLine={{ stroke: 'var(--line-2)' }}
          axisLine={{ stroke: 'var(--line-2)' }}
          tickFormatter={(value: number) => Number(value).toFixed(2)}
          label={{ value: 'x', position: 'insideBottomRight', offset: -2, fill: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
        />
        <YAxis
          width={54}
          tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
          tickLine={{ stroke: 'var(--line-2)' }}
          axisLine={{ stroke: 'var(--line-2)' }}
          tickFormatter={(value: number) => Number(value).toFixed(2)}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            color: 'var(--ink)',
            fontSize: 12,
            fontFamily: 'var(--font-mono)'
          }}
          labelStyle={{ color: 'var(--muted)', marginBottom: 4 }}
          labelFormatter={(value) => `x = ${Number(value).toFixed(6)}`}
          formatter={(value, name) => [
            Number(value).toFixed(8),
            name === 'yEuler'
              ? t('euler.method_simple')
              : name === 'yImproved'
                ? t('euler.method_improved')
                : t('euler.exact_title'),
          ]}
        />
        <Legend
          wrapperStyle={{ fontFamily: 'var(--font-sans)', fontSize: 13 }}
          formatter={(value) =>
            value === 'yEuler'
              ? t('euler.method_simple')
              : value === 'yImproved'
                ? t('euler.method_improved')
                : t('euler.exact_title')
          }
        />
        <Line
          name="yEuler"
          type="linear"
          dataKey="yEuler"
          stroke="var(--neg)"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={{ r: 3, fill: 'var(--neg)' }}
          activeDot={{ r: 6 }}
        />
        <Line
          name="yImproved"
          type="linear"
          dataKey="yImproved"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#3b82f6' }}
          activeDot={{ r: 6 }}
        />
        {result.hasExactSolution && (
          <Line
            name="yExact"
            type="monotone"
            dataKey="yExact"
            stroke="var(--pos)"
            strokeWidth={1.75}
            strokeDasharray="2 4"
            dot={{ r: 2, fill: 'var(--pos)' }}
            activeDot={{ r: 5 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
