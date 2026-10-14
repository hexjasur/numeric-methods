'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import { Activity, Calculator } from 'lucide-react';
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
import { PsHero, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { calculateRK4, exactRK4Example, type RK4Options, type RK4Result } from '@/lib/runge-kutta';

const initialInputs = { x0: '0', y0: '1', xEnd: '0.3', h: '0.1' };
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

export function RungeKuttaMethod() {
  const { t } = useI18n();
  const [inputs, setInputs] = useState(initialInputs);
  const [calculationInputs, setCalculationInputs] = useState(initialInputs);
  const calculation = useMemo(() => {
    const options: RK4Options = {
      x0: Number(calculationInputs.x0),
      y0: Number(calculationInputs.y0),
      xEnd: Number(calculationInputs.xEnd),
      h: Number(calculationInputs.h),
    };
    try {
      const rows = calculateRK4(options);
      return { rows, options, error: '' };
    } catch {
      return { rows: [] as RK4Result[], options, error: t('rk4.error') };
    }
  }, [calculationInputs, t]);
  const { rows, options, error } = calculation;
  const chartData = useMemo(
    () => rows.map((row) => ({ ...row, exact: exactRK4Example(row.x, options.x0, options.y0) })),
    [rows, options],
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
        conditionMain={<>y&apos; = x² + y,&nbsp;&nbsp;y(x₀) = y₀</>}
        conditionSub={t('rk4.condition')}
      />

      <div className="grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[minmax(280px,.7fr)_minmax(0,1.3fr)]">
        <PsPanel>
          <PsPanelHead eyebrow="INPUT / PARAMETERS" title={t('rk4.parameters')} idx="01" />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setCalculationInputs({ ...inputs });
            }}
            className="space-y-4"
          >
            <p className="rounded-lg border border-line bg-bg-2 px-3 py-2 font-mono text-sm text-cyan">f(x, y) = x² + y</p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ['x0', 'x₀'],
                  ['y0', 'y₀'],
                  ['xEnd', 'x end'],
                  ['h', 'h'],
                ] as const
              ).map(([key, label]) => (
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
              ))}
            </div>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-semibold text-brand-ink transition-opacity hover:opacity-90">
              <Calculator size={17} aria-hidden="true" /> {t('rk4.calculate')}
            </button>
            {error && <p role="alert" className="rounded-lg border border-neg/30 bg-neg/10 px-3 py-2 text-sm text-neg">{error}</p>}
          </form>
          <div className="mt-6 border-t border-line pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{t('rk4.formulas')}</p>
            <MathFormula html={formula} />
          </div>
        </PsPanel>

        <div className="space-y-[18px]">
          <PsPanel>
            <PsPanelHead eyebrow="VISUALIZATION / RK4" title={t('rk4.chart_title')} idx="02" />
            {chartData.length > 0 ? (
              <div className="h-[300px] w-full" role="img" aria-label={t('rk4.chart_title')}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
                    <CartesianGrid stroke="var(--line)" strokeDasharray="4 4" />
                    <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} width={58} />
                    <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }} labelFormatter={(label) => `x = ${Number(label).toFixed(4)}`} formatter={(value, name) => [Number(value).toFixed(8), name === 'y' ? 'RK4' : t('rk4.exact')]} />
                    <Legend formatter={(value) => value === 'y' ? 'RK4' : t('rk4.exact')} />
                    <Line type="monotone" dataKey="y" name="y" stroke="var(--brand)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="exact" name="exact" stroke="var(--cyan)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="py-10 text-center text-sm text-muted">{t('rk4.no_chart')}</p>}
            <div className="mt-2 flex items-center gap-2 text-xs text-muted"><Activity size={14} aria-hidden="true" />{t('rk4.chart_note')}</div>
          </PsPanel>

          <PsPanel>
            <PsPanelHead eyebrow="RESULTS / STEP TABLE" title={t('rk4.table_title')} idx="03" />
            {rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="bg-bg-2 text-xs uppercase tracking-wide text-muted">
                    <tr>{['i', 'xᵢ', 'yᵢ', 'k₀', 'k₁', 'k₂', 'k₃'].map((heading) => <th key={heading} className="border-b border-line px-3 py-3 font-semibold">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.step} className="border-b border-line last:border-0 hover:bg-bg-2/70">
                        <td className="px-3 py-3 text-muted">{row.step}</td>
                        <td className="px-3 py-3 font-mono">{row.x.toFixed(4)}</td>
                        <td className="px-3 py-3 font-mono font-semibold text-brand">{number(row.y)}</td>
                        {[row.k0, row.k1, row.k2, row.k3].map((value, index) => <td key={index} className="px-3 py-3 font-mono text-xs text-muted">{number(value)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="py-8 text-center text-sm text-muted">{t('rk4.no_results')}</p>}
            {rows.length > 0 && <p className="mt-4 rounded-lg border border-cyan/20 bg-cyan-soft px-3 py-2 text-sm text-ink-2">{t('rk4.final_value')}: <strong className="font-mono text-brand">y({rows[rows.length - 1].x.toFixed(4)}) ≈ {number(rows[rows.length - 1].y)}</strong></p>}
          </PsPanel>
        </div>
      </div>
    </div>
  );
}
