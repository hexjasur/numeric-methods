'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Target } from 'lucide-react';
import { calculateNewton, format, type NewtonResult } from '@/lib/newton';
import { normalizeExpression } from '@/lib/math';
import { PsHero, PsStrip, PsPanel, PsPanelHead } from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';

export function NewtonMethod() {
  const { t } = useI18n();
  const [expression, setExpression] = useState('x^3 - 2*x - 5');
  const [x0, setX0] = useState('2');
  const [epsilon, setEpsilon] = useState('0.0001');
  const [result, setResult] = useState<NewtonResult | null>(null);
  const [error, setError] = useState('');

  const formula = useMemo(() => {
    try {
      return katex.renderToString(
        `f(x) = ${normalizeExpression(expression)}`,
        { throwOnError: false },
      );
    } catch {
      return '';
    }
  }, [expression]);
  
  const derivFormula = useMemo(() => {
    if (!result?.derivativeExpr) return '';
    try {
      return katex.renderToString(
        `f'(x) = ${result.derivativeExpr}`,
        { throwOnError: false },
      );
    } catch {
      return '';
    }
  }, [result?.derivativeExpr]);

  function calculate() {
    setError('');
    try {
      setResult(calculateNewton(expression, x0, epsilon, '50', t));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : t('newton.err_calc'));
    }
  }

  const numeric = (val: number) => format(val, 8);

  return (
    <div className="relative max-w-[1160px] mx-auto px-4 pb-12">
      <PsStrip eyebrow="NWT-003" id="ROOT" name={t('newton.strip')} />

      <PsHero 
        eyebrow={t('newton.hero_eyebrow')}
        title={<>{t('newton.hero_title')}</>}
        titleHighlight={t('newton.hero_titleHighlight')}
        lead={t('newton.hero_lead')}
        conditionMain={<>{t('newton.hero_condMain')}</>}
        conditionSub={t('newton.hero_condSub')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,.82fr)_minmax(0,1.4fr)] gap-[18px] items-start">
        {/* INPUT */}
        <PsPanel>
          <PsPanelHead eyebrow="Input / Parametrlar" title={t('newton.panel_input')} idx="01" />

          <label className="block mb-4 mt-2">
            <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
              {t('newton.label_fn')}
            </span>
            <div className="mt-2 w-full border border-brand bg-brand-soft rounded-lg flex items-center gap-2.5 px-3.5 focus-within:ring-4 focus-within:ring-brand-soft focus-within:bg-panel transition-all">
              <b className="text-brand text-[15px] whitespace-nowrap">f(x) =</b>
              <input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="x^3 - 2*x - 5"
                spellCheck={false}
                className="flex-1 min-w-0 border-0 outline-0 bg-transparent text-ink py-[15px] font-mono text-[16px] font-semibold"
              />
            </div>
          </label>

          <div className="grid place-items-center min-h-[56px] -mt-1 mb-[18px] p-2.5 overflow-x-auto bg-bg-2 border border-dashed border-line-2 rounded-lg text-cyan text-[1.1em] [&_.katex]:text-[1.05em]">
            {formula ? (
              <span dangerouslySetInnerHTML={{ __html: formula }} />
            ) : (
              <span className="font-mono text-[13px] font-medium text-neg">Error</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="block">
              <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
                x₀
              </span>
              <input
                type="number"
                step="any"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                className="mt-2 w-full border border-line-2 bg-bg-2 rounded-lg text-ink font-mono text-[15px] font-medium p-[13px_14px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft focus:bg-panel transition-all"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
                ε
              </span>
              <input
                type="number"
                step="any"
                value={epsilon}
                onChange={(e) => setEpsilon(e.target.value)}
                className="mt-2 w-full border border-line-2 bg-bg-2 rounded-lg text-ink font-mono text-[15px] font-medium p-[13px_14px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft focus:bg-panel transition-all"
              />
            </label>
          </div>

          <button 
            className="flex w-full items-center justify-between gap-3 mt-4 p-[16px_18px] font-sans text-[15px] font-[650] tracking-[-.01em] cursor-pointer text-brand-ink bg-ink border border-ink rounded-lg transition-all hover:-translate-y-0.5 hover:bg-brand hover:border-brand hover:text-white hover:shadow-[0_10px_22px_-10px_var(--brand)] active:translate-y-0"
            onClick={calculate}
          >
            {t('newton.btn_calc')} <ArrowUpRight size={20} />
          </button>
        </PsPanel>

        {/* OUTPUT */}
        <div className="grid gap-[18px] min-w-0">
          <div className={`flex items-center justify-between gap-5 min-h-[150px] p-6 border border-line rounded-[10px] shadow-[var(--shadow)] transition-all duration-300 ${result ? 'bg-[linear-gradient(135deg,var(--brand-soft),var(--panel)_70%)] border-brand' : 'bg-panel'}`}>
            <div>
              <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted">{t('newton.res_eyebrow')}</span>
              <strong className="block my-3 font-mono text-[clamp(30px,4.4vw,48px)] leading-none tracking-[-.06em] text-brand break-all">
                {result ? format(result.root, 8) : t('newton.res_empty')}
              </strong>
              <small className="text-[13.5px] text-muted">{result ? t('newton.res_desc_done') : t('newton.res_desc_wait')}</small>
            </div>
            <div className="text-right pl-6 border-l border-line">
              <span className="block text-[13px] text-muted">{t('newton.res_iter')}</span>
              <b className="block mt-1.5 font-mono text-[32px] font-semibold leading-none">{result?.iterations ?? t('newton.res_empty')}</b>
            </div>
          </div>
          
          {error && (
            <div className="p-[16px_18px] border border-neg border-l-[5px] rounded-lg bg-[color-mix(in_srgb,var(--neg)_10%,transparent)]" role="alert">
              <b className="text-[14.5px]">{t('newton.err_calc')}</b>
              <p className="mt-1.5 text-[14px] text-ink-2">{error}</p>
            </div>
          )}

          {result && derivFormula && (
             <PsPanel>
               <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted mb-4">{t('newton.deriv_title')}</span>
               <div className="min-h-[48px] overflow-x-auto text-cyan text-[1.2em]">
                 <span dangerouslySetInnerHTML={{ __html: derivFormula }} />
               </div>
             </PsPanel>
          )}

          <PsPanel>
            <PsPanelHead eyebrow="Trace / Iterations" title={t('newton.trace_title')} idx="02" />

            {!result && !error && (
              <div className="grid place-content-center min-h-[200px] text-center text-muted text-[14.5px] leading-[1.8]">
                <Target size={42} strokeWidth={1.5} className="mx-auto mb-3 text-cyan" />
                <p>
                  <b className="text-ink">{t('newton.trace_empty_title')}</b>
                </p>
              </div>
            )}

            {result && (
              <div className="overflow-x-auto mt-2">
                <table className="w-full min-w-max text-right font-mono text-[13px]">
                  <thead className="text-muted border-b border-line">
                    <tr>
                      <th className="py-2.5 pr-4 font-semibold text-left">i</th>
                      <th className="py-2.5 px-4 font-semibold">{t('newton.tbl_x')}</th>
                      <th className="py-2.5 px-4 font-semibold text-brand">{t('newton.tbl_fx')}</th>
                      <th className="py-2.5 px-4 font-semibold text-cyan">{t('newton.tbl_dfx')}</th>
                      <th className="py-2.5 pl-4 font-semibold">{t('newton.tbl_diff')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.steps.map((step) => (
                      <tr key={step.iteration} className="border-b border-line-2 last:border-0 hover:bg-bg-2">
                        <td className="py-3 pr-4 text-left font-bold text-muted">{step.iteration}</td>
                        <td className="py-3 px-4 text-ink">{numeric(step.x)}</td>
                        <td className="py-3 px-4 text-brand">{numeric(step.fx)}</td>
                        <td className="py-3 px-4 text-cyan">{numeric(step.dfx)}</td>
                        <td className="py-3 pl-4 text-muted">{step.iteration > 0 ? numeric(step.difference) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </PsPanel>
        </div>
      </div>
    </div>
  );
}

export default NewtonMethod;
