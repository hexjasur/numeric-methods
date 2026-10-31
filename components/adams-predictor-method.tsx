'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import { Calculator } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { ResultActions } from '@/components/ui/result-actions';
import { calculateAdamsPredictor, type AdamsPredictorOptions, type AdamsPredictorResult } from '@/lib/adams-predictor';

const defaults = { expression: 'x - 2*y', a: '-1', b: '2', x0: '0', y0: '1', h: '0.6' };
const formula = katex.renderToString(String.raw`\Delta y_i=q_i+\frac{1}{2}\Delta q_{i-1}+\frac{5}{12}\Delta^2q_{i-2}+\frac{3}{8}\Delta^3q_{i-3},\qquad y_{i+1}=y_i+\Delta y_i`, { throwOnError: false, displayMode: true });

export function AdamsPredictorMethod() {
  const { t } = useI18n();
  const [inputs, setInputs] = useState(defaults);
  const [calculationInputs, setCalculationInputs] = useState(defaults);
  const calculation = useMemo(() => {
    try {
      const options: AdamsPredictorOptions = {
        a: Number(calculationInputs.a), b: Number(calculationInputs.b),
        x0: Number(calculationInputs.x0), y0: Number(calculationInputs.y0), h: Number(calculationInputs.h),
      };
      return { rows: calculateAdamsPredictor(calculationInputs.expression, options), error: '' };
    } catch {
      return { rows: [] as AdamsPredictorResult[], error: t('adams.error') };
    }
  }, [calculationInputs, t]);
  const setInput = (key: keyof typeof defaults, value: string) => setInputs((current) => ({ ...current, [key]: value }));
  const last = calculation.rows[calculation.rows.length - 1];

  return (
    <div className="relative mx-auto max-w-[1160px] px-4 pb-12">
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
          <form onSubmit={(event) => { event.preventDefault(); setCalculationInputs({ ...inputs }); }} className="space-y-4">
            <label className="block text-sm font-semibold text-ink">
              {t('adams.expression')}
              <span className="mt-1.5 flex w-full items-center gap-2 rounded-lg border border-brand bg-brand-soft px-3 focus-within:ring-2 focus-within:ring-brand/20">
                <span className="whitespace-nowrap font-mono text-brand">f(x,y) =</span>
                <input type="text" value={inputs.expression} onChange={(event) => setInput('expression', event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent py-3 font-mono font-normal text-ink outline-none" aria-label="f(x, y)" spellCheck={false} required />
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([['a', 'a'], ['b', 'b'], ['x0', 'x₀'], ['y0', 'y₀'], ['h', 'h']] as const).map(([key, label]) => (
                <label key={key} className="block text-sm font-semibold text-ink">{label}
                  <input type="number" step="any" value={inputs[key]} onChange={(event) => setInput(key, event.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 font-mono font-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" aria-label={label} />
                </label>
              ))}
            </div>
            <p className="text-xs text-muted">{t('adams.initial_hint')}</p>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-semibold text-brand-ink transition-opacity hover:opacity-90">
              <Calculator size={17} aria-hidden="true" /> {t('adams.calculate')}
            </button>
            {calculation.error && <p role="alert" className="rounded-lg border border-neg/30 bg-neg/10 px-3 py-2 text-sm text-neg">{calculation.error}</p>}
          </form>
          <div className="mt-6 border-t border-line pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{t('adams.formula_title')}</p>
            <div className="overflow-x-auto text-cyan" dangerouslySetInnerHTML={{ __html: formula }} />
            <p className="mt-3 text-xs leading-5 text-muted">{t('adams.startup_note')}</p>
          </div>
        </PsPanel>
        <div className="space-y-[18px]">
          {last && <PsPanel>
            <PsPanelHead eyebrow="INITIAL VALUE PROBLEM" title={t('adams.result_title')} idx="02" />
            <p className="text-sm text-ink-2">{t('adams.result_summary')} <strong className="font-mono text-brand">y({last.x}) ≈ {last.y}</strong></p>
            <p className="mt-2 text-xs text-muted">{t('adams.example')} <span className="font-mono">y&apos; = x − 2y, y(0)=1, [−1,2], h=0.6</span></p>
          </PsPanel>}
          {calculation.rows.length > 0 && <>
            <ResultActions
              summaryText={`Adams predictor: y'=${calculationInputs.expression}, interval [${calculationInputs.a}, ${calculationInputs.b}], y(${calculationInputs.x0})=${calculationInputs.y0}, h=${calculationInputs.h}; y(${last?.x})≈${last?.y}`}
              csvData={calculation.rows.map((row) => ({ i: row.step, x: row.x, y: row.y, q: row.q, increment: row.increment, method: row.method }))}
              csvFileName="adams-predictor-natija.csv"
              imageFileName="adams-predictor-natija.png"
            />
            <PsPanel>
              <PsPanelHead eyebrow="CALCULATION / TRACE" title={t('adams.table_title')} idx="03" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead><tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                    <th className="px-2 py-3">i</th><th className="px-2 py-3">xᵢ</th><th className="px-2 py-3">yᵢ</th><th className="px-2 py-3">qᵢ = h f(xᵢ,yᵢ)</th><th className="px-2 py-3">Δyᵢ</th><th className="px-2 py-3">{t('adams.method')}</th>
                  </tr></thead>
                  <tbody>{calculation.rows.map((row) => <tr key={`${row.step}-${row.x}`} className="border-b border-line/70 font-mono text-xs text-ink-2">
                    <td className="px-2 py-2.5">{row.step}</td><td className="px-2 py-2.5">{row.x}</td><td className="px-2 py-2.5">{row.y}</td><td className="px-2 py-2.5">{row.q}</td><td className="px-2 py-2.5">{row.increment}</td><td className="px-2 py-2.5 font-sans">{t(`adams.method_${row.method === 'Initial' ? 'initial' : row.method === 'RK4 startup' ? 'rk4' : row.method === 'Adams predictor' ? 'predictor' : 'boundary'}`)}</td>
                  </tr>)}</tbody>
                </table>
              </div>
            </PsPanel>
          </>}
        </div>
      </div>
    </div>
  );
}
