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
import { Calculator, Info } from 'lucide-react';
import { solveEulerMethods, type EulerResult } from '@/lib/euler';
import { PsHero, PsStrip, PsPanel, PsPanelHead, PsNote } from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';

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
  difference: katex.renderToString(
    String.raw`\Delta y=\left|y_{\mathrm{takomil}}-y_{\mathrm{eyler}}\right|`,
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

export function EulerMethod() {
  const { t } = useI18n();
  const [inputs, setInputs] = useState(initialInputs);
  const [calculationInputs, setCalculationInputs] = useState(initialInputs);
  const calculation = useMemo(() => {
    try {
      const result = solveEulerMethods(
        calculationInputs.expression,
        Number(calculationInputs.x0),
        Number(calculationInputs.y0),
        Number(calculationInputs.xEnd),
        Number(calculationInputs.h),
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
  }, [calculationInputs]);

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
  
  const setValue = (key: keyof typeof initialInputs, value: string) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const tableHeadings = [
    [String.raw`i`, 'i'],
    [String.raw`x_i`, 'x_i'],
    [String.raw`y_i^{\text{Eyler}}`, t('euler.tbl_euler')],
    [String.raw`y_i^{\text{Takomil}}`, t('euler.tbl_impr')],
    [String.raw`y(x_i)^{\text{Aniq}}`, t('euler.tbl_exact')],
    [String.raw`\Delta y`, 'Δy'],
  ].map(([tex, label]) => ({
    label: label as string,
    html: katex.renderToString(tex as string, { throwOnError: false }),
  }));

  return (
    <div className="relative max-w-[1160px] mx-auto px-4 pb-12">
      <PsStrip eyebrow="ELR-002" id="ODE" name={t('euler.strip')} />

      <PsHero 
        eyebrow={t('euler.hero_eyebrow')}
        title={<>{t('euler.hero_title')}</>}
        titleHighlight={t('euler.hero_titleHighlight')}
        lead={t('euler.hero_lead')}
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
              <p className="mt-4 text-sm text-muted">
                {t('euler.plot_exact_note')}
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
          <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted mb-4">{t('euler.exact_title')}</span>
          <div className="min-h-[48px] overflow-x-auto text-cyan">
            <Formula html={formulaMarkup.exact} />
          </div>
          <p className="mt-4 text-[13px] text-muted">
            {t('euler.exact_desc')}
          </p>
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

      <PsPanel>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5 border-b border-line pb-4 relative z-10">
          <div>
            <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted leading-[1.2]">
              {t('euler.data_eyebrow')}
            </span>
            <h2 className="mt-2 text-[22px] font-[650] tracking-[-.035em]">{t('euler.data_title')}</h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
              <span>{t('euler.data_desc_1')}</span>
              <span className="text-brand font-semibold"><MathInline html={formulaMarkup.difference} /></span>
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
