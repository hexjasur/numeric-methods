'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Check, Info, Waves } from 'lucide-react';
import { calculateBisection, format, type Result } from '@/lib/bisection';
import { normalizeExpression } from '@/lib/math';
import { BisectionPlot as Plot } from '@/components/bisection/plot';
import { PsHero, PsStrip, PsMap, PsPanel, PsPanelHead, PsNote } from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';

export function BisectionMethod() {
  const { t } = useI18n();
  const [expression, setExpression] = useState('x^3 + x - 1');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [epsilon, setEpsilon] = useState('0.01');
  const [result, setResult] = useState<Result | null>(null);
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

  function calculate() {
    setError('');
    try {
      setResult(calculateBisection(expression, a, b, epsilon, t));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : t('bisection.err_calc'));
    }
  }

  const renderKatex = (value: string) => katex.renderToString(value, { throwOnError: false });
  const sign = (v: number) => (v < 0 ? 'text-neg' : 'text-pos');

  return (
    <div className="bm relative max-w-[1160px] mx-auto px-4 pb-12">
      <PsStrip eyebrow="BSC-001" id="ROOT" name={t('bisection.strip')} />

      <PsHero 
        eyebrow={t('bisection.hero_eyebrow')}
        title={<>{t('bisection.hero_title')}</>}
        titleHighlight={t('bisection.hero_titleHighlight')}
        lead={t('bisection.hero_lead')}
        conditionMain={<>f(a) · f(b) <b>&lt;</b> 0</>}
        conditionSub={t('bisection.hero_condSub')}
      />

      <PsMap 
        eyebrow="Method map"
        title={t('bisection.map_title')}
        steps={[
          {n: '01', t: t('bisection.map_1_t'), s: t('bisection.map_1_s')},
          {n: '02', t: t('bisection.map_2_t'), s: t('bisection.map_2_s')},
          {n: '03', t: t('bisection.map_3_t'), s: t('bisection.map_3_s')},
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,.82fr)_minmax(0,1.4fr)] gap-[18px] items-start">
        {/* INPUT */}
        <PsPanel>
          <PsPanelHead eyebrow="Input / Parametrlar" title={t('bisection.panel_input')} idx="01" />

          <PsNote icon={<Info size={18} />}>
            <p><b>{t('bisection.label_fn').split(' ')[0]}</b> — {t('bisection.note_fn')} <code>x^3 + x - 1</code></p>
          </PsNote>

          <label className="block mb-4">
            <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
              {t('bisection.label_fn')} <em className="font-mono text-xs font-medium not-italic text-muted">{t('bisection.label_syntax')}</em>
            </span>
            <div className="mt-2 w-full border border-brand bg-brand-soft rounded-lg flex items-center gap-2.5 px-3.5 focus-within:ring-4 focus-within:ring-brand-soft focus-within:bg-panel transition-all">
              <b className="text-brand text-[15px] whitespace-nowrap">f(x) =</b>
              <input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="x^3 + x - 1"
                aria-label={t('bisection.label_fn')}
                spellCheck={false}
                className="flex-1 min-w-0 border-0 outline-0 bg-transparent text-ink py-[15px] font-mono text-[16px] font-semibold"
              />
            </div>
          </label>

          <div className="grid place-items-center min-h-[56px] -mt-1 mb-[18px] p-2.5 overflow-x-auto bg-bg-2 border border-dashed border-line-2 rounded-lg text-cyan text-[1.1em] [&_.katex]:text-[1.05em]">
            {formula ? (
              <span dangerouslySetInnerHTML={{ __html: formula }} />
            ) : (
              <span className="font-mono text-[13px] font-medium text-neg">
                {t('bisection.err_fn')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="block">
              <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
                a <em className="font-mono text-xs font-medium not-italic text-muted">{t('bisection.label_a').split(' ')[1] ?? 'start'}</em>
              </span>
              <input
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="mt-2 w-full border border-line-2 bg-bg-2 rounded-lg text-ink font-mono text-[15px] font-medium p-[13px_14px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft focus:bg-panel transition-all"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
                b <em className="font-mono text-xs font-medium not-italic text-muted">{t('bisection.label_b').split(' ')[1] ?? 'end'}</em>
              </span>
              <input
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="mt-2 w-full border border-line-2 bg-bg-2 rounded-lg text-ink font-mono text-[15px] font-medium p-[13px_14px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft focus:bg-panel transition-all"
              />
            </label>
          </div>

          <PsNote variant="orange" icon={<span className="font-mono font-bold text-lg leading-none">ε</span>}>
            <p><b>{t('bisection.label_eps')}</b> — {t('bisection.note_eps').split(' — ')[1]}</p>
          </PsNote>

          <label className="block mb-[16px]">
            <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
              {t('bisection.label_eps')} <em className="font-mono text-xs font-medium not-italic text-muted">ε / epsilon</em>
            </span>
            <input
              type="number"
              step="any"
              min="0.000001"
              value={epsilon}
              onChange={(e) => setEpsilon(e.target.value)}
              className="mt-2 w-full border border-line-2 bg-bg-2 rounded-lg text-ink font-mono text-[15px] font-medium p-[13px_14px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft focus:bg-panel transition-all"
            />
          </label>

          <button 
            className="flex w-full items-center justify-between gap-3 mt-1.5 p-[16px_18px] font-sans text-[15px] font-[650] tracking-[-.01em] cursor-pointer text-brand-ink bg-ink border border-ink rounded-lg transition-all hover:-translate-y-0.5 hover:bg-brand hover:border-brand hover:text-white hover:shadow-[0_10px_22px_-10px_var(--brand)] active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            onClick={calculate}
          >
            {t('bisection.btn_calc')} <ArrowUpRight size={20} />
          </button>

          <div className="mt-[22px] pt-[16px] border-t border-line">
            <strong className="block mb-2.5 font-mono text-xs font-semibold tracking-[.1em] uppercase text-muted">{t('bisection.sample_formula')}</strong>
            <div className="flex flex-wrap gap-2">
              {['sin(x)', 'cos(x)', 'sqrt(x)', 'log(x)', 'x^2', 'e^x'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className="cursor-pointer py-1.5 px-2.5 border border-line-2 bg-bg-2 text-brand rounded-md font-mono text-[13px] font-semibold transition-all hover:border-brand hover:bg-brand-soft hover:-translate-y-[1px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                  onClick={() => setExpression((v) => (v.trim() ? `${v} + ${t}` : t))}
                  title="Ifodaga qo'shish"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </PsPanel>

        {/* OUTPUT */}
        <div className="grid gap-[18px] min-w-0">
          <div className={`flex items-center justify-between gap-5 min-h-[150px] p-6 border border-line rounded-[10px] shadow-[var(--shadow)] transition-all duration-300 ${result ? 'bg-[linear-gradient(135deg,var(--brand-soft),var(--panel)_70%)] border-brand' : 'bg-panel'}`}>
            <div>
              <span className="block font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted">{t('bisection.res_eyebrow')}</span>
              <strong className="block my-3 font-mono text-[clamp(30px,4.4vw,48px)] leading-none tracking-[-.06em] text-brand break-all">
                {result ? format(result.root, 8) : t('bisection.res_empty')}
              </strong>
              <small className="text-[13.5px] text-muted">{result ? t('bisection.res_desc_done') : t('bisection.res_desc_wait')}</small>
            </div>
            <div className="text-right pl-6 border-l border-line">
              <span className="block text-[13px] text-muted">{t('bisection.res_iter')}</span>
              <b className="block mt-1.5 font-mono text-[32px] font-semibold leading-none">{result?.iterations ?? t('bisection.res_empty')}</b>
            </div>
          </div>

          <PsPanel>
            <PsPanelHead eyebrow={t('bisection.plot_eyebrow')} title={t('bisection.plot_title')} idx="02" />
            <Plot expression={expression} a={a} b={b} result={result} />
            <ul className="flex flex-wrap gap-[8px_18px] mt-3.5 p-0 list-none font-mono text-[12.5px] font-medium text-muted">
              <li className="flex items-center gap-2"><i className="inline-block w-[18px] h-0 border-t-2 border-cyan" />f(x)</li>
              <li className="flex items-center gap-2"><i className="inline-block w-[18px] h-2.5 border border-cyan bg-cyan-soft" />[a, b]</li>
              <li className="flex items-center gap-2"><i className="inline-block w-[18px] h-0 border-t-2 border-dashed border-brand" />c</li>
              <li className="flex items-center gap-2"><i className="inline-block w-2.5 h-2.5 rounded-full bg-brand" />f(x) = 0</li>
            </ul>
          </PsPanel>

          {error && (
            <div className="p-[16px_18px] border border-neg border-l-[5px] rounded-lg bg-[color-mix(in_srgb,var(--neg)_10%,transparent)]" role="alert">
              <b className="text-[14.5px]">{t('bisection.err_calc')}</b>
              <p className="mt-1.5 text-[14px] text-ink-2">{error}</p>
            </div>
          )}

          <PsPanel>
            <PsPanelHead eyebrow="Trace / Iterations" title={t('bisection.trace_title')} idx="03" />

            {!result && !error && (
              <div className="grid place-content-center min-h-[280px] text-center text-muted text-[14.5px] leading-[1.8]">
                <Waves size={52} className="mx-auto mb-2.5 text-cyan" />
                <p>
                  <b className="text-ink">{t('bisection.trace_empty_title')}</b><br />
                  {t('bisection.trace_empty_desc')}
                </p>
              </div>
            )}

            {result?.steps.length === 0 && (
              <div className="grid place-content-center min-h-[120px] text-center text-muted text-[14.5px] leading-[1.8]">
                <Check size={34} className="mx-auto mb-2.5 text-cyan" />
                <p>
                  <b className="text-ink">{t('bisection.trace_done_title')}</b><br />
                  {t('bisection.trace_done_desc')}
                </p>
              </div>
            )}

            {result?.steps.map((step) => (
              <article
                className={`p-[18px_0_18px_16px] border-b border-line border-l-[3px] ml-0.5 last:border-b-0 ${step.done ? 'border-l-brand bg-[linear-gradient(90deg,var(--brand-soft),transparent_55%)]' : 'border-l-line-2'}`}
                key={step.iteration}
              >
                <div className="flex justify-between gap-2 font-mono text-[13px] font-medium text-muted">
                  <b className="text-brand tracking-[.06em] uppercase">{t('bisection.step_title')} #{step.iteration}</b>
                  <span>{`|b − a| = ${format(step.width)} ${step.done ? '≤' : '>'} ε`}</span>
                </div>
                <div className="grid gap-1 my-3 p-3.5 bg-bg-2 border border-dashed border-line-2 rounded-lg font-mono text-[14px] font-medium leading-[1.6]">
                  <div>
                    a = {format(step.a)}{' '}
                    <b>
                      → f(a) = <i className={`font-semibold not-italic ${sign(step.fa)}`}>{format(step.fa)}</i>
                    </b>
                  </div>
                  <div>
                    b = {format(step.b)}{' '}
                    <b>
                      → f(b) = <i className={`font-semibold not-italic ${sign(step.fb)}`}>{format(step.fb)}</i>
                    </b>
                  </div>
                  <div className="grid gap-1.5 mt-2 pt-2.5 border-t border-dashed border-line-2">
                    <span>
                      {t('bisection.step_center')}{' '}
                      <span
                        className="[&_.katex]:text-[1.05em]"
                        dangerouslySetInnerHTML={{
                          __html: renderKatex(`c = \\frac{a + b}{2} = ${format(step.c)}`),
                        }}
                      />
                    </span>
                    <span>
                      {t('bisection.step_val')}{' '}
                      <i className={`font-semibold not-italic ${sign(step.fc)}`}>{format(step.fc, 8)}</i>
                    </span>
                  </div>
                </div>
                <p className="m-0 text-[14px] leading-[1.6] text-ink-2">
                  <b className="text-ink">{step.done ? t('bisection.step_res') : t('bisection.step_dec')}</b> {step.decision}
                  <br />
                  <span className="text-[13px] text-muted">{step.explanation}</span>
                </p>
              </article>
            ))}
          </PsPanel>
        </div>
      </div>

      <footer className="flex justify-between gap-3 flex-wrap mt-[26px] pt-3.5 border-t border-line font-mono text-[12.5px] font-medium tracking-[.06em] text-muted">
        <span>{t('bisection.footer_1')}</span>
        <span>{t('bisection.footer_2')}</span>
      </footer>
    </div>
  );
}

export default BisectionMethod;
